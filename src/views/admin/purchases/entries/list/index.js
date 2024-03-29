import API_ROUTES from '../../../../../api/routes';
import { TableList } from 'components/Lists/TableList';
import LoadingContext from 'context/loading';
import { useAxiosGetList } from 'hooks/useAxiosGetList';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, Row } from 'reactstrap';
import { SearchFormComponent } from '../../../../../components/Search/Search1';
import ReceiptRow from './row';
import CompleteCerosLeft from '../../../../../function/completeCeroLeft';
import moment from 'moment';
import { numberFormat } from '../../../../../function/numberFormat';

const PurchasesEntriesList = ({ purchasePeriodId, refreshList, setRefreshList, purchasePeriod, hasAccountingModule }) => {
    const [page, setPage] = useState(1)
    const [receiptInfo, setReceiptInfo] = useState()
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState(false)
    const [receiptSearch, setReceiptSearch] = useState("")
    const [providerSearch, setProviderSearch] = useState("")

    const { setIsLoading } = useContext(LoadingContext)
    const {
        dataPage,
        pageObj,
        errorList,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.purchasesDir.sub.receipts,
        page, refreshList, [
        { query: receiptSearch },
        { purchasePeriodId: purchasePeriodId },
        { provider: providerSearch }
    ])

    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

    return (
        <>
            <Row className="mb-3">
                <Col>
                    <Button
                        color="primary"
                        onClick={() => setRefreshList(!refreshList)}
                    >
                        Listar
                    </Button>
                </Col>
                <Col md="4" className="text-left">
                    <SearchFormComponent
                        setStringSearched={setReceiptSearch}
                        stringSearched={receiptSearch}
                        setRefreshList={setRefreshList}
                        refreshList={refreshList}
                        title="Buscar por comprobantes"
                    />
                </Col>
                <Col md="4">
                    <SearchFormComponent
                        setStringSearched={setProviderSearch}
                        stringSearched={providerSearch}
                        setRefreshList={setRefreshList}
                        refreshList={refreshList}
                        title="Buscar por proveedor"
                    />
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <Row>
                        <Col md="12">
                            <TableList titlesArray={["Fecha", "Comprobante", "Proveedor", "Importe", ""]}>
                                {!errorList && dataPage.length > 0 ? dataPage.map((receipt, key) => {
                                    let first
                                    if (key === 0) {
                                        first = true
                                    } else {
                                        first = false
                                    }

                                    return (
                                        <ReceiptRow
                                            key={key}
                                            id={key}
                                            receipt={receipt}
                                            first={first}
                                            page={page}
                                            setPage={setPage}
                                            refreshToggle={() => setRefreshList(!refreshList)}
                                            setReceiptInfo={setReceiptInfo}
                                            setIsOpenReceiptModal={setIsOpenReceiptModal}
                                            purchasePeriod={purchasePeriod}
                                        />
                                    )
                                }) : <tr><td></td><td>No hay comprobantes para mostrar</td></tr>}
                            </TableList>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal size="lg" isOpen={isOpenReceiptModal} toggle={() => setIsOpenReceiptModal(!isOpenReceiptModal)}>
                <ModalHeader>
                    <h2>Comprobante de compra Nº {receiptInfo && (receiptInfo.word + " " + CompleteCerosLeft(receiptInfo.sell_point, 5) + "-" + CompleteCerosLeft(receiptInfo.number, 8))}</h2>
                </ModalHeader>
                <ModalBody>
                    {receiptInfo && <>
                        <Row>
                            <Col md="6">
                                <h4>Fecha: {moment(new Date(receiptInfo.date)).format("DD/MM/YYYY")}</h4>
                            </Col>
                            <Col md="6">
                                <h4>Proveedor: {receiptInfo.Provider.business_name}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <TableList titlesArray={hasAccountingModule ? ["Concepto", "Cuenta", "Debe", "Haber"] : ["Concepto", "Debe", "Haber"]}>
                                    {receiptInfo.PurchaseEntries.map((entry, key) => {
                                        console.log('entry :>> ', entry);
                                        return (
                                            <tr key={key}>
                                                <td>{entry.description}</td>
                                                {hasAccountingModule && <td>{entry.AccountChart.name} ({entry.AccountChart.code})</td>}
                                                <td className="text-right">${numberFormat(entry.debit)}</td>
                                                <td className="text-right">${numberFormat(entry.credit)}</td>
                                            </tr>
                                        )
                                    })}
                                </TableList>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" className="text-left">
                                <h3>observaciones:</h3>
                                <div className="content" dangerouslySetInnerHTML={{ __html: receiptInfo.observation }}></div>
                            </Col>
                            <Col md="6" className="text-right">
                                <h3>Total: ${numberFormat(receiptInfo.total)}</h3>
                            </Col>
                        </Row>
                    </>}
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        onClick={() => setIsOpenReceiptModal(!isOpenReceiptModal)}
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
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