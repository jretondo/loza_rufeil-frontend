import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import EntryRow from './row';
import PaginationComp from '../../../../../../components/Pagination/Pages';
import { numberFormat } from '../../../../../../function/numberFormat';
import moment from 'moment';
import InputSearch2 from '../../../../../../components/Search/InputSearch2';

const JournalListComponent = ({
    accountsList,
    page,
    setPage,
    filtersActive,
    setFiltersActive,
    refreshList,
    setRefreshList,
    filters,
    setFilters,
    dataPage,
    pagesQuantity,
    errorList,
    accountSearchFn,
}) => {
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const tables = document.querySelectorAll('.filter-table');
            const referenceTable = document.querySelector('.header-table');
            const allRows = Array.from(tables).reduce((acc, table) => {
                const tableRows = Array.from(table.querySelectorAll('tr[data-row-id]'));
                return [...acc, ...tableRows];
            }, []);

            const rect = referenceTable.getBoundingClientRect();
            const tableBottom = rect.bottom;

            let debitSum = 0;
            let creditSum = 0;

            allRows.forEach((row) => {
                const rect = row.getBoundingClientRect();
                const rowBottom = rect.bottom;

                if (rowBottom <= tableBottom) {
                    const credit = parseFloat(row.getAttribute('data-credit'));
                    const debit = parseFloat(row.getAttribute('data-debit'));
                    if (!isNaN(debit)) {
                        debitSum += debit;
                    }
                    if (!isNaN(credit)) {
                        creditSum += credit;
                    }
                }
            });
            setTotalDebit(debitSum);
            setTotalCredit(creditSum);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Se ejecuta solo una vez al cargar el componente

    useEffect(() => {
        setTotalCredit(0);
        setTotalDebit(0);
    }, [page])

    return (<>
        <Row className="mb-3" >
            <Col md="2">
                <Row>
                    <Col md="12" style={{ textAlign: "left" }}>
                        <Button
                            color={filtersActive ? "danger" : "primary"}
                            onClick={() => setFiltersActive(!filtersActive)}
                        >
                            {filtersActive ? "X" : "Filtros"}
                        </Button>
                    </Col>
                </Row>
                {
                    filtersActive && <Row className="mt-4">
                        <Col md="12" style={{ textAlign: "right" }}>
                            <Button
                                color="primary"
                                onClick={() => setRefreshList(!refreshList)}
                            >
                                Buscar
                            </Button>
                        </Col>
                    </Row>
                }
            </Col>

            <Col md="10">
                {filtersActive && <>
                    <Row>
                        <Col md="3">
                            <FormGroup>
                                <Label>Fecha Desde:</Label>
                                <Input
                                    placeholder="Fecha Desde"
                                    value={filters.dateFrom}
                                    onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                                    type="date" />
                            </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup>
                                <Label>Fecha Hasta:</Label>
                                <Input
                                    placeholder="Fecha Hasta"
                                    value={filters.dateTo}
                                    onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                                    type="date" />
                            </FormGroup>
                        </Col>
                        <Col md="2">
                            <FormGroup>
                                <Label>Nº Asiento:</Label>
                                <Input
                                    placeholder="Nº Asiento"
                                    value={filters.number}
                                    onChange={e => setFilters({ ...filters, number: e.target.value })}
                                    type="number" />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label>Texto:</Label>
                                <Input
                                    placeholder="Texto"
                                    value={filters.text}
                                    onChange={e => setFilters({ ...filters, text: e.target.value })}
                                    type="number" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3">
                            <FormGroup>
                                <Label>Importe Desde:</Label>
                                <Input
                                    placeholder="Importe Desde"
                                    value={filters.amountFrom}
                                    onChange={e => setFilters({ ...filters, amountFrom: e.target.value })}
                                    type="number" />
                            </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup>
                                <Label>Importe Hasta:</Label>
                                <Input
                                    placeholder="Importe Hasta"
                                    value={filters.amountTo}
                                    onChange={e => setFilters({ ...filters, amountTo: e.target.value })}
                                    type="number" />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Label>Cuenta:</Label>
                                <InputSearch2
                                    itemsList={accountsList}
                                    placeholderInput={"Busque una cuenta..."}
                                    getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                    id={`account-`}
                                    itemSelected={filters.account}
                                    setItemSelected={(accountItem) => setFilters({ ...filters, account: accountItem })}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </>}
            </Col>
        </Row>
        <Row>
            <Col md="12">
                {!errorList && dataPage.length > 0 ? dataPage.map((entry, key) => {
                    let prevDate = key > 0 ? dataPage[key - 1].date : null

                    return (
                        <>
                            {key === 0 ?
                                <>
                                    <Table className="align-items-center table-flush table-hover header-table" style={{ minHeight: 0, position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white' }}>
                                        <tbody >
                                            <tr>
                                                <td style={{ width: "25%" }}>
                                                </td>
                                                <td style={{ width: "40%", textAlign: "right" }}>
                                                </td>
                                                <td style={{ textAlign: "right", width: "13%" }}>
                                                    <label style={{ fontWeight: "bold" }}>Debe</label>
                                                </td>
                                                <td md="2" style={{ textAlign: "right", width: "13%" }}>
                                                    <label style={{ fontWeight: "bold" }}>Haber</label>
                                                </td>
                                            </tr>

                                            <tr >
                                                <td style={{ width: "25%" }}>
                                                </td>
                                                <td style={{ width: "40%", textAlign: "right" }}>
                                                    <label style={{ fontWeight: "bold" }}>Transporte</label>
                                                </td>
                                                <td style={{ textAlign: "right", width: "13%" }}>
                                                    <label style={{ fontWeight: "bold" }}>{numberFormat(entry.perviousDebit + totalDebit)}</label>
                                                </td>
                                                <td md="2" style={{ textAlign: "right", width: "13%" }}>
                                                    <label style={{ fontWeight: "bold" }}>{numberFormat(entry.perviousCredit + totalCredit)}</label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                                : null}
                            {prevDate !== entry.date ?
                                <Row>
                                    <Col md="12" style={{ border: "2px solid black" }}>
                                        <Label style={{ fontWeight: "bold" }}>Fecha: {moment(entry.date).format("DD/MM/YYYY")}</Label>
                                    </Col>
                                </Row>
                                : null}
                            <EntryRow
                                key={key}
                                id={key}
                                entry={entry}
                            />
                        </>
                    )
                }) : <tr><td></td><td></td><td className='text-center'>No hay asientos para mostrar</td></tr>}
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

export default JournalListComponent;