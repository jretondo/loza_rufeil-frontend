import React, { useContext, useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row } from "reactstrap";
import PrincipalButtonAccordion from "components/Accordion/ListAccordion/principalButton";
import SubButtonAccordion from "components/Accordion/ListAccordion/subButton";
import AccountForm from "./accountForm";
import LoadingContext from "context/loading";
import API_ROUTES from "../../../../api/routes";
import { useAxiosGetList } from 'hooks/useAxiosGetList';
import ImportAccounts from "./importAccount";
import ActionsBackend from "../../../../context/actionsBackend";
import AlertsContext from "../../../../context/alerts";

const Index = () => {
    const accountingId = JSON.parse(localStorage.getItem("activePeriod")).id

    const [accountsListHtml, setAccountsListHtml] = useState(<></>)
    const [activeIds, setActiveIds] = useState([])
    const [isOpenNewForm, setIsOpenNewForm] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(false)
    const [nameContain, setNameContain] = useState("")
    const [refreshList, setRefreshList] = useState(false)
    const [toUpdate, setToUpdate] = useState(false)
    const [isOpenImportAccounts, setIsOpenImportAccounts] = useState(false)
    const [allowImport, setAllowImport] = useState(false)

    const { loadingActions, axiosGetQuery, axiosGetFile } = useContext(ActionsBackend)
    const { setUrlRoute } = useContext(secureContext)
    const { setIsLoading } = useContext(LoadingContext)
    const { newAlert } = useContext(AlertsContext)

    const {
        dataPage,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.accountingDir.sub.accountingCharts,
        0, refreshList, [
        { periodId: accountingId },
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
                                    openUpdate={() => {
                                        setToUpdate(true)
                                        openNewForm(account)
                                    }}
                                    refresh={() => setRefreshList(!refreshList)}
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
                            openUpdate={() => {
                                setToUpdate(true)
                                openNewForm(account)
                            }}
                            refresh={() => setRefreshList(!refreshList)}
                        />
                        {(account.subAccounts.length > 0 && isParentOpen) && modulesBuilder(account.subAccounts, account.id, (level + 1), activeIds.includes(account.id))}
                    </Collapse>
                }
            </div>
        })
    }

    const getAllowImport = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.allowImport, [{ accountingId }])
        if (!response.error) {
            if (response.data) {
                setAllowImport(true)
            } else {
                setAllowImport(false)
            }
        } else {
            setAllowImport(false)
        }
    }

    const downloadAccountsExcel = async (e) => {
        e.preventDefault()
        const response = await axiosGetFile(API_ROUTES.accountingDir.sub.accountingChartsExcel, accountingId, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        if (!response.error) {
            newAlert("success", "Archivo generado con éxito!", "Revise su carpeta de descargas")
        } else {
            console.log(response.error)
            newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
        }
    }


    const downloadAccountsPDF = async (e) => {
        e.preventDefault()
        const response = await axiosGetFile(API_ROUTES.accountingDir.sub.accountingChartsPDF, accountingId, 'application/pdf')
        if (!response.error) {
            newAlert("success", "Reporte generado con éxito!", "Revise su carpeta de descargas")
        } else {
            console.log(response.error)
            newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
        }
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
        !isOpenNewForm && setToUpdate(false)
    }, [isOpenNewForm])

    useEffect(() => {
        dataPage.length > 0 && setAccountsListHtml(modulesBuilder(dataPage, false, 0, true))
        // eslint-disable-next-line
    }, [dataPage, activeIds])

    useEffect(() => {
        setIsLoading((loadingList || loadingActions))
    }, [loadingList, setIsLoading, loadingActions])

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.accounting)
    }, [setUrlRoute])

    useEffect(() => {
        getAllowImport()
        // eslint-disable-next-line 
    }, [])

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
                                        <Button style={{ zIndex: 0 }} color="primary" type="submit">Buscar</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </CardHeader>
                    <CardBody>
                        {accountsListHtml}
                    </CardBody>
                    <CardFooter>
                        <Row>
                            <Col md="12" style={{ textAlign: "center" }} >
                                <Button
                                    onClick={() => allowImport && setIsOpenImportAccounts(true)}
                                    disabled={!allowImport}
                                    color="primary">
                                    Importar Cuenta <i className="fa fa-download"></i>
                                </Button>
                                <Button
                                    onClick={downloadAccountsExcel}
                                    color="success">
                                    Descargar en Excel <i className="fa fa-download"></i>
                                </Button>
                                <Button
                                    onClick={downloadAccountsPDF}
                                    color="danger">
                                    Descargar en PDF <i className="fa fa-download"></i>
                                </Button>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Container>
            <AccountForm
                parentAccount={selectedAccount}
                isOpen={isOpenNewForm}
                toggle={() => setIsOpenNewForm(!isOpenNewForm)}
                toUpdate={toUpdate}
            />
            <ImportAccounts
                isOpen={isOpenImportAccounts}
                toggle={() => setIsOpenImportAccounts(!isOpenImportAccounts)}
                refresh={() => setRefreshList(!refreshList)}
            />
        </>
    )
}

export default Index;
