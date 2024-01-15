import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import InputSearch from '../../../../../components/Search/InputSearch';
import { numberFormat } from '../../../../../function/numberFormat';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import swal from 'sweetalert';
import AlertsContext from '../../../../../context/alerts';
import ActionsBackend from '../../../../../context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import LoadingContext from '../../../../../context/loading';

const ChargeEntriesComp = ({
    accountsList,
    entryDetails,
    setEntryDetails
}) => {
    const [entryNumber, setEntryNumber] = useState(1)
    const [dateEntry, setDateEntry] = useState(new Date())
    const [datesLimits, setDatesLimits] = useState({
        min: "",
        max: ""
    })
    const [detail, setDetail] = useState("")
    const [entries, setEntries] = useState([{
        id: 1,
        account: false,
        debit: 0,
        credit: 0
    }, {
        id: 2,
        account: false,
        debit: 0,
        credit: 0

    }])

    const { newAlert, newActivity } = useContext(AlertsContext)
    const { axiosGetQuery, axiosPost, axiosPut, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)

    const accountSearchFn = (account, searchedText) => {
        if ((account.name).toLowerCase().includes(searchedText.toLowerCase()) || (account.code).toLowerCase().includes(searchedText.toLowerCase())) {
            return account
        }
    }

    const getLastEntryNumber = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.lastEntryData, entryDetails ? [{ entryNumber: entryDetails.number }] : [])
        if (!response.error) {
            entryDetails ? setEntryNumber(entryDetails.number) : setEntryNumber(response.data.lastNumber)
            entryDetails ? setDateEntry(entryDetails.date) : setDateEntry(response.data.minLimitDate)
            setDatesLimits({
                min: response.data.minLimitDate.toString(),
                max: response.data.maxLimitDate.toString()
            })

        } else {
            newAlert("danger", "Error al cargar el número de asiento", response.errorMsg)
        }
    }

    const checkEntries = () => {
        let errors = []
        entries.forEach((entry) => {
            if (!entry.account) {
                errors.push("Debe seleccionar una cuenta")
            }
            if (entry.debit === 0 && entry.credit === 0) {
                errors.push("Debe ingresar un monto")
            }
            const debits = entries.reduce((acc, entry) => {
                return acc + parseFloat(entry.debit)
            }, 0)
            const credits = entries.reduce((acc, entry) => {
                return acc + parseFloat(entry.credit)
            }, 0)
            if (debits !== credits) {
                errors.push("El debe y el haber no coinciden")
            }
        })
        if (entries.length < 2) {
            errors.push("Debe ingresar al menos dos cuentas")
        }
        return errors.filter((item, index) => {
            return errors.indexOf(item) === index
        })
    }

    const saveEntries = async () => {
        const errors = checkEntries()
        if (errors.length > 0) {
            swal("Errores: ", errors.join("\n"), "error")
        } else {
            const totalDebit = entries.reduce((acc, entry) => {
                return acc + parseFloat(entry.debit)
            }, 0)
            const totalCredit = entries.reduce((acc, entry) => {
                return acc + parseFloat(entry.credit)
            }, 0)
            let data = {
                number: entryNumber,
                date: dateEntry,
                description: detail,
                debit: totalDebit,
                credit: totalCredit,
                AccountingEntriesDetails: entries.map((entry) => {
                    return {
                        account_chart_id: entry.account.id,
                        debit: parseFloat(entry.debit),
                        credit: parseFloat(entry.credit)
                    }
                })
            }
            entryDetails ? (data.id = entryDetails.id) : (data.id = undefined)
            let response
            if (entryDetails) {
                response = await axiosPut(API_ROUTES.accountingDir.sub.accountingEntry, data, true)
            } else {
                response = await axiosPost(API_ROUTES.accountingDir.sub.accountingEntry, data)
            }
            if (!response.error) {
                newAlert("success", "Asiento guardado correctamente", "")
                newActivity("Asiento guardado correctamente")
                setEntries([{
                    id: 1,
                    account: false,
                    debit: 0,
                    credit: 0
                }, {
                    id: 2,
                    account: false,
                    debit: 0,
                    credit: 0

                }])
                setDetail("")
                setDateEntry(new Date())
                getLastEntryNumber()
                entryDetails && setEntryDetails(false)
            } else {
                newAlert("danger", "Error al guardar el asiento", response.errorMsg)
            }
        }
    }

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    useEffect(() => {
        getLastEntryNumber()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (entryDetails) {
            setEntryNumber(entryDetails.number)
            setDateEntry(entryDetails.date)
            setDetail(entryDetails.description)
            setEntries(entryDetails.AccountingEntriesDetails.map((entry) => {
                return {
                    id: entry.id,
                    account: entry.AccountChart,
                    debit: entry.debit,
                    credit: entry.credit
                }
            }))
        }
    }, [entryDetails])

    return (
        <Form>
            <h2 className='text-center'>{entryDetails ? "Detalles asiento Nº: " + entryDetails.number : "Nuevo Asiento"}</h2>
            <Row className="mx-1">
                <Col md="3" className="p-3 m-3" style={{ border: "4px #5d7d99 solid" }}>
                    <FormGroup>
                        <Label>Nº Asiento</Label>
                        <Input style={{ fontWeight: "bold" }} value={entryNumber} type="text" disabled />
                    </FormGroup>
                </Col>
                <Col md="3" className="p-3 m-3" style={{ border: "4px #5d7d99 solid" }}>
                    <FormGroup>
                        <Label>Fecha</Label>
                        <Input
                            type="date"
                            min={datesLimits.min}
                            max={datesLimits.max}
                            value={dateEntry}
                            onChange={e => setDateEntry(e.target.value)}

                        />
                    </FormGroup>
                </Col>
                <Col className="pt-5" md="5" style={{ textAlign: "right" }}>
                    <Button
                        color="primary"
                        className="ml-2 h-50"
                        onClick={e => {
                            e.preventDefault()
                            saveEntries()
                        }}
                    >
                        Guardar Asiento <i className='fas fa-save'></i>
                    </Button>
                    <Button
                        color="danger"
                        className="ml-2 h-50"
                        onClick={e => {
                            if (dateEntry) {
                                setEntryDetails(false)
                            } else {
                                setEntries([{
                                    id: 1,
                                    account: false,
                                    debit: 0,
                                    credit: 0
                                }, {
                                    id: 2,
                                    account: false,
                                    debit: 0,
                                    credit: 0

                                }])
                                setDetail("")
                                setDateEntry(new Date())
                                getLastEntryNumber()
                            }
                        }}
                    >
                        Cancelar <i className='fas fa-times'></i>
                    </Button>
                </Col>


            </Row>
            <Row className="pt-2 mx-3" style={{ borderTop: "4px #5d7d99 solid", borderRight: "4px #5d7d99 solid", borderLeft: "4px #5d7d99 solid" }}>
                <Col md="5">
                    <FormGroup>
                        <Label>Cuenta</Label>
                    </FormGroup>
                </Col>
                <Col md="3">
                    <FormGroup>
                        <Label>Debe</Label>
                    </FormGroup>
                </Col>
                <Col md="3">
                    <FormGroup>
                        <Label>Haber</Label>
                    </FormGroup>
                </Col>
            </Row>
            {
                entries && entries.map((entry, key) => {
                    return (
                        <Row key={key} className="px-3 mx-3" style={{ borderRight: "4px #5d7d99 solid", borderLeft: "4px #5d7d99 solid" }}>
                            <Col md="5">
                                <FormGroup>
                                    <InputSearch
                                        itemsList={accountsList}
                                        setItemsList={() => { }}
                                        itemSelected={entry.account}
                                        placeholderInput={"Busque una cuenta..."}
                                        getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                        setItemSelected={(item) => {
                                            const newEntries = entries.map((entry, index) => {
                                                if (index === key) {
                                                    entry.account = item
                                                }
                                                return entry
                                            })
                                            setEntries(newEntries)
                                        }}
                                        searchFn={accountSearchFn}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Input
                                        type="number"
                                        value={entry.debit}
                                        onChange={(e) => {
                                            const newEntries = entries.map((entry, index) => {
                                                if (index === key) {
                                                    entry.debit = e.target.value
                                                    entry.credit = 0
                                                }
                                                return entry
                                            })
                                            setEntries(newEntries)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Input
                                        type="number"
                                        value={entry.credit}
                                        onChange={(e) => {
                                            const newEntries = entries.map((entry, index) => {
                                                if (index === key) {
                                                    entry.credit = e.target.value
                                                    entry.debit = 0
                                                }
                                                return entry
                                            })
                                            setEntries(newEntries)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1">
                                <Button
                                    color="danger"
                                    onClick={e => {
                                        e.preventDefault()
                                        setEntries((entries) => {
                                            return entries.filter((item) => item.id !== entry.id)
                                        })
                                    }}
                                >
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </Col>
                        </Row>
                    )
                })
            }
            <Row className="pb-3 mx-3" style={{ borderRight: "4px #5d7d99 solid", borderLeft: "4px #5d7d99 solid", borderBottom: "4px #5d7d99 solid" }}>
                <Col md="12" className="text-center">
                    <Button
                        color="primary"
                        onClick={e => {
                            e.preventDefault()
                            setEntries([...entries,
                            {
                                id: entries.length + 1,
                                account: false,
                                debit: 0,
                                credit: 0
                            }])
                        }}
                    >
                        <i className="fas fa-plus"></i>
                    </Button>
                </Col>
            </Row>
            <Row className="p-3 m-3" style={{ border: "4px #f5365c solid" }}>
                <Col md="5">
                    <h3>TOTAL:</h3>
                </Col>
                <Col md="3">
                    <h3>$ {
                        numberFormat(entries ? entries.reduce((acc, entry) => {
                            return acc + parseFloat(entry.debit)
                        }, 0) : 0)
                    }</h3>
                </Col>
                <Col md="3">
                    <h3>$ {
                        numberFormat(entries ? entries.reduce((acc, entry) => {
                            return acc + parseFloat(entry.credit)
                        }, 0) : 0)
                    }</h3>
                </Col>
                <Col md="1">

                </Col>
            </Row>
            <Row className="mx-1 mr-4">
                <Col md="12" className="p-3 m-3" style={{ border: "4px #5d7d99 solid" }}>
                    <FormGroup>
                        <Label>Detalle</Label>
                        <ReactQuill
                            theme="snow"
                            value={detail}
                            onChange={setDetail}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }]
                                ]
                            }}
                            style={{ background: "#e8eaed", height: "200px" }}
                        />
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}

export default ChargeEntriesComp;