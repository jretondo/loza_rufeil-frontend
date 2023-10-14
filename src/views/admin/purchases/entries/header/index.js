import React from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, InputGroup, Input, InputGroupAddon, Button } from 'reactstrap';

const PurchasesEntriesChargeHeader = ({
    activeClient,
    confirmedPeriod,
    setPeriodMonth,
    periodMonth,
    setPeriodYear,
    periodYear,
    setConfirmedPeriod,
    activePeriod
}) => {

    const getYearsLimits = () => {
        const fromYear = parseInt(activePeriod.from_date.substring(0, 4))
        const toYear = parseInt(activePeriod.to_date.substring(0, 4))
        const years = [fromYear, toYear]
        return years.filter((value, index, array) => array.indexOf(value) === index);
    }

    return (<>
        <Card className="mt-2">
            <CardBody className="py-2">
                {
                    activeClient ?
                        <Row>
                            <Col md="3"></Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label>Periodo</Label>
                                    <InputGroup>
                                        <Input type="select" onChange={e => setPeriodMonth(e.target.value)} value={periodMonth} disabled={confirmedPeriod}>
                                            <option value={1}>Enero</option>
                                            <option value={2}>Febrero</option>
                                            <option value={3}>Marzo</option>
                                            <option value={4}>Abril</option>
                                            <option value={5}>Mayo</option>
                                            <option value={6}>Junio</option>
                                            <option value={7}>Julio</option>
                                            <option value={8}>Agosto</option>
                                            <option value={9}>Septiembre</option>
                                            <option value={10}>Octubre</option>
                                            <option value={11}>Noviembre</option>
                                            <option value={12}>Diciembre</option>
                                        </Input>
                                        <InputGroupAddon addonType="append">
                                            <Input type="select" onChange={e => setPeriodYear(e.target.value)} value={periodYear} disabled={confirmedPeriod}>
                                                {getYearsLimits().map((year, index) => <option key={index} value={year}>{year}</option>)}
                                            </Input>
                                        </InputGroupAddon>
                                        <InputGroupAddon addonType="append">
                                            <Button
                                                color={confirmedPeriod ? "danger" : "primary"}
                                                onClick={e => {
                                                    e.preventDefault()
                                                    setConfirmedPeriod(!confirmedPeriod)
                                                }}
                                            >{confirmedPeriod ? "X" : "Cargar"}</Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md="3"></Col>
                        </Row> :
                        <Input disabled value="Seleccione una empresa" />
                }
            </CardBody>
        </Card>
    </>)
}

export default PurchasesEntriesChargeHeader;