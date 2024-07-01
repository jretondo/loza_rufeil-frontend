import React, { useContext, useEffect, useState } from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import ActionsBackend from '../../../../../context/actionsBackend';
import AlertsContext from '../../../../../context/alerts';
import API_ROUTES from '../../../../../api/routes';
import { numberFormat } from '../../../../../function/numberFormat';


const PurchasePeriodSummary = ({
    purchasePeriod,
    refreshList,
    totalInvoice
}) => {
    const [summaryList, setSummaryList] = useState([])

    const { axiosGetQuery } = useContext(ActionsBackend)
    const { newAlert } = useContext(AlertsContext)

    const getPurchaseSummary = async () => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.periodTotal, [{ purchasePeriodId: purchasePeriod.id }])
        if (!response.error) {
            const lista = []
            const objeto = response.data
            for (let clave in objeto) {
                if (objeto.hasOwnProperty(clave)) {
                    lista.push({
                        clave: clave,
                        valor: objeto[clave]
                    });
                }
            }
            setSummaryList(lista)
        } else {
            newAlert("danger", "Error al cargar el resumen", response.errorMsg)
        }
    }

    useEffect(() => {
        getPurchaseSummary()
        // eslint-disable-next-line 
    }, [purchasePeriod, refreshList])

    return (
        <Row>
            {
                summaryList.map((item, index) => {
                    return (item.valor ? (
                        <PurchaseSummaryItem
                            key={index}
                            id={index}
                            title={item.clave}
                            totalStr={item.valor}
                        />) : <div key={index}></div>
                    )
                })
            }
            <Col md="4">
                <FormGroup>
                    <Label>Total de Comprobantes:</Label>
                    <Input disabled value={totalInvoice} />
                </FormGroup>
            </Col>
        </Row>

    )
}

const PurchaseSummaryItem = ({
    id,
    title,
    totalStr
}) => {
    return (
        <Col md={6} key={id}>
            <FormGroup>
                <Label>{title.replace("_", " ")}</Label>
                <Input type="text" value={"$ " + numberFormat(totalStr)} disabled />
            </FormGroup>
        </Col>
    )
}

export default PurchasePeriodSummary;