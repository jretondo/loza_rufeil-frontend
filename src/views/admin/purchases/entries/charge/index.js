import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import ReceiptsChargeHeader from './header';
import ReceiptPaymentsTable from './paymentsMethods';
import ActionsBackend from 'context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import AlertsContext from 'context/alerts';
import ReceiptsConceptsTable from './receiptConcepts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PurchasesEntrySummary from './entry';
import TaxesEntry from './taxes';
import roundNumber from 'function/roundNumber';
import moment from 'moment';
import { invoiceTypeConvertObject } from '../../../../../function/invoiceType';

const PurchasesEntriesCharge = ({
    accountsList,
    hasAccountingModule,
    accountSearchFn,
    purchasePeriodId,
    refreshListToggle,
    periodMonth,
    periodYear,
    purchasePeriod,
    importedReceipt,
    setInvoiceSelected,
    setPurchaseImported,
    invoiceSelected
}) => {
    const [activeTab, setActiveTab] = useState(0)
    const [selectedProvider, setSelectedProvider] = useState(false)
    const [headerInvoice, setHeaderInvoice] = useState({
        date: "",
        total: 0,
        type: 0,
        word: "",
        sellPoint: "",
        number: "",
    })
    const [paymentsMethods, setPaymentsMethods] = useState([])
    const [receiptConcepts, setReceiptConcepts] = useState([])
    const [taxesList, setTaxesList] = useState([])
    const [detail, setDetail] = useState("")
    const [entryAmounts, setEntryAmounts] = useState({
        recorded: 0,
        unrecorded: 0,
        exempt: 0,
        payments: 0,
        taxes: 0,
    })
    const { axiosGetQuery, axiosPost } = useContext(ActionsBackend)
    const { newAlert, newActivity } = useContext(AlertsContext)

    const saveImportedInvoice = async () => {
        const data = {
            header: headerInvoice,
            payments: paymentsMethods.filter((payment) => payment.amount > 0),
            concepts: receiptConcepts.filter((concept) => concept.amount > 0),
            taxes: taxesList.filter((tax) => (tax.amount > 0 && tax.active)),
            purchasePeriodId: purchasePeriodId,
            provider: selectedProvider,
            observations: detail
        }
        const response = await axiosPost(API_ROUTES.purchasesDir.sub.checkReceipts, data)
        if (!response.error) {
            setPurchaseImported((prevState) => {
                return prevState.map((item) => {
                    if (item.id === invoiceSelected.id) {
                        const newInvoice = {
                            ...item,
                            header: headerInvoice,
                            payments: paymentsMethods.filter((payment) => payment.amount > 0),
                            concepts: receiptConcepts.filter((concept) => concept.amount > 0),
                            taxes: taxesList.filter((tax) => (tax.amount > 0 && tax.active)),
                            Provider: selectedProvider,
                            provider: selectedProvider,
                            observations: detail,
                            checked: true,
                            total: headerInvoice.total
                        }
                        return newInvoice
                    } else {
                        return item
                    }
                })
            })
            setInvoiceSelected(false)
        } else {
            newAlert("danger", "Error al guardar el comprobante", response.errorMsg)
        }
    }

    const submitForm = async () => {
        if (importedReceipt) {
            saveImportedInvoice()
        } else {
            await saveNewReceipt()
        }
    }

    const completeFieldsImported = () => {
        const invoiceNumber = parseInt(invoiceSelected.receipt_type)
        const { word, type } = invoiceTypeConvertObject(invoiceNumber)

        const newHeader = {
            date: moment(new Date(invoiceSelected.date)).format("YYYY-MM-DD"),
            total: invoiceSelected.total,
            type: type,
            word: word,
            sellPoint: invoiceSelected.sell_point,
            number: invoiceSelected.number,
        }
        setHeaderInvoice(newHeader)
        invoiceSelected.Provider && setSelectedProvider(invoiceSelected.Provider)
    }

    const saveNewReceipt = async () => {

        const data = {
            header: headerInvoice,
            payments: paymentsMethods.filter((payment) => payment.amount > 0),
            concepts: receiptConcepts.filter((concept) => concept.amount > 0),
            taxes: taxesList.filter((tax) => (tax.amount > 0 && tax.active)),
            purchasePeriodId: purchasePeriodId,
            provider: selectedProvider,
            observations: detail
        }
        const response = await axiosPost(API_ROUTES.purchasesDir.sub.receipt, data)
        if (!response.error) {
            setHeaderInvoice({ ...headerInvoice, total: 0 })
            newAlert("success", "Comprobante guardado correctamente")
            setDetail("")
            refreshListToggle()
            newActivity("Se cargó un nuevo comprobante de ID: " + response.data.id + " con un total de $" + response.data.total + " ")
            document.getElementById("order_1").focus()
        } else {
            newAlert("danger", "Error al guardar el comprobante", response.errorMsg)
        }
    }

    const getPaymentsMethods = async () => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.paymentsMethods, [])
        if (!response.error) {
            const arrayData = response.data.length > 0 ? response.data.map((payment, key) => {
                payment.id = key
                payment.amount = 0
                return payment
            }) : []
            setPaymentsMethods(arrayData)
        } else {
            setPaymentsMethods([])
            newAlert("danger", "Error al cargar los métodos de pago", response.errorMsg)
        }
    }

    const getProviderAccount = async () => {
        const response = await axiosGetQuery(API_ROUTES.providersDir.sub.parameters, [{ providerId: selectedProvider.id }])
        if (!response.error) {
            const arrayData = response.data.length > 0 ? response.data.map((account, key) => {
                key === 0 ? setDetail(account.description) : setDetail(`${detail}<br /> ${account.description}`)
                account.id = key
                account.amount = 0
                account.recordType = 0
                return account
            }) : []
            setReceiptConcepts(arrayData)
        } else {
            newAlert("danger", "Error al cargar las cuentas del proveedor", response.errorMsg)
        }
    }

    const getTaxes = async (vat_condition) => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.params, [{ vat_condition }])
        if (!response.error) {
            const arrayDataVat = response.data.vat.length > 0 ? response.data.vat.map((tax, key) => {
                tax.id = key
                tax.amount = 0
                return tax
            }) : []
            const arrayDataOthers = response.data.others.length > 0 ? response.data.others.map((tax, key) => {
                tax.id = arrayDataVat.length - 1 + key
                tax.amount = 0
                return tax
            }) : []
            setTaxesList([...arrayDataVat, ...arrayDataOthers])
        } else {
            newAlert("danger", "Error al cargar los impuestos del proveedor", response.errorMsg)
        }
    }

    const getVatAmount = (totalAmount, isRecorded) => {
        const newTaxesArray = taxesList.map((tax) => {
            if (roundNumber(totalAmount) > 0 && tax.active) {
                switch (parseInt(tax.type)) {
                    case 4:
                        tax.amount = !isRecorded ? (totalAmount - (totalAmount / (1.105))) : (totalAmount * 0.105)
                        tax.recorded = tax.amount / 0.105
                        break;
                    case 5:
                        tax.amount = !isRecorded ? (totalAmount - (totalAmount / (1.21))) : (totalAmount * 0.21)
                        tax.recorded = tax.amount / 0.21
                        break;
                    case 6:
                        tax.amount = !isRecorded ? (totalAmount - (totalAmount / (1.27))) : (totalAmount * 0.27)
                        tax.recorded = tax.amount / 0.27
                        break;
                    case 8:
                        tax.amount = !isRecorded ? (totalAmount - (totalAmount / (1.05))) : (totalAmount * 0.05)
                        tax.recorded = tax.amount / 0.05
                        break;
                    case 9:
                        tax.amount = !isRecorded ? (totalAmount - (totalAmount / (1.025))) : (totalAmount * 0.025)
                        tax.recorded = tax.amount / 0.025
                        break;
                    default:
                        break;
                }
            } else {
                tax.amount = 0
            }
            tax.amount = roundNumber(tax.amount)
            tax.recorded = roundNumber(tax.recorded)
            return tax
        })
        return { taxes: newTaxesArray, recorded: roundNumber(totalAmount - newTaxesArray.reduce((acc, tax) => acc + roundNumber(tax.amount), 0)) }
    }

    const setConceptsAmounts = () => {
        const newAmounts = {
            recorded: 0,
            unrecorded: 0,
            exempt: 0,
            payments: 0,
            taxes: 0
        }
        if (receiptConcepts.length > 0) {
            receiptConcepts.forEach((concept) => {
                if (concept.recordType === 0 && concept.amount > 0) {
                    newAmounts.recorded += roundNumber(concept.amount)
                } else if (concept.recordType === 1 && concept.amount > 0) {
                    newAmounts.unrecorded += roundNumber(concept.amount)
                } else if (concept.recordType === 2 && concept.amount > 0) {
                    newAmounts.exempt += roundNumber(concept.amount)
                }
            })
        }
        if (paymentsMethods.length > 0) {
            paymentsMethods.forEach((payment) => {
                if (payment.amount > 0) {
                    newAmounts.payments += roundNumber(payment.amount)
                }
            })
        }
        if (taxesList.length > 0) {
            taxesList.forEach((tax) => {
                if (tax.amount > 0) {
                    newAmounts.taxes += roundNumber(tax.amount)
                }
            })
        }
        setEntryAmounts(newAmounts)
    }

    const getAllData = async (vat_condition) => {
        await getPaymentsMethods()
        await getTaxes(vat_condition)
        await getProviderAccount()
    }

    const correctAmounts = () => {
        const { taxes, recorded } = getVatAmount(headerInvoice.total)
        setTaxesList(taxes)

        const newReceiptsArray = receiptConcepts.map((item, key) => {
            if (key === 0) {
                item.amount = roundNumber(recorded)
            }
            return item
        })
        setReceiptConcepts(newReceiptsArray)

        const newPaymentsPaymentsArray = paymentsMethods.map((item, key) => {
            if (key === 0) {
                item.amount = roundNumber(headerInvoice.total)
            }
            return item
        })
        setPaymentsMethods(newPaymentsPaymentsArray)
    }

    useEffect(() => {
        selectedProvider && getAllData(selectedProvider.iva_condition_id)
        // eslint-disable-next-line
    }, [selectedProvider])

    useEffect(() => {
        (selectedProvider && receiptConcepts) && correctAmounts()
        // eslint-disable-next-line
    }, [selectedProvider, headerInvoice.total, taxesList.filter((tax) => (tax.active && tax.is_vat)).length])

    useEffect(() => {
        (selectedProvider && receiptConcepts.length > 0) && correctAmounts()
        // eslint-disable-next-line
    }, [receiptConcepts.length])

    useEffect(() => {
        if (invoiceSelected && invoiceSelected.checked) {
            setPaymentsMethods(invoiceSelected.payments)
            setReceiptConcepts(invoiceSelected.concepts)
            setTaxesList(invoiceSelected.taxes)
            setSelectedProvider(invoiceSelected.Provider)
            setDetail(invoiceSelected.observations)
            setConceptsAmounts()
        } else {
            setConceptsAmounts()
        }
        // eslint-disable-next-line
    }, [receiptConcepts, paymentsMethods, taxesList])


    useEffect(() => {
        (invoiceSelected && importedReceipt) && completeFieldsImported();
        // eslint-disable-next-line
    }, [invoiceSelected, importedReceipt])

    return (
        <>
            {
                purchasePeriod.closed ?
                    <Row>
                        <Col md="12" className="text-center">
                            <h3>El periodo se encuentra cerrado - No se puede modificar</h3>
                        </Col>
                    </Row> :
                    <>
                        <Form onSubmit={
                            e => {
                                e.preventDefault()
                                submitForm(e)
                            }
                        }>
                            <ReceiptsChargeHeader
                                selectedProvider={selectedProvider}
                                setSelectedProvider={setSelectedProvider}
                                headerInvoice={headerInvoice}
                                setHeaderInvoice={setHeaderInvoice}
                                correctAmounts={correctAmounts}
                                periodMonth={periodMonth}
                                periodYear={periodYear}
                                importedReceipt={importedReceipt}
                            />
                            <Row className="mt-3">
                                <Col md="6">
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
                                        style={{ background: "#e8eaed" }}
                                    />
                                </Col>
                                <Col md="6" className="text-center" style={{ border: "2px solid #073863" }}>
                                    <PurchasesEntrySummary
                                        entryAmounts={entryAmounts}
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md="12" className="text-center">
                                    <Button
                                        disabled={!selectedProvider}
                                        color="primary"
                                        id="saveBtn"
                                        type="submit"
                                    >
                                        {importedReceipt ? "Chequear" : "Cargar"}
                                    </Button>
                                    <Button
                                        onClick={e => {
                                            e.preventDefault()
                                            importedReceipt && setInvoiceSelected(false)
                                        }}
                                        color="danger">
                                        Cancelar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <hr />
                        <Nav tabs className="mt-3" >
                            <NavItem style={{ cursor: "pointer" }}>
                                <NavLink
                                    style={activeTab === 0 ? { background: "gray", color: "white" } : { background: "#adb5bd" }}
                                    className={classNames({ active: activeTab === 0 })}
                                    onClick={() => setActiveTab(0)}
                                >
                                    Conceptos de gasto
                                </NavLink>
                            </NavItem>
                            <NavItem style={{ cursor: "pointer" }}>
                                <NavLink
                                    style={activeTab === 1 ? { background: "gray", color: "white" } : { background: "#adb5bd" }}
                                    className={classNames({ active: activeTab === 1 })}
                                    onClick={() => setActiveTab(1)}
                                >
                                    Metodos de pago
                                </NavLink>
                            </NavItem>
                            <NavItem style={{ cursor: "pointer" }}>
                                <NavLink
                                    style={activeTab === 2 ? { background: "gray", color: "white" } : { background: "#adb5bd" }}
                                    className={classNames({ active: activeTab === 2 })}
                                    onClick={() => setActiveTab(2)}
                                >
                                    Impuestos
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId={0} className="p-5" style={{ background: "gray", fontWeight: "bold", color: "#073863" }}>
                                <ReceiptsConceptsTable
                                    receiptConcepts={receiptConcepts}
                                    setReceiptConcepts={setReceiptConcepts}
                                    accountsList={accountsList}
                                    accountSearchFn={accountSearchFn}
                                    hasAccountingModule={hasAccountingModule}
                                />
                            </TabPane>
                            <TabPane tabId={1} className="p-5" style={{ background: "gray", fontWeight: "bold", color: "#073863" }} >
                                <ReceiptPaymentsTable
                                    paymentsArray={paymentsMethods}
                                    setPaymentsArray={setPaymentsMethods}
                                    accountsList={accountsList}
                                    accountSearchFn={accountSearchFn}
                                    hasAccountingModule={hasAccountingModule}
                                    setEntryAmounts={setEntryAmounts}
                                    entryAmounts={entryAmounts}
                                />
                            </TabPane>
                            <TabPane tabId={2} className="p-5" style={{ background: "gray", fontWeight: "bold", color: "#073863" }}>
                                <TaxesEntry
                                    taxesList={taxesList}
                                    setTaxesList={setTaxesList}
                                    hasAccountingModule={hasAccountingModule}
                                    accountsList={accountsList}
                                    accountSearchFn={accountSearchFn}
                                />
                            </TabPane>
                        </TabContent>
                    </>
            }
        </>
    )
}

export default PurchasesEntriesCharge