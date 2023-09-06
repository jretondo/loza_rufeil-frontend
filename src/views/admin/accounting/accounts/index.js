import React, { useContext, useEffect } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from "reactstrap";
import PrincipalButtonAccordion from "components/Accordion/ListAccordion/principalButton";

const Index = () => {
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
                    />
                </CardBody>
            </Card>
        </>
    )
}

export default Index;
