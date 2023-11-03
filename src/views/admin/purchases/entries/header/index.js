import AlertsContext from 'context/alerts';
import API_ROUTES from '../../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import { monthToStr } from 'function/monthStr';
import React, { useContext, useEffect, useState } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, InputGroup, Input, InputGroupAddon, Button } from 'reactstrap';
import LoadingContext from 'context/loading';

const PurchasesEntriesChargeHeader = ({
    activeClient,
    confirmedPeriod,
    setPeriodMonth,
    periodMonth,
    setPeriodYear,
    periodYear,
    setConfirmedPeriod,
    activePeriod,
    setPurchasePeriod
}) => {
    const [yearsLimits, setYearsLimits] = useState([])
    const [monthLimits, setMonthLimits] = useState([])

    const { axiosPost, axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { newAlert, newActivity } = useContext(AlertsContext)
    const { setIsLoading } = useContext(LoadingContext)

    const getYearsLimits = () => {
        const fromYear = parseInt(activePeriod.from_date.substring(0, 4))
        const toYear = parseInt(activePeriod.to_date.substring(0, 4))
        const years = [fromYear, toYear]
        !periodYear && setPeriodYear(fromYear)
        setYearsLimits(years)
    }

    const getMonthLimits = (year) => {
        const fromYear = parseInt(activePeriod.from_date.substring(0, 4))
        const toYear = parseInt(activePeriod.to_date.substring(0, 4))
        let fromMonth
        let toMonth
        const months = []
        if (year === fromYear && year === toYear) {
            fromMonth = parseInt(activePeriod.from_date.substring(5, 7))
            toMonth = parseInt(activePeriod.to_date.substring(5, 7))
        } else if (year === fromYear) {
            fromMonth = parseInt(activePeriod.from_date.substring(5, 7))
            toMonth = 12
        } else {
            fromMonth = 1
            toMonth = parseInt(activePeriod.to_date.substring(5, 7))
        }
        for (let i = fromMonth; i <= toMonth; i++) {
            const monthName = monthToStr(i)
            months.push({ value: i, name: monthName })
        }
        !periodMonth && setPeriodMonth(fromMonth)
        setMonthLimits(months)
    }

    const savePeriod = async () => {
        const response = await axiosPost(API_ROUTES.purchasesDir.sub.period, { month: periodMonth, year: periodYear })
        if (!response.error) {
            newActivity(`Se ha creado el periodo ${monthToStr(periodMonth)} ${periodYear}`)
            setPurchasePeriod(response.data)
        } else {
            setConfirmedPeriod(false)
            newAlert("danger", "Hubo un error al cargar el periodo", response.errorMsg)
        }
    }

    const getPeriod = async () => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.period, [{ month: periodMonth }, { year: periodYear }])
        if (!response.error) {
            if (response.data.id) {
                setPurchasePeriod(response.data)
            } else {
                await savePeriod()
            }
        } else {
            setConfirmedPeriod(false)
            newAlert("danger", "Hubo un error al cargar el periodo", response.errorMsg)
        }
    }

    useEffect(() => {
        confirmedPeriod && getPeriod()
        // eslint-disable-next-line
    }, [confirmedPeriod])

    useEffect(() => {
        getMonthLimits(parseInt(periodYear))
        // eslint-disable-next-line
    }, [periodYear])

    useEffect(() => {
        getYearsLimits()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setIsLoading(loadingActions)
        // eslint-disable-next-line
    }, [])

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
                                            {monthLimits.map((month, index) => <option key={index} value={month.value}>{month.name}</option>)}
                                        </Input>
                                        <InputGroupAddon addonType="append">
                                            <Input type="select" onChange={e => setPeriodYear(e.target.value)} value={periodYear} disabled={confirmedPeriod}>
                                                {yearsLimits.map((year, index) => <option key={index} value={year}>{year}</option>)}
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