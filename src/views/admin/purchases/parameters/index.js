import React, { useContext, useEffect, useState } from "react";
import PurchasesLayout from "..";
import { ButtonGroup, Card, CardBody, CardHeader, Collapse } from "reactstrap";
import { useWindowSize } from "hooks/UseWindowSize";
import ButtonOpenCollapse from "components/Buttons/buttonOpenCollapse";
import PaymentMethods from "./payments";
import VatTaxesOthers from "./vatTaxesOthers";
import ActionsBackend from "context/actionsBackend";
import LoadingContext from "context/loading";
import AlertsContext from "context/alerts";
import API_ROUTES from "api/routes";

const ParametersComp = () => {
    const accountPeriod = JSON.parse(localStorage.getItem("activePeriod"))
    const activeClient = JSON.parse(localStorage.getItem("activeClient"))
    const modules = JSON.parse(localStorage.getItem("modules"))
    const [activeTab, setActiveTab] = useState(0)
    const [accountsList, setAccountsList] = useState([])
    const { axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)
    const { newAlert } = useContext(AlertsContext)
    const width = useWindowSize()

    const getAttributableAccounts = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.attributableAccountingChart, [{ accountPeriodId: accountPeriod.id }])
        if (!response.error) {
            setAccountsList(response.data)
        } else {
            newAlert("danger", "Error al cargar las cuentas atribuibles")
        }
    }

    const accountSearchFn = (account, searchedText) => {
        if ((account.name).toLowerCase().includes(searchedText.toLowerCase()) || (account.code).toLowerCase().includes(searchedText.toLowerCase())) {
            return account
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

    useEffect(() => {
        getAttributableAccounts()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])


    return (
        <PurchasesLayout  >
            <Card>
                <CardHeader className="text-center">Parametros de Compras - Elija las opciones más habituales para el cliente</CardHeader>
                <CardBody className="text-center">
                    <ButtonGroup vertical={width > 1030 ? false : true}>
                        <ButtonOpenCollapse
                            action={() => setActiveTab(0)}
                            tittle={"Métodos de Pago"}
                            active={activeTab === 0 ? true : false}
                        />
                        <ButtonOpenCollapse
                            action={() => setActiveTab(1)}
                            tittle={"Imp. y Otros"}
                            active={activeTab === 1 ? true : false}
                        />
                    </ButtonGroup>
                </CardBody>
            </Card>
            <Card className="mt-2">
                <CardBody>
                    <Collapse isOpen={activeTab === 0 ? true : false} >
                        <PaymentMethods
                            hasAccountingModule={hasAccountingModule}
                            accountsList={accountsList}
                            accountSearchFn={accountSearchFn}
                            activeClient={activeClient}
                        />
                    </Collapse>
                    <Collapse isOpen={activeTab === 1 ? true : false} >
                        <VatTaxesOthers
                            hasAccountingModule={hasAccountingModule}
                            accountsList={accountsList}
                            accountSearchFn={accountSearchFn}
                            activeClient={activeClient}
                        />
                    </Collapse>
                </CardBody>
            </Card>
        </PurchasesLayout>
    )
}

export default ParametersComp;
