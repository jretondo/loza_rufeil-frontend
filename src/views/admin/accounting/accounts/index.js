import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Card, CardBody, CardHeader, Col, Collapse, FormGroup, Input, Label, Row } from "reactstrap";
import PrincipalButtonAccordion from "components/Accordion/ListAccordion/principalButton";
import SubButtonAccordion from "components/Accordion/ListAccordion/subButton";
import egList from './example.json';
const Index = () => {
    const [isOpenedActive, setIsOpenedActive] = useState(false)
    const [accountsList, setAccountsList] = useState(egList)
    const [accountsListHtml, setAccountsListHtml] = useState(<></>)
    const { setUrlRoute } = useContext(secureContext)

    const modulesBuilder = (accountList) => {
        return accountList.map((account, key) => {
            return <>
                {account.principal ?
                    <PrincipalButtonAccordion
                        name={account.name}
                        key={key}
                        id={account.id}
                        toggle={() => collapseToggle(account.id, account.level, key)}
                    /> :
                    <>
                        <Collapse isOpen={account.open}>
                            <SubButtonAccordion
                                level={account.level}
                                name={account.name}
                                key={key}
                                id={account.id}
                                toggle={() => collapseToggle(account.id, account.level, key)}
                            />
                        </Collapse>
                    </>
                }
                {account.subAccounts.length > 0 && modulesBuilder(account.subAccounts)}
            </>
        })
    }

    const collapseToggle = (level, key) => {

        console.log('level :>> ', level);
        console.log('key :>> ', key);
    }

    useEffect(() => {
        setAccountsListHtml(modulesBuilder(accountsList))
        // eslint-disable-next-line
    }, [accountsList])

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
                    {accountsListHtml}
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
