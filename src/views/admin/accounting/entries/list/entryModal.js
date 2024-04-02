import React from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { TableList } from '../../../../../components/Lists/TableList';
import { numberFormat } from '../../../../../function/numberFormat';
import moment from 'moment';

const EntryModal = ({
    entry,
    toggle,
    isOpen
}) => {
    return (
        <Modal size="lg" isOpen={isOpen} toggle={toggle}>
            <ModalHeader>
                Detalles del asiento {entry.number}
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="4">
                        <FormGroup>
                            <Label>Fecha</Label>
                            <Input
                                disabled
                                type="text"
                                value={moment(entry.date).format("DD/MM/YYYY")}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="8">
                        <FormGroup>
                            <Label>Descripción</Label>
                            <Input
                                disabled
                                type="textarea"
                                value={entry.description}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <TableList titlesArray={["Cuenta", "Debe", "Haber"]}>
                    {entry.AccountingEntriesDetails.map((detail, index) => {
                        return (
                            <tr key={index}>
                                <td>{detail.AccountChart.name} ({detail.AccountChart.code})</td>
                                <td style={{ textAlign: "right" }}>$ {numberFormat(detail.debit)}</td>
                                <td style={{ textAlign: "right" }}>$ {numberFormat(detail.credit)}</td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td style={{ fontSize: "20px" }}><strong>Total</strong></td>
                        <td style={{ textAlign: "right", fontSize: "20px" }}><strong>$ {numberFormat(entry.debit)}</strong></td>
                        <td style={{ textAlign: "right", fontSize: "20px" }}><strong>$ {numberFormat(entry.credit)}</strong></td>
                    </tr>
                </TableList>
            </ModalBody>
            <ModalFooter>
                <button
                    className="btn btn-primary"
                    onClick={toggle}
                >
                    Cerrar
                </button>
            </ModalFooter>
        </Modal>
    );
}

export default EntryModal;