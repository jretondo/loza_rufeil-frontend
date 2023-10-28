import moment from 'moment';
import React, { useContext } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import CompleteCerosLeft from '../../../../../function/completeCeroLeft';
import { numberFormat } from '../../../../../function/numberFormat';
import AlertsContext from '../../../../../context/alerts';
import ActionsBackend from '../../../../../context/actionsBackend';
import swal from 'sweetalert';
import API_ROUTES from '../../../../../api/routes';

const ReceiptRow = ({
    id,
    receipt,
    first,
    page,
    setPage,
    refreshToggle,
    setReceiptInfo,
    setIsOpenReceiptModal
}) => {
    const { newAlert, newActivity } = useContext(AlertsContext)
    const { axiosDelete, loadingActions } = useContext(ActionsBackend)

    const deleteReceipt = (e, id, number, first, page) => {
        e.preventDefault()
        swal({
            title: "¿Está seguro de eliminar este comprobante? Esta desición es permanente.",
            text: "Eliminar el comprobante Nº " + number + " correspondiente a : " + receipt.Provider.business_name + "!",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                let backPage = false
                if (willDelete) {
                    const response = await axiosDelete(API_ROUTES.purchasesDir.sub.receipt, id)
                    if (!response.error) {
                        if (first) {
                            if (page > 1) {
                                backPage = true
                            }
                        }
                        newActivity(`Se ha eliminado el comprobante de compra Nº ${number}) correspondiente a ${receipt.Provider.business_name} (${receipt.Provider.document_number})`)
                        newAlert("success", "Comprobante de compra eliminado con éxito!", "")
                        if (backPage) {
                            setPage(parseInt(page - 1))
                        } else {
                            refreshToggle()
                        }
                    } else {
                        newAlert("danger", "Hubo un error!", "Intentelo nuevamente. Error: " + response.errorMsg)
                    }
                }
            });
    }

    const details = (e, receiptInfo) => {
        e.preventDefault()
        setReceiptInfo(receiptInfo)
        setIsOpenReceiptModal(true)
    }

    return (<>
        <tr key={id} className={loadingActions ? "shimmer" : ""} >
            <td className='text-center'>{moment(new Date(receipt.date)).format("DD/MM/YYYY")}</td>
            <td className='text-center'>{
                (receipt.receipt_type === 1 && "Factura") ||
                (receipt.receipt_type === 2 && "Recibo") ||
                (receipt.receipt_type === 3 && "Ticket") ||
                (receipt.receipt_type === 4 && "Nota de credito") ||
                (receipt.receipt_type === 5 && "Nota de debito")
            } {receipt.word} {CompleteCerosLeft(receipt.sell_point, 5)}-{CompleteCerosLeft(receipt.number, 8)}</td>
            <td className='text-center'>{receipt.Provider.business_name} ({receipt.Provider.document_number})</td>
            <td className='text-center'>$ {numberFormat(receipt.total)}</td>
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
                            onClick={e => details(e, receipt)}
                        >
                            <i className="fas fa-edit"></i>
                            Ver Detalles
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => deleteReceipt(e, receipt.id, receipt.word + " " + CompleteCerosLeft(receipt.sell_point, 5) + "-" + CompleteCerosLeft(receipt.number, 8), first, page)}
                        >
                            <i className="fas fa-trash-alt"></i>
                            Eliminar
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    </>)
}

export default ReceiptRow