import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Button, Card, CardBody, CardHeader, Col, Collapse, FormGroup, Input, Label, Row } from "reactstrap";
import PrincipalButtonAccordion from "components/Accordion/ListAccordion/principalButton";
import SubButtonAccordion from "components/Accordion/ListAccordion/subButton";

const Index = () => {
    const [isOpenedActive, setIsOpenedActive] = useState(false)

    const { setUrlRoute } = useContext(secureContext)

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.accounting)
    }, [setUrlRoute])

    return (
        <>
            <Header />
            <Card>
                <CardHeader>
                    <FormGroup>
                        <Label>Buscador:</Label>
                        <Input />
                    </FormGroup>
                </CardHeader>
                <CardBody>
                    <PrincipalButtonAccordion
                        name={"ACTIVO"}
                        setIsOpen={setIsOpenedActive}
                    />
                    <Collapse isOpen={isOpenedActive}>
                        <SubButtonAccordion
                            name={"CTA CTE (1001010)"}
                        />
                    </Collapse>
                </CardBody>
            </Card>
        </>
    )
}

export default Index;
