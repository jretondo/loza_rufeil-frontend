import InputSearch from 'components/Search/InputSearch';
import API_ROUTES from '../../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import LoadingContext from 'context/loading';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, Row } from 'reactstrap';
import ProviderForm from '../../providers/form';
import moment from 'moment';

const ReceiptsChargeHeader = ({
    selectedProvider,
    setSelectedProvider,
    headerInvoice,
    setHeaderInvoice,
    correctAmounts,
    periodMonth,
    periodYear
}) => {
    const activeClient = JSON.parse(localStorage.getItem("activeClient"))
    const [providersList, setProvidersList] = useState([])
    const [dateLimitMax, setDateLimitMax] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [dateLimitMin, setDateLimitMin] = useState(moment(new Date()).format("YYYY-MM-DD"))

    const [isOpenNewProvider, setIsOpenNewProvider] = useState(false)

    const { axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)
    const { newAlert } = useContext(AlertsContext)

    const getProviders = async () => {
        const response = await axiosGetQuery(API_ROUTES.providersDir.providers, [])
        if (!response.error) {
            setProvidersList(response.data)
        } else {
            setProvidersList([])
            newAlert("danger", "Error al cargar los proveedores", response.errorMsg)
        }
    }

    const nextInput = (e, order) => {
        if (e.keyCode === 13 || e.keyCode === 9) {
            e.preventDefault()
            order === 1 && selectedProvider && setSelectedProvider(false)
            order === 3 && selectedProvider && setHeaderInvoice({ ...headerInvoice, type: false })
            if (order === 7) {
                document.getElementById("saveBtn").focus()
            } else {
                const newOrder = order + 1
                try {
                    document.getElementById("order_" + newOrder).focus()
                } catch (error) {
                }
            }

        }
    }

    const changeWord = (w) => {
        switch (w.toString()) {
            case "1":
                setHeaderInvoice({ ...headerInvoice, word: "A" })
                break;
            case "2":
                setHeaderInvoice({ ...headerInvoice, word: "B" })
                break;
            case "3":
                setHeaderInvoice({ ...headerInvoice, word: "C" })
                break;
            case "4":
                setHeaderInvoice({ ...headerInvoice, word: "M" })
                break;
            default:
                setHeaderInvoice({ ...headerInvoice, word: w.toUpperCase() })
                break;
        }
    }

    const providerSearchFn = (provider, searchedText) => {
        if ((`${provider.business_name} (${provider.document_number})`).toLowerCase().includes(searchedText.toLowerCase())) {
            return provider
        }
    }

    const invoiceTypeSearchFn = (invoiceType, searchedText) => {
        if (invoiceType.name.toLowerCase().includes(searchedText.toLowerCase())) {
            return invoiceType
        }
    }

    const wordCalculator = (providerSelected, clientActive) => {
        const providerVatCondition = providerSelected.iva_condition_id
        const clientVatCondition = clientActive.iva_condition_id

        switch ([providerVatCondition, clientVatCondition]) {
            case providerVatCondition === 30 && clientVatCondition === 30:
                setHeaderInvoice({ ...headerInvoice, word: "A" })
                break;
            case clientVatCondition === 32 && providerVatCondition === 30:
                setHeaderInvoice({ ...headerInvoice, word: "B" })
                break;
            case clientVatCondition === 20 && providerVatCondition === 30:
                setHeaderInvoice({ ...headerInvoice, word: "B" })
                break;
            default:
                setHeaderInvoice({ ...headerInvoice, word: "C" })
                break;
        }
    }

    useEffect(() => {
        console.log('periodYear :>> ', periodYear);
        console.log('periodMonth :>> ', periodMonth);
        const nextPeriod = moment(`${periodYear}-${periodMonth}-01`).add(1, "month")
        setDateLimitMax(moment(nextPeriod).format("YYYY-MM-DD"))
        const dateLimitMin = moment(`${periodYear}-${periodMonth}-01`).subtract(3, "month")
        setDateLimitMin(moment(dateLimitMin).format("YYYY-MM-DD"))
    }, [periodMonth, periodYear])

    useEffect(() => {
        getProviders()
        // eslint-disable-next-line
    }, [isOpenNewProvider])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    useEffect(() => {
        selectedProvider && wordCalculator(selectedProvider, activeClient)
        // eslint-disable-next-line
    }, [selectedProvider])

    return (<>

        <Row>
            <Col md="3">
                <FormGroup>
                    <Label>Fecha</Label>
                    <Input
                        required
                        value={headerInvoice.date}
                        max={dateLimitMax}
                        min={dateLimitMin}
                        onChange={
                            e => setHeaderInvoice(
                                { ...headerInvoice, date: e.target.value })
                        }
                        id="order_1"
                        type="date"
                        onKeyDown={
                            (e) => nextInput(e, 1)} />
                </FormGroup>
            </Col>
            <Col md="6">
                <Label>Proveedor</Label>
                <Button
                    className="p-0 px-1 ml-2"
                    color="primary"
                    onClick={() => setIsOpenNewProvider(true)}
                ><i className='fas fa-plus'></i></Button>
                <InputSearch
                    id="order_2"
                    itemsList={providersList}
                    itemSelected={selectedProvider}
                    title={""}
                    placeholderInput={"Busque un proveedor..."}
                    getNameFn={(providerItem) => `${providerItem.business_name} (${providerItem.document_number})`}
                    setItemSelected={setSelectedProvider}
                    searchFn={providerSearchFn}
                    strict={true}
                    cbStrict={(text) => newAlert("danger", "Error", "No se encontró el proveedor: " + text)}
                    nextFn={() => document.getElementById("order_3").focus()}
                />
            </Col>
            <Col md="3">
                <FormGroup>
                    <Label>Importe</Label>
                    <Input
                        required
                        min={0.01}
                        step={0.01}
                        value={headerInvoice.total}
                        onChange={e => setHeaderInvoice({ ...headerInvoice, total: parseFloat(e.target.value) })}
                        type="number"
                        id="order_3"
                        onKeyDown={(e) => nextInput(e, 3)}
                        onFocus={(e) => e.target.select()}
                        onBlur={async () => {
                            correctAmounts()
                        }}
                    />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md="3">
                <InputSearch
                    id="order_4"
                    itemsList={[
                        { id: 1, name: "Factura" },
                        { id: 2, name: "Recibo" },
                        { id: 3, name: "Ticket" },
                        { id: 4, name: "Nota de crédito" },
                        { id: 5, name: "Nota de débito" },
                    ]}
                    itemSelected={headerInvoice.type}
                    title={"Tipo"}
                    placeholderInput={"Busque un tipo de comprobante..."}
                    getNameFn={(type) => `${type.name}`}
                    setItemSelected={(newType) => setHeaderInvoice({ ...headerInvoice, type: newType })}
                    searchFn={invoiceTypeSearchFn}
                    strict={true}
                    cbStrict={(text) => newAlert("danger", "Error", "No se encontró el tipo: " + text)}
                    nextFn={() => document.getElementById("order_5").focus()}
                />
            </Col>
            <Col md="2">
                <FormGroup>
                    <Label>Letra</Label>
                    <Input
                        required
                        value={headerInvoice.word}
                        onChange={e => changeWord(e.target.value)}
                        maxLength={1}
                        id="order_5"
                        type="text"
                        onKeyDown={(e) => nextInput(e, 5)}
                        onFocus={(e) => e.target.select()}
                    />
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup>
                    <Label>PV</Label>
                    <Input
                        required
                        value={headerInvoice.sellPoint}
                        onChange={e => setHeaderInvoice({ ...headerInvoice, sellPoint: e.target.value })}
                        id="order_6"
                        type="number"
                        onKeyDown={(e) => nextInput(e, 6)}
                        onFocus={(e) => e.target.select()}
                    />
                </FormGroup>
            </Col>
            <Col md="4">
                <FormGroup>
                    <Label>Número</Label>
                    <Input
                        required
                        value={headerInvoice.number}
                        onChange={e => setHeaderInvoice({ ...headerInvoice, number: e.target.value })}
                        id="order_7"
                        type="number"
                        onKeyDown={(e) => nextInput(e, 7)}
                        onFocus={(e) => e.target.select()}
                    />
                </FormGroup>
            </Col>
        </Row>
        <Modal size="lg" isOpen={isOpenNewProvider} toggle={() => setIsOpenNewProvider(!isOpenNewProvider)}>
            <ProviderForm
                setIsOpenProviderForm={setIsOpenNewProvider}
                setIsLoading={setIsLoading}
            />
        </Modal>
    </>);
}

export default ReceiptsChargeHeader;