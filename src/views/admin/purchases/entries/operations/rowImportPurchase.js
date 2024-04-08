import React from 'react';
import { Button } from 'reactstrap';
import CompleteCerosLeft from '../../../../../function/completeCeroLeft';
import { numberFormat } from '../../../../../function/numberFormat';
import { invoiceTypeConvert } from '../../../../../function/invoiceType';
import { getProviderRow } from '../../../../../function/providerGetRow';
import moment from 'moment';

const RowImportPurchase = ({
    id,
    receipt,
    loadingActions,
    setPurchaseImported,
    setInvoiceSelected
}) => {
    const totalRecored = receipt.VatRatesReceipts.filter((vat) => vat !== 0).map((vat) => {
        return vat.recorded_net
    }).reduce((a, b) => a + b, 0)

    const vatAmount = receipt.VatRatesReceipts.filter((vat) => vat !== 0).map((vat) => {
        return vat.vat_amount
    }).reduce((a, b) => a + b, 0)

    const othersImports = receipt.exempt_transactions + receipt.vat_withholdings + receipt.national_tax_withholdings + receipt.gross_income_withholdings + receipt.local_tax_withholdings + receipt.internal_tax
    let unrecorded = receipt.total - (totalRecored + receipt.unrecorded + vatAmount + othersImports)
    unrecorded = Math.round(unrecorded * 100) / 100

    const totalCheck = () => {
        let difference = receipt.total - (unrecorded + totalRecored + receipt.unrecorded + vatAmount + othersImports)
        difference = Math.round(difference * 100) / 100
        if (difference === 0) {
            return true
        } else {
            return false
        }
    }

    const removeInvoice = (e) => {
        e.preventDefault()
        setPurchaseImported(prevState => prevState.filter((item, key) => parseInt(key) !== parseInt(id)))
    }

    return (
        <>
            <tr key={id} className={loadingActions ? "shimmer" : ""} >
                <td className='text-center'>
                    {moment(receipt.date).format("DD/MM/YYYY")}
                </td>
                <td className='text-center'>{
                    invoiceTypeConvert(parseInt(receipt.receipt_type))
                } {receipt.word} {CompleteCerosLeft(receipt.sell_point, 5)}-{CompleteCerosLeft(receipt.number, 8)}
                </td>
                <td className='text-center' style={receipt.Provider ? {} : { backgroundColor: "#fb6340", color: "white", fontWeight: "bold" }}>
                    {getProviderRow(receipt)}
                </td>
                <td>
                    <Button
                        color={receipt.checked ? "success" : "danger"}
                        onClick={e => {
                            e.preventDefault()
                            setInvoiceSelected(receipt)
                        }}
                    >
                        {
                            receipt.checked ? "Chequeado" : "No Chequeado"
                        }
                    </Button>
                </td>
                <td className='text-center' style={totalCheck() ? {} : { backgroundColor: "red", color: "white", fontWeight: "bold" }}>
                    $ {numberFormat(receipt.total)}
                </td>
                <td className="text-right">
                    <Button
                        color="danger"
                        onClick={removeInvoice}
                    >
                        <i className='fa fa-times'></i>
                    </Button>
                </td>
            </tr>
        </>
    )
}

export default RowImportPurchase