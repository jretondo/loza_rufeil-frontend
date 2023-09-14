import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Button, Card, CardBody, CardHeader, Collapse, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label } from "reactstrap";
import PrincipalButtonAccordion from "components/Accordion/ListAccordion/principalButton";
import SubButtonAccordion from "components/Accordion/ListAccordion/subButton";
import NewAccountForm from "./newAccountForm";
import LoadingContext from "context/loading";
import API_ROUTES from "../../../../api/routes";
import { useAxiosGetList } from 'hooks/useAxiosGetList';

const Index = () => {
    const [accountsListHtml, setAccountsListHtml] = useState(<></>)
    const [activeIds, setActiveIds] = useState([])
    const [isOpenNewForm, setIsOpenNewForm] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(false)
    const [nameContain, setNameContain] = useState("")
    const [refreshList, setRefreshList] = useState(false)

    const { setUrlRoute } = useContext(secureContext)
    const { setIsLoading } = useContext(LoadingContext)

    const {
        dataPage,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.accountingDir.sub.accountingCharts,
        0, refreshList, [
        { periodId: JSON.parse(localStorage.getItem("activePeriod")).id },
        { contain: nameContain ? nameContain : "" }
    ])

    const modulesBuilder = (accountList, parentId, level, isParentOpen) => {
        let bgColor = "#AD9CFF"
        switch (level) {
            case 1:
                bgColor = "#AD9CFF"
                break;
            case 2:
                bgColor = "#7E88E0"
                break;
            case 3:
                bgColor = "#97BAF7"
                break;
            case 4:
                bgColor = "#7EBCE0"
                break;
            case 5:
                bgColor = "#8BEDF8"
                break;
            default:
                bgColor = "#e6e6e6"
                break;
        }
        return accountList.map((account, key) => {
            return <div key={key}>
                {account.principal ?
                    <div key={key}>
                        {
                            (account.genre > 0 && account.group === 0 && account.caption === 0 && account.account === 0 && account.sub_account === 0) ?
                                <PrincipalButtonAccordion
                                    name={account.name}
                                    key={account.id}
                                    id={account.id}
                                    open={(activeIds.includes(account.id))}
                                    setActiveId={setActiveIds}
                                    hasSub={account.subAccounts.length > 0}
                                    openNewForm={() => openNewForm(account)}
                                /> :
                                <SubButtonAccordion
                                    level={level}
                                    name={`${account.name} (${account.code})`}
                                    key={account.id}
                                    id={account.id}
                                    open={activeIds.includes(account.id)}
                                    setActiveId={setActiveIds}
                                    hasSub={account.subAccounts.length > 0}
                                    bgColor={bgColor}
                                    openNewForm={() => openNewForm(account)}
                                />
                        }
                        {(account.subAccounts.length > 0 && isParentOpen) && modulesBuilder(account.subAccounts, account.id, (level + 1), activeIds.includes(account.id))}
                    </div> :
                    <Collapse isOpen={activeIds.includes(parentId)} key={key}>
                        <SubButtonAccordion
                            level={level}
                            name={`${account.name} (${account.code})`}
                            key={account.id}
                            id={account.id}
                            open={activeIds.includes(account.id)}
                            setActiveId={setActiveIds}
                            hasSub={account.subAccounts.length > 0}
                            bgColor={bgColor}
                            openNewForm={() => openNewForm(account)}
                        />
                        {(account.subAccounts.length > 0 && isParentOpen) && modulesBuilder(account.subAccounts, account.id, (level + 1), activeIds.includes(account.id))}
                    </Collapse>
                }
            </div>
        })
    }

    const openNewForm = (parentAccount) => {
        setSelectedAccount(parentAccount)
        setIsOpenNewForm(true)
    }

    useEffect(() => {
        setRefreshList(!refreshList)
        // eslint-disable-next-line
    }, [isOpenNewForm])

    useEffect(() => {
        dataPage.length > 0 && setAccountsListHtml(modulesBuilder(dataPage, false, 0, true))
        // eslint-disable-next-line
    }, [dataPage, activeIds])

    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.accounting)
    }, [setUrlRoute])

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Card>
                    <CardHeader>
                        <Form onSubmit={e => {
                            e.preventDefault()
                            setRefreshList(!refreshList)
                        }}>
                            <FormGroup>
                                <Label>Buscador:</Label>
                                <InputGroup>
                                    <Input value={nameContain} onChange={(e) => {
                                        setNameContain(e.target.value)
                                        e.target.value === "" && setRefreshList(!refreshList)
                                    }} />
                                    <InputGroupAddon addonType="append">
                                        <Button color="primary" type="submit">Buscar</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </CardHeader>
                    <CardBody>
                        {accountsListHtml}
                    </CardBody>
                </Card>
            </Container>
            <NewAccountForm
                parentAccount={selectedAccount}
                isOpen={isOpenNewForm}
                toggle={() => setIsOpenNewForm(!isOpenNewForm)}
                setIsLoading={setIsLoading}
            />
        </>
    )
}

export default Index;
