import API_ROUTES from '../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import LoadingContext from 'context/loading';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ImportAccounts = ({ isOpen, toggle, refresh }) => {
    const [clientSelected, setClientSelected] = useState(false)
    const [periodSelected, setPeriodSelected] = useState(false)
    const [clientList, setClientList] = useState([])
    const [periodList, setPeriodList] = useState([])

    const { axiosGetQuery, axiosPut, loadingActions } = useContext(ActionsBackend)
    const { newAlert } = useContext(AlertsContext)
    const { setIsLoading } = useContext(LoadingContext)

    const getClients = async () => {
        const response = await axiosGetQuery(API_ROUTES.clientsDir.clients, [])
        if (!response.error) {
            setClientList(response.data)
        } else {
            newAlert("danger", "Hubo un error!", "Error: " + response.errorMsg)
        }
    }

    const getPeriods = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.period, [{ clientId: clientSelected.id }])
        if (!response.error) {
            setPeriodList(response.data)
        } else {
            newAlert("danger", "Hubo un error!", "Error: " + response.errorMsg)
        }
    }

    const importAccountsChart = async () => {
        if (periodSelected && clientSelected) {
            const data = {
                original_period_id: JSON.parse(localStorage.getItem("activePeriod")).id,
                copy_period_id: periodSelected.id
            }
            const response = await axiosPut(API_ROUTES.accountingDir.sub.period, data)
            if (!response.error) {
                newAlert("success", "Cargado con éxito!", "El plan de cuenta fué importado con éxito!")
                refresh()
            } else {
                newAlert("danger", "Hubo un error!", "Error: " + response.errorMsg)
            }
        } else {
            newAlert("danger", "Hubo un error!", "No hay un ejercicio elegido!")
        }
    }

    useEffect(() => {
        clientList.length > 0 && getPeriods()
        // eslint-disable-next-line
    }, [clientSelected])

    useEffect(() => {
        isOpen && getClients()
        // eslint-disable-next-line
    }, [isOpen])

    useEffect(() => {
        clientList.length > 0 && setClientSelected(clientList[0])
        clientList.length === 0 && setClientSelected(false)
    }, [clientList])

    useEffect(() => {
        periodList.length > 0 && setPeriodSelected(periodList[0])
        periodList.length === 0 && setPeriodSelected(false)
    }, [periodList])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    return (<>
        <Modal size="md" isOpen={isOpen} toggle={toggle}>
            <ModalHeader>
                Importar Plan de Cuentas
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Cliente:</Label>
                    <Input type="select" value={JSON.stringify(clientSelected)} onChange={e => { setClientSelected(JSON.parse(e.target.value)) }}>
                        {clientList.length > 0 && clientList.map((client, key) =>
                            <option value={JSON.stringify(client)} key={key}>{client.business_name.slice(0, 35)} ({client.document_number})</option>
                        )}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label>Ejercicio:</Label>
                    <Input type="select" value={JSON.stringify(periodSelected)} onChange={e => { setPeriodSelected(JSON.parse(e.target.value)) }}>
                        {periodList.length > 0 ? periodList.map((period, key) =>
                            <option value={JSON.stringify(period)} key={key}>{moment(period.from_date).format("DD/MM/YYYY")} - {moment(period.to_date).format("DD/MM/YYYY")}</option>) : <option>No posee ejercicios creados</option>
                        }
                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="warning" onClick={e => {
                    e.preventDefault()
                    importAccountsChart()
                }}>
                    Importar
                </Button>
                <Button color="danger" onClick={e => {
                    e.preventDefault()
                    toggle()
                }}>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    </>)
}

export default ImportAccounts