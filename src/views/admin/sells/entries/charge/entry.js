import { numberFormat } from 'function/numberFormat';
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import roundNumber from '../../../../../function/roundNumber';

const PurchasesEntrySummary = ({
    paymentsMethods,
    receiptConcepts,
    taxesList,
}) => {
    const [totalTax, setTotalTax] = useState(0)
    const [totalPayments, setTotalPayments] = useState(0)
    const [totalReceipts, setTotalReceipts] = useState(0)

    useEffect(() => {
        setTotalTax(taxesList.reduce((acc, tax) => acc + roundNumber(tax.amount), 0))
        setTotalPayments(paymentsMethods.reduce((acc, payment) => acc + roundNumber(payment.amount), 0))
        setTotalReceipts(receiptConcepts.reduce((acc, receipt) => acc + roundNumber(receipt.amount), 0))
    }, [paymentsMethods, receiptConcepts, taxesList])

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
                    <td className='p-1'>$ {numberFormat(totalReceipts)}</td>
                    <td className='p-1'></td>
                </tr>
                <tr>
                    <td className='p-1'>Total Impuestos:</td>
                    <td className='p-1'>$ {numberFormat(totalTax)}</td>
                    <td className='p-1'></td>
                </tr>
                <tr>
                    <td className='p-1'>Total Pago:</td>
                    <td className='p-1'></td>
                    <td className='p-1'>$ {numberFormat(totalPayments)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td className='p-2'></td>
                    <td className='p-2' style={{ fontWeight: "bold" }}>$ {numberFormat(totalReceipts + totalTax)}</td>
                    <td className='p-2' style={{ fontWeight: "bold" }}>$ {numberFormat(totalPayments)}</td>
                </tr>
            </tfoot>
        </Table>
    </>)
}

export default PurchasesEntrySummary