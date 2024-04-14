import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { ButtonGroup, Card, CardBody, Collapse, Container } from "reactstrap";
import ButtonOpenCollapse from "../../../../components/Buttons/buttonOpenCollapse";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import ChargeEntriesComp from "./charge";
import ActionsBackend from "../../../../context/actionsBackend";
import AlertsContext from "../../../../context/alerts";
import API_ROUTES from "../../../../api/routes";
import EntriesList from "./list";
import OperationsEntries from "./operations";

const Index = () => {
    const activePeriod = JSON.parse(localStorage.getItem("activePeriod"))
    const [activeTab, setActiveTab] = useState(0)
    const [accountsList, setAccountsList] = useState([])

    const { setUrlRoute } = useContext(secureContext)
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

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.accounting)
    }, [setUrlRoute])

    useEffect(() => {
        getAttributableAccounts()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Card className="mt-2">
                    <CardBody className="text-center">
                        <ButtonGroup vertical={width > 1030 ? false : true}>
                            <ButtonOpenCollapse
                                action={() => setActiveTab(0)}
                                tittle={"Carga"}
                                active={activeTab === 0 ? true : false}
                            />
                            <ButtonOpenCollapse
                                action={() => setActiveTab(1)}
                                tittle={"Consulta"}
                                active={activeTab === 1 ? true : false}
                            />
                            <ButtonOpenCollapse
                                action={() => setActiveTab(2)}
                                tittle={"Operaciones"}
                                active={activeTab === 2 ? true : false}
                            />
                        </ButtonGroup>
                    </CardBody>
                </Card>
                <Card className="mt-2">
                    <CardBody>
                        <Collapse isOpen={activeTab === 0 ? true : false} >
                            <ChargeEntriesComp
                                accountsList={accountsList}
                                activeTab={activeTab}
                            />
                        </Collapse>
                        <Collapse isOpen={activeTab === 1 ? true : false} >
                            <EntriesList
                                accountsList={accountsList}
                                activeTab={activeTab}
                            />
                        </Collapse>
                        <Collapse isOpen={activeTab === 2 ? true : false} >
                            <OperationsEntries
                                accountsList={accountsList}
                                activeTab={activeTab}
                            />
                        </Collapse>
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}

export default Index;
