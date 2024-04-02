import React from 'react';
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import InputSearch from '../../../../../components/Search/InputSearch';
import { TableList } from '../../../../../components/Lists/TableList';
import EntryRow from './row';
import PaginationComp from '../../../../../components/Pagination/Pages';

const EntriesListComponent = ({
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
    setEntryDetails
}) => {
    return (<>
        <Row className="mb-3">
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
                            <InputSearch
                                title={"Cuenta"}
                                itemsList={accountsList}
                                setItemsList={() => { }}
                                itemSelected={filters.account}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                setItemSelected={(accountItem) => setFilters({ ...filters, account: accountItem })}
                                searchFn={accountSearchFn}
                            />
                        </Col>
                    </Row>
                </>}
            </Col>
        </Row>
        <Row>
            <Col md="12">
                <TableList titlesArray={["Fecha", "Nº", "Detalle", "Importe", ""]}>
                    {!errorList && dataPage.length > 0 ? dataPage.map((entry, key) => {
                        let first
                        if (key === 0) {
                            first = true
                        } else {
                            first = false
                        }

                        return (
                            <EntryRow
                                key={key}
                                id={key}
                                entry={entry}
                                first={first}
                                page={page}
                                setPage={setPage}
                                refreshToggle={() => setRefreshList(!refreshList)}
                                setEntryDetails={setEntryDetails}
                            />
                        )
                    }) : <tr><td></td><td></td><td className='text-center'>No hay asientos para mostrar</td></tr>}
                </TableList>
            </Col>
        </Row>
        <Row>
            <Col md="12" className="text-center">
                {!dataPage ? null : <PaginationComp
                    page={page}
                    setPage={setPage}
                    pagesQuantity={pagesQuantity}
                />}
            </Col>
        </Row>
    </>)
}

export default EntriesListComponent;