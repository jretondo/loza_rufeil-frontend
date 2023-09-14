import AlertsContext from 'context/alerts';
import API_ROUTES from '../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import CompleteCerosLeft from 'function/completeCeroLeft';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

const AccountForm = ({ parentAccount, isOpen, toggle, setIsLoading, toUpdate }) => {
    const [formData, setFormData] = useState({
        id: false,
        genre: 0,
        group: 0,
        caption: 0,
        account: 0,
        sub_account: 0,
        code: "000000000",
        name: "",
        inflation_adjustment: false,
        attributable: false,
        accounting_period_id: JSON.parse(localStorage.getItem("activePeriod")).id
    })

    const { axiosGetQuery, loadingActions, axiosPost } = useContext(ActionsBackend)
    const { newAlert, newActivity } = useContext(AlertsContext)

    const getLastChild = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.accountingChart, [{ accountId: parentAccount.id }])
        if (!response.error) {
            const code = response.data.genre
                + CompleteCerosLeft(response.data.group, 2)
                + CompleteCerosLeft(response.data.caption, 2)
                + CompleteCerosLeft(response.data.account, 2)
                + CompleteCerosLeft(response.data.sub_account, 2)
            setFormData({
                ...response.data,
                code: code,
                name: formData.name,
                id: null,
                accounting_period_id: formData.accounting_period_id
            })
        } else {
            newAlert("error", "Hubo un error!", "Error: " + response.errorMsg)
        }
    }

    const postDataForm = async () => {
        const response = await axiosPost(API_ROUTES.accountingDir.sub.accountingChart, { formData })
        if (!response.error) {
            if (formData.id) {
                newActivity(`El usuario modificó la cuenta: ${formData.name} (${formData.code})`)
                newAlert("success", "Cuenta modificada!", "")
            } else {
                newActivity(`El usuario agregó una nueva cuenta: ${formData.name} (${formData.code})`)
                newAlert("success", "Cuenta registrada!", "")
            }
            setDefaultState()
            toggle()
        } else {
            newAlert("error", "Hubo un error!", "Error: " + response.errorMsg)
        }
    }

    const setDefaultState = () => {
        setFormData({
            id: false,
            genre: 0,
            group: 0,
            caption: 0,
            account: 0,
            sub_account: 0,
            code: "000000000",
            name: "",
            inflation_adjustment: false,
            attributable: false,
            accounting_period_id: JSON.parse(localStorage.getItem("activePeriod")).id
        })
    }

    useEffect(() => {
        isOpen && !toUpdate && getLastChild()
        !isOpen && setDefaultState()
        isOpen && toUpdate && setFormData({
            id: parentAccount.id,
            genre: parentAccount.genre,
            group: parentAccount.group,
            caption: parentAccount.caption,
            account: parentAccount.account,
            sub_account: parentAccount.sub_account,
            code: parentAccount.code,
            name: parentAccount.name,
            inflation_adjustment: parentAccount.inflation_adjustment,
            attributable: parentAccount.attributable,
            accounting_period_id: JSON.parse(localStorage.getItem("activePeriod")).id
        })
        // eslint-disable-next-line
    }, [parentAccount, isOpen])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    console.log('formData :>> ', formData);

    return <Modal size="lg" toggle={toggle} isOpen={isOpen}>
        <Form onSubmit={e => {
            e.preventDefault()
            postDataForm()
        }} >
            <ModalHeader>
                <span style={{ fontSize: "20px", color: "red", position: "absolute", right: 0, top: 0, padding: "20px", fontWeight: "bold" }}>{formData.id ? "MODIFICACIÓN" : "NUEVA CUENTA"}</span>
                Cuenta{!formData.id && " padre"}: {parentAccount && parentAccount.name} ({parentAccount && parentAccount.code})
            </ModalHeader>
            <ModalBody>

                <Row>
                    <Col md="8">
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input required value={formData.name} onChange={e => {
                                setFormData({ ...formData, name: (e.target.value).toUpperCase() })
                            }} />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <Label>Código</Label>
                            <Input value={formData.code} disabled />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" onChange={e => {
                                    setFormData({ ...formData, attributable: e.target.checked })
                                }} />{' '}
                                Imputable
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" onChange={e => {
                                    setFormData({ ...formData, inflation_adjustment: e.target.checked })
                                }} />{' '}
                                Ajuste por inflación
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>

            </ModalBody>
            <ModalFooter>
                <Button type="submit" color="primary">
                    {formData.id ? "Aplicar" : "Cargar"}
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
        </Form>
    </Modal>
}

export default AccountForm