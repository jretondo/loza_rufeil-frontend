import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { TableList } from '../../../../../components/Lists/TableList';
import RowImportPurchase from './rowImportPurchase';

const ImportData = ({
    purchasePeriod,
    setImportDataModule,
    purchaseImported,
    setImportFile,
    accountsList,
    accountSearchFn
}) => {
    return (
        <>
            <Row>
                <Col md="12" className="text-center">
                    <TableList titlesArray={["Fecha", "Comprobante", "Proveedor", "Cuenta Gasto", "Grabado", "No Grabado", "IVA", "Otros", "Importe", ""]}>
                        {
                            purchaseImported && purchaseImported.map((receipt, key) => {
                                return <RowImportPurchase
                                    key={key}
                                    id={key}
                                    receipt={receipt}
                                    accountsList={accountsList}
                                    accountSearchFn={accountSearchFn}
                                />
                            })
                        }
                    </TableList>
                </Col>
            </Row>
            <Row>
                <Col md="12" className="text-center">
                    <Button
                        color="primary"
                    >
                        Insertar datos
                    </Button>
                    <Button
                        color="danger"
                        onClick={e => {
                            setImportFile(false)
                            setImportDataModule(false)
                        }}
                    >
                        Cerrar
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default ImportData