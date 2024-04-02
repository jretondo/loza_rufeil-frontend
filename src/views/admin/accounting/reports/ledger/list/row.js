import React from 'react';
import { numberFormat } from '../../../../../../function/numberFormat';
import moment from 'moment';

const EntryRow = ({
    id,
    entry
}) => {
    return (
        <>
            <tr data-row-id={entry.id} data-debit={entry.debit} data-credit={entry.credit} key={id}>
                <td style={{ width: "12%" }}>
                    <label>{moment(entry.AccountingEntry.date).format("DD/MM/YYYY")}</label>
                </td>
                <td style={{ width: "12%", textAlign: "center" }}>
                    <label>{entry.AccountingEntry.number}</label>
                </td>
                <td style={{ width: "31%" }}>
                    <label>{entry.AccountingEntry.description}</label>
                </td>
                <td style={{ textAlign: "right", width: "15%" }}>
                    <label>{entry.debit ? numberFormat(entry.debit) : ""}</label>
                </td>
                <td md="2" style={{ textAlign: "right", width: "15%" }}>
                    <label>{entry.credit ? numberFormat(entry.credit) : ""}</label>
                </td>
                <td md="2" style={{ textAlign: "right", width: "15%" }}>
                    <label>{numberFormat(entry.totalBalance < 0 ? -entry.totalBalance : entry.totalBalance)}{entry.totalBalance < 0 ? " Ha." : " De."}</label>
                </td>
            </tr>
        </>
    )
}

export default EntryRow;