import React, { useEffect, useState } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import CompleteCerosLeft from '../../../../../function/completeCeroLeft';
import { numberFormat } from '../../../../../function/numberFormat';
import { invoiceTypeConvert } from '../../../../../function/invoiceType';
import { getProviderRow } from '../../../../../function/providerGetRow';
import moment from 'moment';
import InputSearch from '../../../../../components/Search/InputSearch';

const RowImportPurchase = ({
    id,
    receipt,
    loadingActions,
    accountsList,
    accountSearchFn
}) => {
    const [paymentAccount, setPaymentAccount] = useState(false)
    const [vatCheck, setVatCheck] = useState(true)
    const totalVat = receipt.VatRatesReceipts[0].vat_amount
    const othersImports = receipt.exempt_transactions + receipt.vat_withholdings + receipt.national_tax_withholdings + receipt.gross_income_withholdings + receipt.local_tax_withholdings + receipt.internal_tax
    let unrecorded = receipt.total - (receipt.VatRatesReceipts[0].recorded_net + receipt.unrecorded + receipt.VatRatesReceipts[0].vat_amount + othersImports)
    unrecorded = Math.round(unrecorded * 100) / 100

    const checkVat = () => {
        let taxRate = (receipt.VatRatesReceipts[0].vat_amount > 0) ? ((receipt.VatRatesReceipts[0].vat_amount * 100) / (receipt.VatRatesReceipts[0].recorded_net)) : 0
        taxRate = taxRate > 0 ? Math.round(taxRate * 100) / 100 : 0
        if (taxRate === 0 || taxRate === 10.5 || taxRate === 21 || taxRate === 27 || taxRate === 5 || taxRate === 2.5) {
            setVatCheck(true)
        } else {
            setVatCheck(false)
        }
    }

    const totalCheck = () => {
        let difference = receipt.total - (unrecorded + receipt.VatRatesReceipts[0].recorded_net + receipt.unrecorded + receipt.VatRatesReceipts[0].vat_amount + othersImports)
        difference = Math.round(difference * 100) / 100
        if (difference === 0) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (receipt.Provider) {
            setPaymentAccount(accountsList.find(account => account.id === receipt.Provider.ProviderParameters[0].account_chart_id))
        }
    }, [receipt, setPaymentAccount, accountsList])

    useEffect(() => {
        checkVat()
        // eslint-disable-next-line
    }, [totalVat, othersImports])

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
                    <InputSearch
                        itemsList={accountsList}
                        itemSelected={paymentAccount}
                        title={""}
                        placeholderInput={"Busque una cuenta..."}
                        getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                        setItemSelected={(account) => { setPaymentAccount(account) }}
                        searchFn={accountSearchFn}
                    />
                </td>
                <td
                    style={vatCheck ? {} : { backgroundColor: "red", color: "white", fontWeight: "bold" }}
                >
                    $ {numberFormat(receipt.VatRatesReceipts[0].recorded_net)}
                </td>
                <td>
                    $ {numberFormat(unrecorded)}
                </td>
                <td>
                    $ {numberFormat(receipt.VatRatesReceipts[0].vat_amount)}
                </td>
                <td  >
                    $ {numberFormat(othersImports)}
                </td>
                <td className='text-center' style={totalCheck() ? {} : { backgroundColor: "red", color: "white", fontWeight: "bold" }}>
                    $ {numberFormat(receipt.total)}
                </td>
                <td className="text-right">
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                            >
                                <i className="fas fa-edit"></i>
                                Ver Detalles
                            </DropdownItem>
                            <DropdownItem
                                //disabled={purchasePeriod.closed ? true : false}
                                href="#pablo"
                            //onClick={e => deleteReceipt(e, receipt.id, receipt.word + " " + CompleteCerosLeft(receipt.sell_point, 5) + "-" + CompleteCerosLeft(receipt.number, 8), first, page)}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
        </>
    )
}

export default RowImportPurchase