import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Pagination, Row } from 'reactstrap';
import { SearchFormComponent } from '../../../../../components/Search/Search1';
import { TableList } from '../../../../../components/Lists/TableList';
import ProvidersListAccounts from '../../../purchases/providers/list/accounts';
import { useAxiosGetList } from '../../../../../hooks/useAxiosGetList';
import API_ROUTES from '../../../../../api/routes';
import ClientRow from './row';


const CustomersListComponent = ({
    setClientInfo,
    setIsOpenClientForm,
    setIsLoading,
    clientInfo,
    accountsList,
    accountSearchFn,
    hasAccountingModule
}) => {
    const titlesArray = ["Razón Social", "CUIT", "Cond. IVA", ""]
    const [list, setList] = useState(<></>)
    const [page, setPage] = useState(1)
    const [refreshList, setRefreshList] = useState(false)
    const [stringSearched, setStringSearched] = useState("")
    const [modalAccountsIsOpen, setModalAccountsIsOpen] = useState(false)


    const {
        dataPage,
        pageObj,
        errorList,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.customersDir.customers,
        page, refreshList, [{ query: stringSearched }]
    )

    useEffect(() => {
        if (errorList) {
            setList(
                <tr style={{ textAlign: "center", width: "100%" }}>
                    <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay proveedores cargados</span></td>
                </tr>
            )
        } else {
            setList(
                dataPage.map((client, key) => {
                    let first
                    if (key === 0) {
                        first = true
                    } else {
                        first = false
                    }
                    return (
                        <ClientRow
                            key={key}
                            id={key}
                            client={client}
                            first={first}
                            page={page}
                            setClientInfo={setClientInfo}
                            setIsOpenClientForm={setIsOpenClientForm}
                            setPage={setPage}
                            refreshToggle={() => setRefreshList(!refreshList)}
                            setModalAccountsIsOpen={setModalAccountsIsOpen}
                            hasAccountingModule={hasAccountingModule}
                        />
                    )
                })
            )
        }
        return () => {
            setList(<></>)
        }
        // eslint-disable-next-line
    }, [dataPage, errorList, loadingList])


    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

    return (
        <>
            <Card>
                <CardHeader className="border-0">
                    <Row>
                        <Col md="4" >
                            <h2 className="mb-0">Lista de Clientes</h2>
                        </Col>
                        <Col md="8" style={{ textAlign: "right" }}>
                            <SearchFormComponent
                                setStringSearched={setStringSearched}
                                stringSearched={stringSearched}
                                setRefreshList={setRefreshList}
                                refreshList={refreshList}
                                title="Buscar un cliente"
                            />
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <TableList
                                titlesArray={titlesArray}
                            >
                                {list}
                            </TableList>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    <Row>
                        <Col md="6">
                            <Button
                                color="primary"
                                onClick={e => {
                                    e.preventDefault();
                                    setClientInfo(false)
                                    setIsOpenClientForm(true);
                                }}
                            >
                                Nuevo Cliente
                            </Button>
                        </Col>
                        <Col>
                            {!pageObj ? null : <Pagination
                                page={page}
                                setPage={setPage}
                                dataPages={pageObj}
                            />}
                        </Col>
                    </Row>
                </CardFooter>
            </Card>
            <ProvidersListAccounts
                isOpen={modalAccountsIsOpen}
                toggle={() => setModalAccountsIsOpen(!modalAccountsIsOpen)}
                providerData={clientInfo}
                accountsList={accountsList}
                accountSearchFn={accountSearchFn}
                hasAccountingModule={hasAccountingModule}
                refreshList={() => setRefreshList(!refreshList)}
            />
        </>
    )

}

export default CustomersListComponent