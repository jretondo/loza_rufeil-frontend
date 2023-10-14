import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import alertsContext from 'context/alerts';
import actionsBackend from 'context/actionsBackend';
import TabUserPermission from './tabUserPermissions';
import apiRoutes from '../../../../api/routes'

const ClientPermissions = ({
    setPermissionsBool,
    clientSelected,
    setIsLoading,
    permissionsBool

}) => {
    const [permissionsList, setPermissionsList] = useState([])
    const { newAlert, newActivity } = useContext(alertsContext)
    const { axiosGetQuery, axiosPost, loadingActions } = useContext(actionsBackend)

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    const getPermissions = async () => {
        const response = await axiosGetQuery(apiRoutes.modulesDir.sub.all, [{ clientId: clientSelected.id }])
        if (!response.error) {
            setPermissionsList(response.data)
        } else {
            newAlert("danger", "Hubo un problema!", "Hubo un error al querer traer los permisos y los clientes. Controle que haya clientes cargados.")
        }
    }

    const postNewPermissions = async () => {
        const dataPost = {
            permissions: permissionsList,
            clientId: clientSelected.id
        }
        const response = await axiosPost(apiRoutes.clientsDir.sub.permissions, dataPost)
        if (!response.error) {
            newActivity(`El administrador le concedió nuevos permisos al usuario ${clientSelected.businessName} (id: ${clientSelected.id})`)
            newAlert("success", "Registrado con éxito!", "Fueron concedido los nuevos permisos.")

            localStorage.setItem("modules", JSON.stringify(response.data))
            const clientId = JSON.parse(localStorage.getItem("activeClient")).id

            if (clientId === response.data[0].client_id) {
                setTimeout(() => {
                    document.location.reload()
                }, 750);
            }
            setPermissionsBool(false)
        } else {
            newAlert("danger", "Hubo un problema!", "No se puedieron actualizar los permisos. intente nuevamente. Si persiste llamar a soporte.")
        }
    }

    useEffect(() => {
        getPermissions()
        // eslint-disable-next-line
    }, [permissionsBool, clientSelected])

    return (
        <Card>
            <CardHeader>
                <Row>
                    <Col md="10">
                        <h2>{`Permisos en modulos para el usuario ${clientSelected.businessName}`}</h2>
                    </Col>
                    <Col md="2" style={{ textAlign: "right" }}>
                        <button
                            className="btn btn-danger"
                            onClick={e => {
                                e.preventDefault();
                                setPermissionsBool(false);
                            }}
                        >X</button>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <Container>
                    <div className='pb-5'>
                        <TabUserPermission
                            permissionsList={permissionsList}
                            setPermissionsList={setPermissionsList}
                        />
                    </div>
                </Container>
                <Container>
                    <Row>
                        <Col md="12" style={{ textAlign: "center" }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: "200px", margin: "25px" }}
                                onClick={e => {
                                    e.preventDefault()
                                    postNewPermissions()
                                }}
                            >
                                Confirmar Permisos
                            </button>
                            <button
                                className="btn btn-danger"
                                style={{ width: "200px", margin: "25px" }}
                                onClick={e => {
                                    e.preventDefault()
                                    setPermissionsBool(false)
                                }}
                            >
                                Cancelar
                            </button>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    )
}

export default ClientPermissions