import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Collapse, Input, Row } from 'reactstrap';
import ActionsBackend from '../../../../../context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import AlertsContext from '../../../../../context/alerts';
import { monthToStr } from '../../../../../function/monthStr';
import ChargeEntriesComp from '../charge';
import roundNumber from '../../../../../function/roundNumber';

const OperationsEntries = ({ accountsList, activeTab }) => {
    const activePeriod = JSON.parse(localStorage.getItem("activePeriod"))

    const [options, setOptions] = useState(0)
    const [purchasesClosed, setPurchasesClosed] = useState([])
    const [purchaseSelected, setPurchaseSelected] = useState()
    const [purchaseImported, setPurchaseImported] = useState(false)
    const [importedFlag, setImportedFlag] = useState(false)

    const { axiosGetQuery, axiosGet } = useContext(ActionsBackend)
    const { newAlert } = useContext(AlertsContext)

    const getClosedPurchasePeriods = async () => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.periods + "/closed", [{ accountingPeriodId: activePeriod.id }])
        if (!response.error) {
            setPurchaseSelected(false)
            setPurchasesClosed(response.data)
        } else {
            newAlert("danger", "Error al cargar las cuentas atribuibles", response.errorMsg)
        }
    }

    const purchasesImport = async (e) => {
        e.preventDefault()
        if (!JSON.parse(purchaseSelected)) {
            newAlert("danger", "Error", "Debe seleccionar un periodo")
            return
        }
        const response = await axiosGet(API_ROUTES.purchasesDir.sub.entries, JSON.parse(purchaseSelected).id)
        if (!response.error) {
            const lastData = await getLastEntryNumber()
            const entryData = {
                AccountingEntriesDetails: response.data.map((account, key) =>
                ({
                    id: key + 1,
                    account_chart_id: account.account_chart_id,
                    debit: roundNumber(parseFloat(account.debit)),
                    credit: roundNumber(parseFloat(account.credit))
                })),
                number: lastData.number,
                date: lastData.date,
                description: "Asiento de compras del periodo " + monthToStr(JSON.parse(purchaseSelected).month) + "/" + JSON.parse(purchaseSelected).year
            }
            setPurchaseImported(entryData)
        } else {
            newAlert("danger", "Error al cargar las cuentas atribuibles", response.errorMsg)
        }
    }

    const getLastEntryNumber = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.lastEntryData, [])
        if (!response.error) {
            return {
                number: response.data.lastNumber,
                date: response.data.minLimitDate
            }
        } else {
            newAlert("danger", "Error al cargar el número de asiento", response.errorMsg)
            return false
        }
    }

    useEffect(() => {
        setOptions(0)
        // eslint-disable-next-line
    }, [importedFlag])

    useEffect(() => {
        options === 1 && getClosedPurchasePeriods()
        // eslint-disable-next-line
    }, [options, importedFlag, activeTab])

    return (<>
        <Collapse isOpen={options === 0 ? true : false} >
            <Row>
                <Col md="6" className="text-center">
                    <Button
                        onClick={() => setOptions(1)}
                        color="primary">Importar Asiento de Compras<i className='fas fa-download ml-2'></i></Button>
                </Col>
                <Col md="6" className="text-center">
                    <Button
                        onClick={() => setOptions(2)}
                        color="primary">Importar Asiento de Ventas<i className='fas fa-download ml-2'></i></Button>
                </Col>
            </Row>
        </Collapse>
        <Collapse isOpen={options === 1 ? true : false} >
            {purchaseImported ? <>
                <ChargeEntriesComp
                    accountsList={accountsList}
                    entryDetails={purchaseImported}
                    setEntryDetails={setPurchaseImported}
                    activeTab={activeTab}
                    importedToggle={() => setImportedFlag(!importedFlag)}
                    purchasePeriodId={JSON.parse(purchaseSelected).id}
                />
            </> :
                <>
                    <Row>
                        <Col md="12">
                            <h2 className='text-center'>Compras pendientes de asiento</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3"></Col>
                        <Col md="6">
                            <Input
                                type="select"
                                onChange={(e) => setPurchaseSelected(e.target.value)}
                                value={purchaseSelected}
                            >
                                <option key={0} value={false}>Seleccionar periodo</option>
                                {purchasesClosed.map((period, key) => (
                                    <option key={key + 1} value={JSON.stringify(period)}>{monthToStr(period.month)}/{period.year}</option>
                                ))}
                            </Input>
                        </Col>
                        <Col md="3"></Col>
                    </Row>
                    <Row>
                        <Col md="12" className="text-center mt-3">
                            <Button
                                color="primary"
                                onClick={purchasesImport}
                            >
                                Importar
                            </Button>
                            <Button
                                onClick={() => setOptions(0)}
                                color="info"
                            >
                                Volver
                            </Button>
                        </Col>
                    </Row>
                </>
            }
        </Collapse>
        <Collapse isOpen={options === 2 ? true : false} >
            <Row>
                <Col md="12">
                    <h2 className='text-center'>Ventas pendientes de asiento</h2>
                </Col>
            </Row>
            <Row>
                <Col md="12" className="text-center">
                    <Button
                        onClick={() => setOptions(0)}
                        color="info"
                    >
                        Volver
                    </Button>
                </Col>
            </Row>
        </Collapse>
    </>);
}

export default OperationsEntries;