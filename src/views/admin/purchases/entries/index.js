import React, { useState } from "react";
import PurchasesLayout from "..";
import { ButtonGroup, Card, CardBody, Collapse, Input } from "reactstrap";
import ButtonOpenCollapse from "components/Buttons/buttonOpenCollapse";
import { useWindowSize } from "hooks/UseWindowSize";
import PurchasesEntriesCharge from "./charge";
import PurchasesEntriesList from "./list";
import PurchasesEntriesChargeHeader from "./header";

const Index = () => {
    const activeClient = localStorage.getItem("activeClient")
    const activePeriod = JSON.parse(localStorage.getItem("activePeriod"))
    const [confirmedPeriod, setConfirmedPeriod] = useState(false)
    const [periodMonth, setPeriodMonth] = useState(new Date().getMonth())
    const [periodYear, setPeriodYear] = useState(new Date().getFullYear())
    const [activeTab, setActiveTab] = useState(0)

    const width = useWindowSize()

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
                            </ButtonGroup>
                        </> :
                        <Input value="Seleccione un periodo" disabled />}
                </CardBody>
            </Card>
            {confirmedPeriod &&
                <Card className="mt-2">
                    <CardBody>
                        <Collapse isOpen={activeTab === 0 ? true : false} >
                            <PurchasesEntriesCharge />
                        </Collapse>
                        <Collapse isOpen={activeTab === 1 ? true : false} >
                            <PurchasesEntriesList />
                        </Collapse>
                    </CardBody>
                </Card>}
        </PurchasesLayout>
    )
}

export default Index;
