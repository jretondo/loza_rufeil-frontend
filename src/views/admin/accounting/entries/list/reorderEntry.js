import React, { useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

const ReorderEntry = ({
    entry,
    isOpen,
    toggle
}) => {
    const [entryDate, setEntryDate] = useState(entry.date)
    const [entryNumber, setEntryNumber] = useState(entry.number)
    return (
        <>
            <Modal toggle={toggle} isOpen={isOpen}>
                <ModalHeader>
                    Reordenar asiento contable Nº: {entry.number}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <Label>Nueva Fecha</Label>
                                <Input
                                    type="date"
                                    value={entryDate}
                                    onChange={(e) => setEntryDate(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label>Nuevo Nº</Label>
                                <Input
                                    type="text"
                                    value={entryNumber}
                                    onChange={(e) => setEntryNumber(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={toggle}
                    >
                        Aplicar
                    </Button>
                    <Button
                        color="danger"
                        onClick={toggle}
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default ReorderEntry;