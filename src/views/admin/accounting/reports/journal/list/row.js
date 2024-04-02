import React from 'react';
import { numberFormat } from '../../../../../../function/numberFormat';
import { Col, Input, Row, Table } from 'reactstrap';

const EntryRow = ({
    id,
    entry
}) => {
    return (
        <>
            <Row>
                <Col md="12">
                    <label style={{ fontWeight: "bold" }}>Asiento Nº: {entry.number}</label>
                </Col>
            </Row>

            <Table className="align-items-center table-flush table-hover filter-table" style={{ minHeight: 0 }}>
                <tbody  >
                    {
                        entry.AccountingEntriesDetails.map((entryDetail, index) => {
                            return (
                                <tr data-row-id={entryDetail.id} data-debit={entryDetail.debit} data-credit={entryDetail.credit} key={index}>
                                    <td style={{ width: "25%" }}>
                                        <label>{entryDetail.AccountChart.code}</label>
                                    </td>
                                    <td style={{ width: "40%" }}>
                                        <label>{entryDetail.AccountChart.name}</label>
                                    </td>
                                    <td style={{ textAlign: "right", width: "13%" }}>
                                        <label>{entryDetail.debit ? numberFormat(entryDetail.debit) : ""}</label>
                                    </td>
                                    <td md="2" style={{ textAlign: "right", width: "13%" }}>
                                        <label>{entryDetail.credit ? numberFormat(entryDetail.credit) : ""}</label>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Row >
                <Col md="8" className="text-left">
                    <Input
                        type="textarea"
                        value={entry.description}
                        disabled
                    />
                </Col>
            </Row>
            <hr />
        </>
    )
}

export default EntryRow;