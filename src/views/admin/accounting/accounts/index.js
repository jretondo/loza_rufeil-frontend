import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Card, CardBody, CardHeader, Collapse, Container, FormGroup, Input, Label } from "reactstrap";
import PrincipalButtonAccordion from "components/Accordion/ListAccordion/principalButton";
import SubButtonAccordion from "components/Accordion/ListAccordion/subButton";
import egList from './example.json';
import NewAccountForm from "./newAccountForm";
import ActionsBackend from "context/actionsBackend";
import LoadingContext from "context/loading";
import API_ROUTES from "../../../../api/routes";
const Index = () => {

    const [accountsList, setAccountsList] = useState(egList)
    const [accountsListHtml, setAccountsListHtml] = useState(<></>)
    const [activeIds, setActiveIds] = useState([])
    const [isOpenNewForm, setIsOpenNewForm] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(false)
    const { setUrlRoute } = useContext(secureContext)

    const { axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)

    const getAccountingList = async () => {
        const selectedPeriod = JSON.parse(localStorage.getItem("activePeriod"))
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.accountingCharts, [{ periodId: selectedPeriod.id }])
        if (!response.error) {
            setAccountsList(response.data)
        } else {

        }
    }

    useEffect(() => {
        getAccountingList()
    }, [])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    const modulesBuilder = (accountList, parentId, level) => {
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
                bgColor = "#AD9CFF"
                break;
        }
        return accountList.map((account, key) => {
            return <div key={key}>
                {account.principal ?
                    <div key={key}>
                        <PrincipalButtonAccordion
                            name={account.name}
                            key={account.id}
                            id={account.id}
                            open={(activeIds.includes(account.id))}
                            setActiveId={setActiveIds}
                            hasSub={account.subAccounts.length > 0}
                            openNewForm={() => openNewForm(account)}
                        />
                        {account.subAccounts.length > 0 && modulesBuilder(account.subAccounts, account.id, (level + 1))}
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
                        {account.subAccounts.length > 0 && modulesBuilder(account.subAccounts, account.id, (level + 1))}
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
        setAccountsListHtml(modulesBuilder(accountsList, false, 0))
        // eslint-disable-next-line
    }, [accountsList, activeIds])

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.accounting)
    }, [setUrlRoute])

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Card>
                    <CardHeader>
                        <FormGroup>
                            <Label>Buscador:</Label>
                            <Input />
                        </FormGroup>
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
            />
        </>
    )
}

export default Index;
