import API_ROUTES from '../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import React, { useContext, useEffect, useState } from 'react';
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ImportAccounts = ({ isOpen, toggle, setIsLoading }) => {
    const [clientSelected, setClientSelected] = useState(false)
    const [clientList, setClientList] = useState([])
    const [periodList, setPeriodList] = useState([])

    const { axiosGetQuery, loadingActions, axiosPost } = useContext(ActionsBackend)
    const { newAlert, newActivity } = useContext(AlertsContext)

    const getClients = async () => {
        const response = await axiosGetQuery(API_ROUTES.clientsDir.clients, [])
        if (!response.error) {
            setClientList(response.data)
        } else {
            newAlert("error", "Hubo un error!", "Error: " + response.errorMsg)
        }
    }

    const getPeriods = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.period, [{ clientId: clientSelected.id }])
        if (!response.error) {
            setPeriodList(response.data)
        } else {
            newAlert("error", "Hubo un error!", "Error: " + response.errorMsg)
        }
    }

    useEffect(() => {
        //setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    useEffect(() => {
        //getPeriods()
        // eslint-disable-next-line
    }, [clientSelected])

    useEffect(() => {
        isOpen && getClients()
        // eslint-disable-next-line
    }, [isOpen])

    return (<>
        <Modal size="md" isOpen={isOpen} toggle={toggle}>
            <ModalHeader>
                Importar Plan de Cuentas
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label>Cliente:</Label>
                    <Input type="select" value={JSON.stringify(clientSelected)} onChange={e => { setClientSelected(JSON.parse(e.target.value)) }}>
                        {clientList.length > 0 && clientList.map((client, key) => {
                            if (key === 0) {
                                setClientSelected(client)
                            }
                            return (<option value={JSON.stringify(client)} key={key}>{client.business_name.slice(0, 35)} ({client.document_number})</option>)
                        })}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label>Ejercicio:</Label>
                    <Input type="select">

                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
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