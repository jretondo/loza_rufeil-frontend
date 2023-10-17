import API_ROUTES from '../../../../../api/routes';
import { useAxiosGetList } from 'hooks/useAxiosGetList';
import React, { useEffect, useState } from 'react';
import ProviderRow from './row';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Pagination, Row } from 'reactstrap';
import { SearchFormComponent } from 'components/Search/Search1';
import { TableList } from 'components/Lists/TableList';
import ProvidersListAccounts from './accounts';

const ProvidersList = ({
    setProviderInfo,
    setIsOpenProviderForm,
    setIsLoading,
    providerInfo,
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
        API_ROUTES.providersDir.providers,
        page, refreshList, [{ query: stringSearched }]
    )

    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

    useEffect(() => {
        if (errorList) {
            setList(
                <tr style={{ textAlign: "center", width: "100%" }}>
                    <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay proveedores cargados</span></td>
                </tr>
            )
        } else {
            setList(
                dataPage.map((provider, key) => {
                    let first
                    if (key === 0) {
                        first = true
                    } else {
                        first = false
                    }
                    return (
                        <ProviderRow
                            key={key}
                            id={key}
                            provider={provider}
                            first={first}
                            page={page}
                            setProviderInfo={setProviderInfo}
                            setIsOpenProviderForm={setIsOpenProviderForm}
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

    return (
        <>
            <Card>
                <CardHeader className="border-0">
                    <Row>
                        <Col md="4" >
                            <h2 className="mb-0">Lista de Proveedores</h2>
                        </Col>
                        <Col md="8" style={{ textAlign: "right" }}>
                            <SearchFormComponent
                                setStringSearched={setStringSearched}
                                stringSearched={stringSearched}
                                setRefreshList={setRefreshList}
                                refreshList={refreshList}
                                title="Buscar un proveedor"
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
                                    setProviderInfo(false)
                                    setIsOpenProviderForm(true);
                                }}
                            >
                                Nuevo Proveedor
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
                providerData={providerInfo}
                accountsList={accountsList}
                accountSearchFn={accountSearchFn}
                hasAccountingModule={hasAccountingModule}
                refreshList={() => setRefreshList(!refreshList)}
            />
        </>
    )
}

export default ProvidersList