import { numberFormat } from 'function/numberFormat';
import React from 'react';
import { Table } from 'reactstrap';

const PurchasesEntrySummary = ({ entryAmounts }) => {
    const purchaseAmounts = parseFloat(entryAmounts.recorded) + parseFloat(entryAmounts.unrecorded) + parseFloat(entryAmounts.exempt);
    const totalCredit = parseFloat(entryAmounts.recorded) + parseFloat(entryAmounts.unrecorded) + parseFloat(entryAmounts.exempt) + parseFloat(entryAmounts.taxes);
    return (<>
        <Table>
            <thead>
                <tr>
                    <td className='p-2' style={{ fontWeight: "bold" }}>Concepto</td>
                    <td className='p-2' style={{ fontWeight: "bold" }}>Debe</td>
                    <td className='p-2' style={{ fontWeight: "bold" }}>Haber</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='p-1'>Total Gasto:</td>
                    <td className='p-1'>$ {numberFormat(purchaseAmounts)}</td>
                    <td className='p-1'></td>
                </tr>
                <tr>
                    <td className='p-1'>Total Impuestos:</td>
                    <td className='p-1'>$ {numberFormat(entryAmounts.taxes)}</td>
                    <td className='p-1'></td>
                </tr>
                <tr>
                    <td className='p-1'>Total Pago:</td>
                    <td className='p-1'></td>
                    <td className='p-1'>$ {numberFormat(entryAmounts.payments)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td className='p-2'></td>
                    <td className='p-2' style={{ fontWeight: "bold" }}>$ {numberFormat(totalCredit)}</td>
                    <td className='p-2' style={{ fontWeight: "bold" }}>$ {numberFormat(entryAmounts.payments)}</td>
                </tr>
            </tfoot>
        </Table>
    </>)
}

export default PurchasesEntrySummary