import React, { useContext, useEffect, useState } from "react";
import PurchasesLayout from "..";
import { ButtonGroup, Card, CardBody, Collapse, Input } from "reactstrap";
import ButtonOpenCollapse from "components/Buttons/buttonOpenCollapse";
import { useWindowSize } from "hooks/UseWindowSize";
import PurchasesEntriesCharge from "./charge";
import PurchasesEntriesList from "./list";
import PurchasesEntriesChargeHeader from "./header";
import PurchasesEntriesOperations from "./operations";
import ActionsBackend from "context/actionsBackend";
import API_ROUTES from "api/routes";
import AlertsContext from "context/alerts";
import PurchasePeriodSummary from "./operations/summary";

const Index = () => {
    const modules = JSON.parse(localStorage.getItem("modules"))
    const activeClient = localStorage.getItem("activeClient")
    const activePeriod = JSON.parse(localStorage.getItem("activePeriod"))
    const [confirmedPeriod, setConfirmedPeriod] = useState(false)
    const [periodMonth, setPeriodMonth] = useState()
    const [periodYear, setPeriodYear] = useState()
    const [activeTab, setActiveTab] = useState(0)
    const [purchasePeriod, setPurchasePeriod] = useState()
    const [accountsList, setAccountsList] = useState([])
    const [refreshList, setRefreshList] = useState(false)
    const [totalInvoice, setTotalInvoice] = useState(0)

    const { axiosGetQuery } = useContext(ActionsBackend)
    const { newAlert } = useContext(AlertsContext)
    const width = useWindowSize()

    const getAttributableAccounts = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.attributableAccountingChart, [{ accountPeriodId: activePeriod.id }])
        if (!response.error) {
            setAccountsList(response.data)
        } else {
            newAlert("danger", "Error al cargar las cuentas atribuibles", response.errorMsg)
        }
    }

    const hasAccountingModule = () => {
        const find = modules.find((module) => module.module_id === 11)
        if (find) {
            return true
        } else {
            return false
        }
    }

    const accountSearchFn = (account, searchedText) => {
        if ((account.name).toLowerCase().includes(searchedText.toLowerCase()) || (account.code).toLowerCase().includes(searchedText.toLowerCase())) {
            return account
        }
    }

    useEffect(() => {
        setRefreshList(!refreshList)
        // eslint-disable-next-line
    }, [purchasePeriod])

    useEffect(() => {
        getAttributableAccounts()
        // eslint-disable-next-line
    }, [])

    return (
        <PurchasesLayout  >
            <PurchasesEntriesChargeHeader
                activeClient={activeClient}
                confirmedPeriod={confirmedPeriod}
                setPeriodMonth={setPeriodMonth}
                periodMonth={periodMonth}
                setPeriodYear={setPeriodYear}
                periodYear={periodYear}
                setConfirmedPeriod={setConfirmedPeriod}
                activePeriod={activePeriod}
                setPurchasePeriod={setPurchasePeriod}
            />
            <Card className="mt-2">
                <CardBody className="text-center">
                    {confirmedPeriod ?
                        <>
                            <ButtonGroup vertical={width > 1030 ? false : true}>
                                <ButtonOpenCollapse
                                    action={() => setActiveTab(0)}
                                    tittle={"Carga"}
                                    active={activeTab === 0 ? true : false}
                                />
                                <ButtonOpenCollapse
                                    action={() => setActiveTab(1)}
                                    tittle={"Listado"}
                                    active={activeTab === 1 ? true : false}
                                />
                                <ButtonOpenCollapse
                                    action={() => setActiveTab(2)}
                                    tittle={"Operaciones"}
                                    active={activeTab === 2 ? true : false}
                                />
                            </ButtonGroup>
                        </> :
                        <Input value="Seleccione un periodo" disabled />}
                </CardBody>
            </Card>
            {confirmedPeriod && purchasePeriod &&
                <>
                    <Card className="mt-2">
                        <CardBody>
                            <Collapse isOpen={activeTab === 0 ? true : false} >
                                {(activeTab === 0 || activeTab === 1) && <PurchasesEntriesCharge
                                    accountsList={accountsList}
                                    hasAccountingModule={hasAccountingModule()}
                                    accountSearchFn={accountSearchFn}
                                    purchasePeriodId={purchasePeriod.id}
                                    purchasePeriod={purchasePeriod}
                                    refreshListToggle={() => setRefreshList(!refreshList)}
                                    periodMonth={periodMonth}
                                    periodYear={periodYear}
                                />}
                            </Collapse>
                            <Collapse isOpen={activeTab === 1 ? true : false} >
                                <PurchasesEntriesList
                                    purchasePeriodId={purchasePeriod.id}
                                    purchasePeriod={purchasePeriod}
                                    refreshList={refreshList}
                                    setRefreshList={setRefreshList}
                                    hasAccountingModule={hasAccountingModule()}
                                    setTotalInvoice={setTotalInvoice}
                                />
                            </Collapse>
                            <Collapse isOpen={activeTab === 2 ? true : false} >
                                <PurchasesEntriesOperations
                                    purchasePeriod={purchasePeriod}
                                    accountsList={accountsList}
                                    hasAccountingModule={hasAccountingModule()}
                                    accountSearchFn={accountSearchFn}
                                    activePeriod={activePeriod}
                                    refreshList={() => setRefreshList(!refreshList)}
                                    periodMonth={periodMonth}
                                    periodYear={periodYear}
                                />
                            </Collapse>
                        </CardBody>
                    </Card>
                    <Collapse isOpen={activeTab === 2 ? true : false} >
                        <Card className="mt-2">
                            <CardBody>
                                <PurchasePeriodSummary
                                    purchasePeriod={purchasePeriod}
                                    refreshList={refreshList}
                                    totalInvoice={totalInvoice}
                                />
                            </CardBody>
                        </Card>
                    </Collapse>
                </>}
        </PurchasesLayout>
    )
}

export default Index;
