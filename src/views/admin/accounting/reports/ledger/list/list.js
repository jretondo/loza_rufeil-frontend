import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import EntryRow from './row';
import PaginationComp from '../../../../../../components/Pagination/Pages';
import { numberFormat } from '../../../../../../function/numberFormat';
import InputSearch2 from '../../../../../../components/Search/InputSearch2';
import moment from 'moment';
import AlertsContext from '../../../../../../context/alerts';

const LedgerListComponent = ({
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
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [balance, setBalance] = useState(0);
    const [data, setData] = useState({
        dateFrom: "",
        dateTo: "",
        account: false,
    });

    const { newAlert } = useContext(AlertsContext)

    const searchHandler = (e) => {
        e.preventDefault();
        if (filters.dateFrom === "" || filters.dateTo === "") {
            newAlert("danger", "Error en el filtro", "Debe seleccionar un rango de fechas")
            return;
        }
        if (filters.dateFrom > filters.dateTo) {
            newAlert("danger", "Error en el filtro", "La fecha de inicio no puede ser mayor a la fecha de fin")
            return;
        }
        if (filters.account === false) {
            newAlert("danger", "Error en el filtro", "Debe seleccionar una cuenta")
            return;
        }
        setRefreshList(!refreshList);
    }

    useEffect(() => {
        const handleScroll = () => {
            const tables = document.querySelectorAll('.filter-table-ledger');
            const referenceTable = document.querySelector('.header-table-ledger');
            const allRows = Array.from(tables).reduce((acc, table) => {
                const tableRows = Array.from(table.querySelectorAll('tr[data-row-id]'));
                return [...acc, ...tableRows];
            }, []);

            const rect = referenceTable.getBoundingClientRect();
            const tableBottom = rect.bottom;

            let debitSum = 0;
            let creditSum = 0;
            let balance = 0
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
                    balance = debitSum - creditSum
                }
            });
            setTotalDebit(debitSum);
            setTotalCredit(creditSum);
            setBalance(balance);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Se ejecuta solo una vez al cargar el componente

    useEffect(() => {
        setTotalCredit(0);
        setTotalDebit(0);
        setBalance(0);
    }, [page])

    useEffect(() => {
        setData({
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            account: filters.account ? filters.account : false,
        })
        // eslint-disable-next-line
    }, [dataPage])

    return (<>
        <Row className="mb-3 p-2" style={{ border: "3px solid black" }} >
            <Col md="10">
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
            </Col>
            <Col md="2">
                <Row style={{ marginTop: "31px" }}>
                    <Col md="12" style={{ textAlign: "left" }}>
                        <Button
                            color="primary"
                            onClick={searchHandler}
                        >
                            Buscar
                        </Button>
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
                    <Label>Cuenta:</Label>
                    <Input
                        disabled
                        type="text"
                        value={data.account ? `${data.account.name} (${data.account.code})` : " "}
                    />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md="12">
                <Table className="align-items-center table-flush table-hover header-table-ledger" style={{ minHeight: 0, position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white' }}>
                    <tbody  >
                        <tr style={{ border: "2px solid black" }}>
                            <td style={{ width: "12%", fontWeight: "bold" }}>
                                Fecha
                            </td>
                            <td style={{ width: "12%", textAlign: "center", fontWeight: "bold" }}>
                                Asiento
                            </td>
                            <td style={{ width: "31%", textAlign: "center", fontWeight: "bold" }}>
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
                        {
                            dataPage.length > 0 && <tr >
                                <td style={{ width: "12%" }}>
                                </td>
                                <td style={{ width: "12%" }}>
                                </td>
                                <td style={{ width: "31%", textAlign: "left" }}>
                                    <label style={{ fontWeight: "bold" }}>Transporte</label>
                                </td>
                                <td style={{ textAlign: "right", width: "15%" }}>
                                    <label style={{ fontWeight: "bold" }}>{numberFormat(dataPage[0].perviousDebit + totalDebit)}</label>
                                </td>
                                <td style={{ textAlign: "right", width: "15%" }}>
                                    <label style={{ fontWeight: "bold" }}>{numberFormat(dataPage[0].perviousCredit + totalCredit)}</label>
                                </td>
                                <td style={{ textAlign: "right", width: "15%" }}>
                                    <label style={{ fontWeight: "bold" }}>{numberFormat(
                                        (dataPage[0].perviousBalance + balance) < 0 ?
                                            -(dataPage[0].perviousBalance + balance) :
                                            (dataPage[0].perviousBalance + balance))}
                                        {dataPage[0].perviousBalance + balance < 0 ? " Ha." : " De."}
                                    </label>
                                </td>
                            </tr>
                        }
                    </tbody>
                </Table>
                <Table className="align-items-center table-flush table-hover filter-table-ledger" >
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

export default LedgerListComponent;