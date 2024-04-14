import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import swal from 'sweetalert';
import { numberFormat } from '../../../../../function/numberFormat';
import AlertsContext from '../../../../../context/alerts';
import ActionsBackend from '../../../../../context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import LoadingContext from '../../../../../context/loading';
import InputSearch2 from '../../../../../components/Search/InputSearch2';
import roundNumber from '../../../../../function/roundNumber';

const ChargeEntriesComp = ({
    accountsList,
    entryDetails,
    setEntryDetails,
    activeTab,
    importedToggle,
    purchasePeriodId,
    sellsPeriodId
}) => {
    const [idFocused, setIdFocused] = useState(0);
    const [lastEntryActive, setLastEntryActive] = useState(false)
    const [entryNumber, setEntryNumber] = useState(entryDetails ? entryDetails.number : 1)
    const [dateEntry, setDateEntry] = useState(entryDetails ? entryDetails.date : new Date())
    const [datesLimits, setDatesLimits] = useState({
        min: "",
        max: ""
    })
    const [detail, setDetail] = useState(entryDetails ? entryDetails.description : "")
    const [entries, setEntries] = useState(entryDetails ? entryDetails.AccountingEntriesDetails.map((account, key) =>
    ({
        id: key + 1,
        account: accountsList.find((item) => item.id === account.account_chart_id),
        debit: account.debit,
        credit: account.credit
    })
    ) : [{
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

    const refDetailComp = useRef(null);
    const refDateComp = useRef(null);

    const { newAlert, newActivity } = useContext(AlertsContext)
    const { axiosGetQuery, axiosPost, axiosPut, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)

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
            }, 0).toFixed(2)
            const credits = entries.reduce((acc, entry) => {
                return acc + parseFloat(entry.credit)
            }, 0).toFixed(2)
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
                purchasePeriodId,
                sellsPeriodId,
                number: entryNumber,
                date: dateEntry,
                description: detail,
                debit: roundNumber(totalDebit),
                credit: roundNumber(totalCredit),
                AccountingEntriesDetails: entries.map((entry) => {
                    return {
                        account_chart_id: entry.account.id,
                        debit: roundNumber(parseFloat(entry.debit)),
                        credit: roundNumber(parseFloat(entry.credit))
                    }
                })
            }
            entryDetails ? (data.id = entryDetails.id) : (data.id = undefined)
            let response
            if (entryDetails && !importedToggle) {
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
                importedToggle && importedToggle()
            } else {
                newAlert("danger", "Error al guardar el asiento", response.errorMsg)
            }
        }
    }

    const handleFocus = (hashId, event) => {
        setIdFocused(hashId);
        try {
            event.target && event.target.select();
        } catch (error) {

        }
    };

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    useEffect(() => {
        getLastEntryNumber()
        // eslint-disable-next-line
    }, [entryNumber, activeTab])

    useEffect(() => {
        setLastEntryActive(true)
        // eslint-disable-next-line
    }, [entries.length])

    return (
        <Form>
            <h2 className='text-center'>{entryDetails ? `Detalles asiento Nº: ${entryDetails.number}` : "Nuevo Asiento"}</h2>
            <Row className="mx-0">
                <Col md="4" className="p-2">
                    <FormGroup>
                        <Label>Nº Asiento</Label>
                        <Input style={{ fontWeight: "bold" }} value={entryNumber} type="text" disabled />
                    </FormGroup>
                </Col>
            </Row>
            <hr className='m-0 mb-1' />
            <Row className="mx-0">
                <Col md="6" className="p-2">
                    <FormGroup className="m-0">
                        <Label>Cuenta</Label>
                    </FormGroup>
                </Col>
                <Col md="2" className="p-2">
                    <FormGroup className="m-0">
                        <Label>Debe</Label>
                    </FormGroup>
                </Col>
                <Col md="2" className="p-2">
                    <FormGroup className="m-0">
                        <Label>Haber</Label>
                    </FormGroup>
                </Col>
                <Col md="4" className="p-2"></Col>
            </Row>
            {entries && entries.map((entry, key) => (
                <Row key={key} className="mx-0">
                    <Col md="6" className="p-2">
                        <FormGroup className="m-0">
                            <InputSearch2
                                itemsList={accountsList}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                id={`account-${key}`}
                                autoFocus={entries.length - 1 === key ? lastEntryActive : false}
                                onFocus={(e) => handleFocus(`account-${key}`, e)}
                                itemSelected={entry.account}
                                setItemSelected={(item) => {
                                    const newEntries = entries.map((entry, index) => {
                                        if (index === key) {
                                            entry.account = item
                                        }
                                        return entry
                                    })
                                    setEntries(newEntries)
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="2" className="p-2">
                        <FormGroup className="m-0">
                            <Input
                                onFocus={(e) => handleFocus(`debit-${key}`, e)}
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
                    <Col md="2" className="p-2">
                        <FormGroup className="m-0">
                            <Input
                                onFocus={(e) => handleFocus(`credit-${key}`, e)}
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
                    <Col md="2" className="p-2">
                        <Button
                            onFocus={(e) => handleFocus(`delete-${key}`, e)}
                            color={idFocused === `delete-${key}` ? "primary" : "danger"}
                            onClick={e => {
                                e.preventDefault()
                                setEntries(() => entries.filter((item) => item.id !== entry.id))
                            }}
                        >
                            <i className="fas fa-trash"></i> Eliminar
                        </Button>
                    </Col>
                </Row>
            ))}
            <Row className="mx-0">
                <Col md="4" className="p-2">
                    <Button
                        onFocus={(e) => handleFocus(`add-button`, e)}
                        color={idFocused === `add-button` ? "primary" : "secondary"}
                        onClick={e => {
                            e.preventDefault()
                            setEntries([
                                ...entries,
                                { id: entries.length + 1, account: false, debit: 0, credit: 0 }
                            ])
                        }}
                        onKeyDown={e => {
                            if (e.keyCode === 9) {
                                refDetailComp.current.focus();
                            }
                        }}
                    >
                        <i className="fas fa-plus"></i> Agregar nueva cuenta
                    </Button>
                </Col>
                <Col md="2" className="p-2">
                </Col>
                <Col md="2" className="p-2">
                    <FormGroup className="m-0">
                        <Input
                            type="text"
                            value={numberFormat(entries.reduce((acc, entry) => {
                                return acc + parseFloat(entry.debit)
                            }, 0))}
                            disabled
                        />
                    </FormGroup>
                </Col>
                <Col md="2" className="p-2">
                    <FormGroup className="m-0">
                        <Input
                            type="text"
                            value={numberFormat(entries.reduce((acc, entry) => {
                                return acc + parseFloat(entry.credit)
                            }, 0))}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row className="mx-0">
                <Col md="8" className="p-2">
                    <FormGroup >
                        <Label>Detalle</Label>
                        <Input
                            type="textarea"
                            name="text"
                            style={{ height: "180px" }}
                            onFocus={(e) => handleFocus(`detail-component`, e)}
                            id='detail-component'
                            ref={refDetailComp}
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            onKeyDown={e => {
                                if (e.keyCode === 9) {
                                    refDateComp.current.focus();
                                }
                            }}
                        />
                    </FormGroup>
                </Col>
                <Col md="4" className="p-2">
                    <FormGroup>
                        <Label>Fecha</Label>
                        <Input
                            onFocus={(e) => handleFocus(`date-entry`, e)}
                            ref={refDateComp}
                            type="date"
                            index="1"
                            min={datesLimits.min}
                            max={datesLimits.max}
                            value={dateEntry}
                            onChange={e => setDateEntry(e.target.value)}
                            onKeyDown={e => {
                                if (e.keyCode === 13) {
                                    saveEntries()
                                }
                            }}
                        />
                    </FormGroup>
                    <Button
                        index="2"
                        className="mt-2"
                        onClick={e => {
                            e.preventDefault()
                            saveEntries()
                        }}
                        onFocus={(e) => handleFocus(`save-button`, e)}
                        color={idFocused === `save-button` ? "primary" : "success"}
                    >
                        {entryDetails && !importedToggle ?
                            "Modificar Asiento"
                            : "Guardar Asiento"
                        } <i className='fas fa-save'></i>
                    </Button>
                    <Button
                        index="3"
                        className="mt-2"
                        onClick={e => {
                            setEntries([])
                            setDetail("")
                            setDateEntry(new Date())
                            getLastEntryNumber()
                            entryDetails && setEntryDetails(false)
                            importedToggle && importedToggle()
                        }}
                        onFocus={(e) => handleFocus(`cancel-button`, e)}
                        color={idFocused === `cancel-button` ? "primary" : "danger"}
                    >
                        Cancelar <i className='fas fa-times'></i>
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default ChargeEntriesComp;