import ActionsBackend from 'context/actionsBackend';
import UrlNodeServer from '../../../../api/routes';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import LoadingContext from 'context/loading';

const Header = ({
    userSearch,
    setUserSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    setPage,
    toggleRefresh
}) => {
    const [usersList, setUsersList] = useState([])
    const { axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)

    const getUSers = async () => {
        const response = await axiosGetQuery(UrlNodeServer.usersDir.users, [])
        if (response) {
            setUsersList(response.data.items)
        } else {
            setUsersList([])
        }
    }

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    useEffect(() => {
        getUSers()
        // eslint-disable-next-line
    }, [])
    console.log('usersList :>> ', usersList);
    return (
        <Row>
            <Col md="4">
                <FormGroup>
                    <Label>
                        Usuario
                    </Label>
                    <Input type="select" value={userSearch} onChange={e => setUserSearch(e.target.value)}>
                        <option value={""}>Todos los usuarios</option>
                        {
                            (usersList.length > 0) ?
                                // eslint-disable-next-line
                                usersList.map((item, key) => {
                                    return (
                                        <option key={key} value={item.id} >{`${item.name} ${item.lastname} (usuario: ${item.user})`}</option>
                                    )
                                }) : <></>}
                    </Input>
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup>
                    <Label>
                        Fecha Desde
                    </Label>
                    <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup>
                    <Label>
                        Fecha Hasta
                    </Label>
                    <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </FormGroup>
            </Col>
            <Col md="2">
                <Button color="primary" onClick={() => {
                    setPage(1)
                    toggleRefresh()
                }} style={{ marginTop: "31px" }} >
                    Listar
                </Button>
            </Col>
        </Row>
    )
}

export default Header