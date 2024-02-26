import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { TableList } from '../../../../../components/Lists/TableList';
import RowImportPurchase from './rowImportPurchase';
import InvoiceDataConcepts from './concepts';
import swal from 'sweetalert';
import ActionsBackend from '../../../../../context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import LoadingContext from '../../../../../context/loading';

const ImportData = ({
    purchasePeriod,
    setImportDataModule,
    purchaseImported,
    setImportFile,
    accountsList,
    accountSearchFn,
    hasAccountingModule,
    setPurchaseImported,
    periodMonth,
    periodYear,
    refreshListToggle
}) => {
    const [invoiceSelected, setInvoiceSelected] = useState(false)

    const { axiosPost, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)

    const importData = async (e) => {
        e.preventDefault()
        const notCheck = purchaseImported.filter(item => !item.checked)
        if (notCheck.length > 0) {
            swal("Error", "Hay comprobantes sin chequear", "error")
        } else {
            let data = {
                receipts: purchaseImported
            }
            data = {
                ...data,
                purchase_period_id: purchasePeriod.id,
            }
            const response = await axiosPost(API_ROUTES.purchasesDir.sub.receipts, data)
            if (!response.error) {
                swal("Éxito", "Se importaron los datos", "success")
                setImportDataModule(false)
                setImportFile(false)
                setPurchaseImported([])
                refreshListToggle()

            } else {
                swal("Error", "Hubo un error al importar los datos: " + response.errorMsg.toString(), "error")
            }
        }
    }

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])
    return (
        <>
            {
                invoiceSelected ? <InvoiceDataConcepts
                    accountsList={accountsList}
                    setInvoiceSelected={setInvoiceSelected}
                    hasAccountingModule={hasAccountingModule}
                    accountSearchFn={accountSearchFn}
                    purchasePeriodId={purchasePeriod.Id}
                    refreshListToggle={refreshListToggle}
                    periodMonth={periodMonth}
                    periodYear={periodYear}
                    purchasePeriod={purchasePeriod}
                    setPurchaseImported={setPurchaseImported}
                    invoiceSelected={invoiceSelected}
                /> :
                    <>
                        <Row>
                            <Col md="12" className="text-center">
                                <TableList titlesArray={["Fecha", "Comprobante", "Proveedor", "Conceptos", "Importe Total", ""]}>
                                    {
                                        purchaseImported && purchaseImported.map((receipt, key) => {
                                            return <RowImportPurchase
                                                key={key}
                                                id={key}
                                                receipt={receipt}
                                                setPurchaseImported={setPurchaseImported}
                                                setInvoiceSelected={setInvoiceSelected}
                                            />
                                        })
                                    }
                                </TableList>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" className="text-center mt-3">
                                <Button
                                    color="primary"
                                    onClick={importData}
                                >
                                    Insertar datos
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={e => {
                                        setImportFile(false)
                                        setImportDataModule(false)
                                    }}
                                >
                                    Cerrar
                                </Button>
                            </Col>
                        </Row>
                    </>
            }
        </>
    )
}

export default ImportData