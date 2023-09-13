import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Card, CardBody, CardHeader, Collapse, Container, FormGroup, Input, Label } from "reactstrap";
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
    const [refreshList, setRefreshList] = useState(false)
    const { setUrlRoute } = useContext(secureContext)

    const { setIsLoading } = useContext(LoadingContext)

    const {
        dataPage,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.accountingDir.sub.accountingCharts,
        0, refreshList, [{ periodId: JSON.parse(localStorage.getItem("activePeriod")).id }]
    )

    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

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
        dataPage.length > 0 && setAccountsListHtml(modulesBuilder(dataPage, false, 0, true))
        // eslint-disable-next-line
    }, [dataPage, activeIds])

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
