import React, { useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import InputSearch from '../../../../../components/Search/InputSearch';
import { numberFormat } from '../../../../../function/numberFormat';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ChargeEntriesComp = ({
    accountsList
}) => {
    const [detail, setDetail] = useState("")
    const [entries, setEntries] = useState([{
        id: 1,
        account: false,
        debit: 0,
        credit: 0
    }, {
        id: 2,
        account: false,
        debit: 0,
        credit: 0

    }])

    const accountSearchFn = (account, searchedText) => {
        if ((account.name).toLowerCase().includes(searchedText.toLowerCase()) || (account.code).toLowerCase().includes(searchedText.toLowerCase())) {
            return account
        }
    }

    return (
        <Form>
            <h2 className='text-center'>Nuevo Asiento</h2>
            <Row>
                <Col md="3" className="p-3 m-3" style={{ border: "4px #5d7d99 solid" }}>
                    <FormGroup>
                        <Label>Nº Asiento</Label>
                        <Input style={{ fontWeight: "bold" }} value="1" type="text" disabled />
                    </FormGroup>
                </Col>
                <Col md="3" className="p-3 m-3" style={{ border: "4px #5d7d99 solid" }}>
                    <FormGroup>
                        <Label>Fecha</Label>
                        <Input type="date" />
                    </FormGroup>
                </Col>
                <Col className="pt-5" md="5" style={{ textAlign: "right" }}>
                    <Button
                        color="primary"
                        className="ml-2 h-50"
                    >
                        Guardar Asiento <i className='fas fa-save'></i>
                    </Button>
                    <Button
                        color="info"
                        className="ml-2 h-50"
                    >
                        Imprimir Asiento <i className='fas fa-print'></i>
                    </Button>
                    <Button
                        color="danger"
                        className="ml-2 h-50"
                    >
                        Cancelar <i className='fas fa-times'></i>
                    </Button>
                </Col>


            </Row>
            <Row className="pt-2" style={{ borderTop: "4px #5d7d99 solid", borderRight: "4px #5d7d99 solid", borderLeft: "4px #5d7d99 solid" }}>
                <Col md="5">
                    <FormGroup>
                        <Label>Cuenta</Label>
                    </FormGroup>
                </Col>
                <Col md="3">
                    <FormGroup>
                        <Label>Debe</Label>
                    </FormGroup>
                </Col>
                <Col md="3">
                    <FormGroup>
                        <Label>Haber</Label>
                    </FormGroup>
                </Col>
            </Row>
            {
                entries && entries.map((entry, key) => {
                    return (
                        <Row key={key} className="px-3" style={{ borderRight: "4px #5d7d99 solid", borderLeft: "4px #5d7d99 solid" }}>
                            <Col md="5">
                                <FormGroup>
                                    <InputSearch
                                        itemsList={accountsList}
                                        setItemsList={() => { }}
                                        itemSelected={entry.account}
                                        placeholderInput={"Busque una cuenta..."}
                                        getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                        setItemSelected={(item) => {
                                            const newEntries = entries.map((entry, index) => {
                                                if (index === key) {
                                                    entry.account = item
                                                }
                                                return entry
                                            })
                                            setEntries(newEntries)
                                        }}
                                        searchFn={accountSearchFn}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Input
                                        type="number"
                                        value={entry.debit}
                                        onChange={(e) => {
                                            const newEntries = entries.map((entry, index) => {
                                                if (index === key) {
                                                    entry.debit = e.target.value
                                                    entry.credit = 0
                                                }
                                                return entry
                                            })
                                            setEntries(newEntries)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Input
                                        type="number"
                                        value={entry.credit}
                                        onChange={(e) => {
                                            const newEntries = entries.map((entry, index) => {
                                                if (index === key) {
                                                    entry.credit = e.target.value
                                                    entry.debit = 0
                                                }
                                                return entry
                                            })
                                            setEntries(newEntries)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1">
                                <Button
                                    color="danger"
                                    onClick={e => {
                                        e.preventDefault()
                                        setEntries((entries) => {
                                            return entries.filter((item) => item.id !== entry.id)
                                        })
                                    }}
                                >
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </Col>
                        </Row>
                    )
                })
            }
            <Row className="pb-3" style={{ borderRight: "4px #5d7d99 solid", borderLeft: "4px #5d7d99 solid", borderBottom: "4px #5d7d99 solid" }}>
                <Col md="12" className="text-center">
                    <Button
                        color="primary"
                        onClick={e => {
                            e.preventDefault()
                            setEntries([...entries,
                            {
                                id: entries.length + 1,
                                account: false,
                                debit: 0,
                                credit: 0
                            }])
                        }}
                    >
                        <i className="fas fa-plus"></i>
                    </Button>
                </Col>
            </Row>
            <Row className="p-3 m-3" style={{ border: "4px #f5365c solid" }}>
                <Col md="5">
                    <h3>TOTAL:</h3>
                </Col>
                <Col md="3">
                    <h3>$ {
                        numberFormat(entries ? entries.reduce((acc, entry) => {
                            return acc + parseFloat(entry.debit)
                        }, 0) : 0)
                    }</h3>
                </Col>
                <Col md="3">
                    <h3>$ {
                        numberFormat(entries ? entries.reduce((acc, entry) => {
                            return acc + parseFloat(entry.credit)
                        }, 0) : 0)
                    }</h3>
                </Col>
                <Col md="1">

                </Col>
            </Row>
            <Row>
                <Col md="12" className="p-3 m-3" style={{ border: "4px #5d7d99 solid" }}>
                    <FormGroup>
                        <Label>Detalle</Label>
                        <ReactQuill
                            theme="snow"
                            value={detail}
                            onChange={setDetail}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }]
                                ]
                            }}
                            style={{ background: "#e8eaed", height: "200px" }}
                        />
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}

export default ChargeEntriesComp;