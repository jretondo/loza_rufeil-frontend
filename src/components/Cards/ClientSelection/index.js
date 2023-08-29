import React, { useContext, useEffect, useState } from 'react';
import { Input } from "reactstrap";
import ActionsBackend from "context/actionsBackend";
import AlertsContext from "context/alerts";
import apiRoutes from "../../../api/routes";
import LoadingContext from 'context/loading';

const ClientSelectionCard = ({ activeClient, setActiveClient }) => {
    const [clientsList, setClientsList] = useState([])

    const { newAlert } = useContext(AlertsContext)
    const { axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)

    const getClientsList = async () => {
        const response = await axiosGetQuery(apiRoutes.clientsDir.clients, [])
        if (!response.error) {
            setClientsList(response.data)
        } else {
            newAlert("danger", "Hubo un error!", "Puede que aún no haya clientes cargados en la base de datos!")
        }
    }

    const changeClient = (client) => {
        setActiveClient(JSON.parse(client))
    }

    useEffect(() => {
        getClientsList()
        // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    return (
        <Input type="select" value={JSON.stringify(activeClient)} onChange={e => changeClient(e.target.value)}>
            {
                clientsList.length > 0 ? clientsList.map((client, key) => {
                    !activeClient && changeClient(JSON.stringify(client))
                    return <option value={JSON.stringify(client)} key={key}>{client.business_name} (CUIT: {client.document_number})</option>
                }) : <option>No tiene permisos a ninguna empresa</option>
            }
        </Input>
    )
}

export default ClientSelectionCard