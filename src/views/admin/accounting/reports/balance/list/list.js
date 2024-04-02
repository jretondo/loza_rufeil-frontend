import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import EntryRow from './row';
import PaginationComp from '../../../../../../components/Pagination/Pages';
import InputSearch2 from '../../../../../../components/Search/InputSearch2';
import moment from 'moment';

const BalanceListComponent = ({
    accountsList,
    page,
    setPage,
    refreshList,
    setRefreshList,
    filters,
    setFilters,
    dataPage,
    pagesQuantity,
    errorList
}) => {
    const [data, setData] = useState({
        dateFrom: "",
        dateTo: "",
        accountFrom: false,
        accountTo: false
    });

    useEffect(() => {
        setData({
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            accountFrom: filters.accountFrom ? filters.accountFrom : false,
            accountTo: filters.accountTo ? filters.accountTo : false
        })
        // eslint-disable-next-line
    }, [dataPage])

    return (<>
        <Row className="mb-3 p-2" style={{ border: "3px solid black" }} >
            <Col md="12">
                <Row>
                    <Col md="4">
                        <FormGroup>
                            <Label>Fecha Desde:</Label>
                            <Input
                                placeholder="Fecha Desde"
                                value={filters.dateFrom}
                                onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                                type="date" />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <Label>Fecha Hasta:</Label>
                            <Input
                                placeholder="Fecha Hasta"
                                value={filters.dateTo}
                                onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                                type="date" />
                        </FormGroup>
                    </Col>
                    <Col md="4" style={{ textAlign: "left" }}>
                        <Button
                            style={{ marginTop: "31px", width: "80%" }}
                            color="primary"
                            onClick={() => setRefreshList(!refreshList)}
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label>Cuenta desde:</Label>
                            <InputSearch2
                                itemsList={accountsList}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                id={`account-`}
                                itemSelected={filters.accountFrom}
                                setItemSelected={(accountItem) => setFilters({ ...filters, accountFrom: accountItem })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label>Cuenta Hasta:</Label>
                            <InputSearch2
                                itemsList={accountsList}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                id={`account-`}
                                itemSelected={filters.accountTo}
                                setItemSelected={(accountItem) => setFilters({ ...filters, accountTo: accountItem })}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col md="4">
                <FormGroup>
                    <Label>Periodo:</Label>
                    <Input
                        disabled
                        type="text"
                        value={data.dateFrom && data.dateTo ? `Del ${moment(data.dateFrom).format("DD/MM/YYYY")} al ${moment(data.dateTo).format("DD/MM/YYYY")}` : " "}
                    />
                </FormGroup>
            </Col>
            <Col md="4">
                <FormGroup>
                    <Label>Cuenta Desde:</Label>
                    <Input
                        disabled
                        type="text"
                        value={data.accountFrom ? `${data.accountFrom.name} (${data.accountFrom.code})` : " "}
                    />
                </FormGroup>
            </Col>
            <Col md="4">
                <FormGroup>
                    <Label>Cuenta Hasta:</Label>
                    <Input
                        disabled
                        type="text"
                        value={data.accountTo ? `${data.accountTo.name} (${data.accountTo.code})` : " "}
                    />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md="12">
                <Table className="align-items-center table-flush table-hover header-table-balance" style={{ minHeight: 0, position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white' }}>
                    <tbody  >
                        <tr style={{ border: "2px solid black" }}>
                            <td style={{ width: "24%", textAlign: "left", fontWeight: "bold" }}>
                                Cuenta
                            </td>
                            <td style={{ width: "31%", textAlign: "left", fontWeight: "bold" }}>
                                Descripción
                            </td>
                            <td style={{ textAlign: "right", width: "15%" }}>
                                <label style={{ fontWeight: "bold" }}>Debe</label>
                            </td>
                            <td style={{ textAlign: "right", width: "15%" }}>
                                <label style={{ fontWeight: "bold" }}>Haber</label>
                            </td>
                            <td style={{ textAlign: "right", width: "15%" }}>
                                <label style={{ fontWeight: "bold" }}>Saldo</label>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table className="align-items-center table-flush table-hover filter-table-balance" >
                    <tbody style={{ minHeight: "500px" }}  >
                        {!errorList && dataPage.length > 0 ? dataPage.map((entry, key) => {
                            return (
                                <EntryRow
                                    key={key}
                                    id={key}
                                    entry={entry}
                                />
                            )
                        }) : <tr><td></td><td></td><td className='text-center'>No hay movimientos para mostrar</td></tr>}
                    </tbody>
                </Table>
            </Col>
        </Row>
        <Row style={{ marginBottom: "500px" }}>
            <Col md="12" className="text-center end-page">
                {!dataPage ? null : <PaginationComp
                    page={page}
                    setPage={setPage}
                    pagesQuantity={pagesQuantity}
                />}
            </Col>
        </Row>
    </>)
}

export default BalanceListComponent;