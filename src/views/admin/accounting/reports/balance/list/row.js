import React from 'react';
import { numberFormat } from '../../../../../../function/numberFormat';

const EntryRow = ({
    id,
    entry
}) => {
    return (
        <>
            <tr data-row-id={entry.id} data-debit={entry.debit} data-credit={entry.credit} key={id}>
                <td style={{ width: "24%", textAlign: "left" }}>
                    <label>{entry.AccountChart.code}</label>
                </td>
                <td style={{ width: "31%" }}>
                    <label>{entry.AccountChart.name}</label>
                </td>
                <td style={{ textAlign: "right", width: "15%" }}>
                    <label>{entry.totalDebit ? numberFormat(entry.totalDebit) : ""}</label>
                </td>
                <td md="2" style={{ textAlign: "right", width: "15%" }}>
                    <label>{entry.totalCredit ? numberFormat(entry.totalCredit) : ""}</label>
                </td>
                <td md="2" style={{ textAlign: "right", width: "15%" }}>
                    <label>{numberFormat(entry.balance < 0 ? -entry.balance : entry.balance)}{entry.balance < 0 ? " Ha." : " De."}</label>
                </td>
            </tr>
        </>
    )
}

export default EntryRow;