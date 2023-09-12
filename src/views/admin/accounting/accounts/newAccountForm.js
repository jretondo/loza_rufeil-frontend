import React from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

const NewAccountForm = ({ parentAccount, isOpen, toggle }) => {
    return <Modal size="lg" toggle={toggle} isOpen={isOpen}>
        <ModalHeader>
            Cuenta padre: {parentAccount && parentAccount.name} ({parentAccount && parentAccount.code})
        </ModalHeader>
        <ModalBody>
            <Row>
                <Col md="8">
                    <FormGroup>
                        <Label>Nombre</Label>
                        <Input />
                    </FormGroup>
                </Col>
                <Col md="4">
                    <FormGroup>
                        <Label>Código</Label>
                        <Input disabled />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" />{' '}
                            Imputable
                        </Label>
                    </FormGroup>
                </Col>
                <Col md="4">
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" />{' '}
                            Cuenta resultados
                        </Label>
                    </FormGroup>
                </Col>
                <Col md="4">
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" />{' '}
                            Ajuste por inflación
                        </Label>
                    </FormGroup>
                </Col>
            </Row>
        </ModalBody>
        <ModalFooter>
            <Button color="primary">
                Cargar
            </Button>
            <Button
                color="danger"
                onClick={e => {
                    e.preventDefault()
                    toggle()
                }}>
                Cerrar
            </Button>
        </ModalFooter>
    </Modal>
}

export default NewAccountForm