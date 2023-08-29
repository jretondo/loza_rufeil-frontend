import React, { useContext, useEffect, useState } from "react";
import PurchasesLayout from "..";
import { Button, ButtonGroup, Card, CardBody, Col, Collapse, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row } from "reactstrap";
import ButtonOpenCollapse from "components/Buttons/buttonOpenCollapse";
import { useWindowSize } from "hooks/UseWindowSize";
import PurchasesEntriesCharge from "./charge";
import PurchasesEntriesList from "./list";
import LoadingContext from "context/loading";

const Index = () => {
    const [confirmedPeriod, setConfirmedPeriod] = useState(false)
    const [periodMonth, setPeriodMonth] = useState(new Date().getMonth())
    const [periodYear, setPeriodYear] = useState(new Date().getFullYear())
    const [activeTab, setActiveTab] = useState(0)
    const activeClient = localStorage.getItem("activeClient")
    const width = useWindowSize()

    const { setIsLoading } = useContext(LoadingContext)

    return (
        <PurchasesLayout  >
            <Card className="mt-2">
                <CardBody className="py-2">
                    {
                        activeClient ?
                            <Row>
                                <Col md="3"></Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label>Periodo</Label>
                                        <InputGroup>
                                            <Input type="select" onChange={e => setPeriodMonth(e.target.value)} value={periodMonth} disabled={confirmedPeriod}>
                                                <option value={1}>Enero</option>
                                                <option value={2}>Febrero</option>
                                                <option value={3}>Marzo</option>
                                                <option value={4}>Abril</option>
                                                <option value={5}>Mayo</option>
                                                <option value={6}>Junio</option>
                                                <option value={7}>Julio</option>
                                                <option value={8}>Agosto</option>
                                                <option value={9}>Septiembre</option>
                                                <option value={10}>Octubre</option>
                                                <option value={11}>Noviembre</option>
                                                <option value={12}>Diciembre</option>
                                            </Input>
                                            <InputGroupAddon addonType="append">
                                                <Input type="number" onChange={e => setPeriodYear(e.target.value)} value={periodYear} disabled={confirmedPeriod} />
                                            </InputGroupAddon>
                                            <InputGroupAddon addonType="append">
                                                <Button
                                                    color={confirmedPeriod ? "danger" : "primary"}
                                                    onClick={e => {
                                                        e.preventDefault()
                                                        setConfirmedPeriod(!confirmedPeriod)
                                                    }}
                                                >{confirmedPeriod ? "X" : "Cargar"}</Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md="3"></Col>
                            </Row> :
                            <Input disabled value="Seleccione una empresa" />
                    }
                </CardBody>
            </Card>
            <Card className="mt-2">
                <CardBody className="text-center">
                    {
                        confirmedPeriod ?
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
                            <Input value="Seleccione un periodo" disabled />
                    }
                </CardBody>
            </Card>
            {
                confirmedPeriod &&
                <Card className="mt-2">
                    <CardBody>
                        <Collapse isOpen={activeTab === 0 ? true : false} >
                            <PurchasesEntriesCharge />
                        </Collapse>
                        <Collapse isOpen={activeTab === 1 ? true : false} >
                            <PurchasesEntriesList />
                        </Collapse>
                    </CardBody>
                </Card>
            }
        </PurchasesLayout>
    )
}

export default Index;
