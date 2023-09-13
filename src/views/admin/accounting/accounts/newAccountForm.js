import React, { useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { accountCodeGenerate } from './accountCodeGenerate';

const NewAccountForm = ({ parentAccount, isOpen, toggle }) => {
    const [numberAccountData, setNumberAccountData] = useState(parentAccount && accountCodeGenerate(parentAccount))
    console.log('numberAccountData :>> ', numberAccountData);
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
                        <Input value={numberAccountData} disabled />
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