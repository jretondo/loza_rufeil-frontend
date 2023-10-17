import API_ROUTES from '../../../../../api/routes';
import { TableList } from 'components/Lists/TableList';
import ActionsBackend from 'context/actionsBackend';
import LoadingContext from 'context/loading';
import CompleteCerosLeft from 'function/completeCeroLeft';
import { numberFormat } from 'function/numberFormat';
import { useAxiosGetList } from 'hooks/useAxiosGetList';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Pagination, Row } from 'reactstrap';

const PurchasesEntriesList = ({ purchasePeriodId, refreshList, setRefreshList }) => {
    const [page, setPage] = useState(1)

    const [receiptsList, setReceiptsList] = useState([])
    const [stringSearched, setStringSearched] = useState("")

    const { setIsLoading } = useContext(LoadingContext)
    const {
        dataPage,
        pageObj,
        errorList,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.purchasesDir.sub.receipts,
        page, refreshList, [{ query: stringSearched }, { purchasePeriodId: purchasePeriodId }]
    )


    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

    useEffect(() => {
        errorList && setReceiptsList([])
    }, [errorList])

    return (
        <>
            <Row>
                <Col md="12">
                    <Row>
                        <Col md="12">
                            <TableList titlesArray={["Fecha", "Comprobante", "Proveedor", "Importe"]}>
                                {dataPage.length > 0 ? dataPage.map((receipt, key) => {
                                    return (
                                        <tr key={key}>
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
                                        </tr>
                                    )
                                }) : <tr><td></td><td>No hay comprobantes para mostrar</td></tr>}
                            </TableList>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md="12" className="text-center">
                    {!pageObj ? null : <Pagination
                        page={page}
                        setPage={setPage}
                        dataPages={pageObj}
                    />}
                </Col>
            </Row>
        </>
    )
}

export default PurchasesEntriesList