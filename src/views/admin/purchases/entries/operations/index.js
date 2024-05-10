import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import ActionsBackend from '../../../../../context/actionsBackend';
import AlertsContext from '../../../../../context/alerts';
import API_ROUTES from '../../../../../api/routes';
import ExcelPNG from 'assets/img/icons/excel.png';
import ImportData from './importData';
import LoadingContext from '../../../../../context/loading';
import swal from 'sweetalert';

const PurchasesEntriesOperations = ({
    purchasePeriod,
    accountsList,
    accountSearchFn,
    hasAccountingModule,
    activePeriod,
    refreshList,
    periodMonth,
    periodYear,
    setConfirmedPeriod
}) => {
    const [importFile, setImportFile] = useState()
    const [purchaseImported, setPurchaseImported] = useState(false)
    const [importDataModule, setImportDataModule] = useState(false)
    const { axiosGetFile, axiosPost, axiosPut, axiosPostFile, loadingActions } = useContext(ActionsBackend)
    const { newAlert, newActivity } = useContext(AlertsContext)
    const { setIsLoading } = useContext(LoadingContext)

    const importFromAFIP = async () => {
        const response = await axiosGetFile(API_ROUTES.purchasesDir.sub.receiptsTxt, purchasePeriod.id, "application/x-gzip")
        if (!response.error) {
            newActivity("Se generó un archivo TXT para AFIP", "success")
            newAlert("success", "Archivo generado con éxito!", "Descomprima el archivo para encontrar los TXT")
        } else {
            console.log(response.error)
            newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
        }
    }

    const processCVS = async (e) => {
        e.preventDefault()

        const data = new FormData()
        data.append("file", importFile)
        data.append("accountingPeriodId", activePeriod.id)
        const response = await axiosPost(API_ROUTES.purchasesDir.sub.cvsImport, data)
        if (!response.error) {
            const processedData = await Promise.all(response.data.map(async (receipt, key) => {
                return {
                    ...receipt,
                    id: key
                }
            }))
            setPurchaseImported(processedData)
            setImportDataModule(true)
        } else {
            newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
        }
    }

    const getReport = async () => {
        const response = await axiosPostFile(API_ROUTES.purchasesDir.sub.report, { purchasePeriodId: purchasePeriod.id }, 'application/pdf')
        if (!response.error) {
            newActivity("Se generó un reporte en PDF", "success")
            newAlert("success", "Reporte generado con éxito!", "Revise su carpeta de descargas")
        } else {
            console.log(response.error)
            newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
        }

    }

    const closePeriod = async (e) => {
        e.preventDefault()
        swal({
            title: "¿Está seguro de cerrar este periodo? Esta desición es permanente.",
            text: `Cerrar el periodo ${periodMonth}/${periodYear}. Una vez cerrado no se podrá modificar ni agregar nada nuevo.`,
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    const response = await axiosPut(API_ROUTES.purchasesDir.sub.period + "/close", {
                        purchasePeriodId: purchasePeriod.id,
                        accountingPeriodId: activePeriod.id
                    })
                    if (!response.error) {
                        newActivity("Se cerró un periodo", "success")
                        newAlert("success", "Periodo cerrado con éxito!", "Recuerde que no podrá modificar los datos de este periodo")
                        refreshList()
                        setConfirmedPeriod(false)
                    } else {
                        newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
                    }
                }
            });
    }

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    return (<>
        {
            importFile ?
                importDataModule ?
                    <ImportData
                        purchasePeriod={purchasePeriod}
                        setImportDataModule={setImportDataModule}
                        purchaseImported={purchaseImported}
                        setPurchaseImported={setPurchaseImported}
                        setImportFile={setImportFile}
                        accountsList={accountsList}
                        accountSearchFn={accountSearchFn}
                        hasAccountingModule={hasAccountingModule}
                        periodMonth={periodMonth}
                        periodYear={periodYear}
                        refreshListToggle={refreshList}
                    />
                    :
                    <Row>
                        <Col md="12" className="text-center">

                            <Row style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                                <Col md="12" style={{ textAlign: "center" }}>
                                    <button
                                        className="btn btn-danger"
                                        onClick={e => {
                                            setImportFile(null)
                                        }}
                                        style={{ position: "relative", right: "-120px", top: "-40px" }}
                                    > X
                                    </button>
                                    <img src={ExcelPNG} style={{ width: "80px" }} alt="Excel" />
                                    <h3 style={{ color: "green" }}>{importFile.name}</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12" style={{ textAlign: "center" }}>
                                    <button className="btn btn-warning" style={{ marginBottom: "30px" }} onClick={e => { processCVS(e) }} >Procesar Archivo</button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                : <Row>
                    <Col md="3" className="text-center">
                        <Button
                            disabled={purchasePeriod.closed}
                            color="primary"
                            onClick={e => {
                                e.preventDefault()
                                document.getElementById("selectFile").click()
                            }}
                        >Importar TXT desde AFIP <i className='fas fa-download ml-2'></i></Button>
                        <input type="file" placeholder="Selecciones archivo" id="selectFile" style={{ visibility: "hidden" }} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv" onChange={e => {
                            setImportFile(e.target.files[0])
                        }} />
                    </Col>
                    <Col md="3" className="text-center">
                        <Button
                            onClick={closePeriod}
                            disabled={purchasePeriod.closed}
                            color="primary">Cerrar Periodo <i className='fas fa-window-close ml-2'></i></Button>
                    </Col>
                    <Col md="3" className="text-center">
                        <Button
                            onClick={importFromAFIP}
                            color="primary">Exportar TXT para AFIP <i className='fas fa-upload ml-2'></i></Button>
                    </Col>
                    <Col md="3" className="text-center">
                        <Button
                            onClick={getReport}
                            color="primary">Descargar PDF<i className='fas fa-download ml-2'></i></Button>
                    </Col>
                </Row>
        }
    </>)
}

export default PurchasesEntriesOperations