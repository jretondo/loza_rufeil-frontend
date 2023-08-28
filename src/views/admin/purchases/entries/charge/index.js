import classNames from 'classnames';
import { TableList } from 'components/Lists/TableList';
import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';

const PurchasesEntriesCharge = () => {
    const [date, setDate] = useState("")
    const [documentNumber, setDocumentNumber] = useState("")
    const [businessName, setBusinessName] = useState("")
    const [total, setTotal] = useState("")
    const [type, setType] = useState(0)
    const [word, setWord] = useState("")
    const [sellPoint, setSellPoint] = useState("")
    const [number, setNumber] = useState("")
    const [paymentMethods, setPaymentMethods] = useState([])
    const [purchasesConcepts, setPurchasesConcepts] = useState([])
    const [activeTab, setActiveTab] = useState(0)

    const nextInput = (e, order) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            const newOrder = order + 1
            try {
                document.getElementById("order_" + newOrder).focus()
            } catch (error) { }
        }
    }

    const changeWord = (w) => {
        switch (w.toString()) {
            case "1":
                setWord("A")
                break;
            case "2":
                setWord("B")
                break;
            case "3":
                setWord("C")
                break;
            case "4":
                setWord("M")
                break;
            default:
                setWord(w.toUpperCase())
                break;
        }
    }

    return (
        <Form>
            <Row>
                <Col md="2">
                    <FormGroup>
                        <Label>Fecha</Label>
                        <Input value={date} onChange={e => setDate(e.target.value)} id="order_1" type="date" onKeyDown={(e) => nextInput(e, 1)} />
                    </FormGroup>
                </Col>
                <Col md="6">
                    <Label>Proveedor</Label>
                    <InputGroup>
                        <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} id="order_2" placeholder="CUIT..." className="col-md-4" onKeyDown={(e) => nextInput(e, 2)} />
                        <InputGroupAddon addonType="append">
                            <Button color="info"><i className='fa fa-search'></i></Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append" style={{ width: "60%" }}>
                            <Input value={businessName} disabled className="col-md-12" style={{ borderRadiusTopLeft: 0, borderRadiusBottomLeft: 0 }} />
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
                <Col md="4">
                    <FormGroup>
                        <Label>Importe</Label>
                        <Input value={total} onChange={e => setTotal(e.target.value)} type="number" id="order_3" onKeyDown={(e) => nextInput(e, 3)} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <FormGroup>
                        <Label>Tipo</Label>
                        <Input value={type} onChange={e => setType(e.target.value)} id="order_4" type="select" onKeyDown={(e) => nextInput(e, 4)} >
                            <option value={0}>Factura</option>
                            <option value={2}>Recibo</option>
                            <option value={3}>Tiquet</option>
                        </Input>
                    </FormGroup>
                </Col>
                <Col md="2">
                    <FormGroup>
                        <Label>Letra</Label>
                        <Input value={word} onChange={e => changeWord(e.target.value)} maxLength={1} id="order_5" type="text" onKeyDown={(e) => nextInput(e, 5)} />
                    </FormGroup>
                </Col>
                <Col md="3">
                    <FormGroup>
                        <Label>PV</Label>
                        <Input value={sellPoint} onChange={e => setSellPoint(e.target.value)} id="order_6" type="number" onKeyDown={(e) => nextInput(e, 6)} />
                    </FormGroup>
                </Col>
                <Col md="3">
                    <FormGroup>
                        <Label>Número</Label>
                        <Input value={number} onChange={e => setNumber(e.target.value)} id="order_7" type="number" onKeyDown={(e) => nextInput(e, 7)} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md="12" className="text-center">
                    <Button color="primary">
                        Cargar
                    </Button>
                    <Button color="danger">
                        Cancelar
                    </Button>
                </Col>
            </Row>
            <Nav tabs>
                <NavItem style={{ cursor: "pointer" }}>
                    <NavLink
                        style={activeTab === 0 ? { background: "#073863", color: "white" } : { background: "#adb5bd" }}
                        className={classNames({ active: activeTab === 0 })}
                        onClick={() => setActiveTab(0)}
                    >
                        Conceptos de gasto
                    </NavLink>
                </NavItem>
                <NavItem style={{ cursor: "pointer" }}>
                    <NavLink
                        style={activeTab === 1 ? { background: "#073863", color: "white" } : { background: "#adb5bd" }}
                        className={classNames({ active: activeTab === 1 })}
                        onClick={() => setActiveTab(1)}
                    >
                        Metodos de pago
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId={0} className="p-5" style={{ background: "#073863", color: "white" }}>
                    <Row>
                        <Col md="12">
                            <Row>
                                <Col>
                                    <Label>Cuenta de gasto</Label>
                                    <InputGroup>
                                        <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} id="order_2" placeholder="Código..." className="col-md-3" onKeyDown={(e) => nextInput(e, 2)} />
                                        <InputGroupAddon addonType="append">
                                            <Button color="info"><i className='fa fa-search'></i></Button>
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append" style={{ width: "35%" }}>
                                            <Input value={businessName} disabled className="col-md-12" style={{ borderRadiusTopLeft: 0, borderRadiusBottomLeft: 0 }} />
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append" style={{ width: "20%" }}>
                                            <Input placeholder="importe $" className="col-md-12" style={{ borderRadiusTopLeft: 0, borderRadiusBottomLeft: 0 }} />
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append">
                                            <Button color="success"><i className='fa fa-check'></i></Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md="12">
                                    <Row>
                                        <Col md="12">
                                            <TableList titlesArray={["Cuenta", "Importe", ""]}>

                                            </TableList>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId={1} className="p-5" style={{ background: "#073863", color: "white" }} >
                    <Row>
                        <Col md="12" >
                            <Row>
                                <Col>
                                    <Label>Concepto de pago</Label>
                                    <InputGroup>
                                        <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} id="order_2" placeholder="Código..." className="col-md-3" onKeyDown={(e) => nextInput(e, 2)} />
                                        <InputGroupAddon addonType="append">
                                            <Button color="info"><i className='fa fa-search'></i></Button>
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append" style={{ width: "35%" }}>
                                            <Input value={businessName} disabled className="col-md-12" style={{ borderRadiusTopLeft: 0, borderRadiusBottomLeft: 0 }} />
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append" style={{ width: "20%" }}>
                                            <Input placeholder="importe $" className="col-md-12" style={{ borderRadiusTopLeft: 0, borderRadiusBottomLeft: 0 }} />
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append">
                                            <Button color="success"><i className='fa fa-check'></i></Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md="12">
                                    <Row>
                                        <Col md="12">
                                            <TableList titlesArray={["Cuenta", "Importe", ""]}>

                                            </TableList>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Form>
    )
}

export default PurchasesEntriesCharge