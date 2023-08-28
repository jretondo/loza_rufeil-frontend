import { TableList } from 'components/Lists/TableList';
import React from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';

const PurchasesEntriesList = () => {
    return (
        <Row>
            <Col md="12">
                <Row>
                    <Col md="12" className="text-center mb-2">
                        <Button color="primary">Importar desde AFIP <i className="fas fa-download"></i></Button>
                        <Button color="primary">Generar txt para AFIP <i className="fas fa-upload"></i></Button>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <TableList titlesArray={["Fecha", "Comprobante", "Proveedor", "Importe"]}>

                        </TableList>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default PurchasesEntriesList