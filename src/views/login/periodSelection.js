import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Row,
  Col,
  NavLink,
  Label,
  Input
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import ActionsBackend from "context/actionsBackend";
import API_ROUTES from '../../api/routes';
import LoadingContext from "context/loading";
import moment from "moment-timezone";

const PeriodSelection = () => {
  const [done, setDone] = useState(false)
  const [activePeriod, setActivePeriod] = useState()
  const [activeButton, setActiveButton] = useState(true)
  const [periodsList, setPeriodList] = useState([])
  const [newPeriod, setNewPeriod] = useState(false)
  const [fromDate, setFromDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"))

  const { axiosGetQuery, axiosPost } = useContext(ActionsBackend)
  const { setIsLoading } = useContext(LoadingContext)

  useEffect(() => {
    if (!activePeriod && !localStorage.getItem("admin")) {
      setActiveButton(false)
    } else {
      setActiveButton(true)
    }
  }, [activePeriod])

  const init = async () => {
    localStorage.setItem("activePeriod", JSON.stringify(activePeriod))
  }

  const getPeriods = async () => {
    setIsLoading(true)
    const clientData = JSON.parse(localStorage.getItem("activeClient"))
    const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.period, [{ clientId: clientData.id }])
    if (!response.error) {
      setPeriodList(response.data)
    }
    setIsLoading(false)
  }

  const handleNewPeriod = async () => {
    setIsLoading(true)
    const clientData = JSON.parse(localStorage.getItem("activeClient"))
    const data = {
      fromDate,
      toDate,
      clientId: clientData.id
    }
    const response = await axiosPost(API_ROUTES.accountingDir.sub.period, data)
    if (!response.error) {
      getPeriods()
      console.log('response :>> ', response.data);
    } else {
      console.log('response :>> ', response);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getPeriods()
    // eslint-disable-next-line
  }, [])

  if (done) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + "/auth/dashboard"}
      />
    )
  } else {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5">
              <div className="text-center text-muted mb-4">
                <span style={{ fontWeight: "bold" }}>Seleccione Ejercicio:</span>
              </div>
              {
                newPeriod ?
                  <Form onSubmit={e => {
                    e.preventDefault()
                    handleNewPeriod()
                  }}>
                    <Row>
                      <Col md="6">
                        <Label>Desde</Label>
                        <Input value={fromDate} onChange={e => {
                          setFromDate(e.target.value)
                        }} type="date" required />
                      </Col>
                      <Col md="6">
                        <Label>Hasta</Label>
                        <Input value={toDate} onChange={e => {
                          setToDate(e.target.value)
                        }} type="date" required />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="12" className="text-center">
                        <Button color="warning"
                          onClick={e => {
                            setNewPeriod(false)
                          }}
                        >Cancelar</Button>
                        <Button
                          type="submit"
                          color="primary">Agregar</Button>
                      </Col>
                    </Row>
                  </Form> :
                  <Form onSubmit={e => {
                    e.preventDefault()
                  }}>
                    <FormGroup className="mb-3">
                      <Label>Periodos</Label>
                      <Input type="select" >
                        {
                          periodsList.length > 0 ? periodsList.map((item, key) => {
                            return (<option key={key}>{`${moment(item.from_date).tz('America/Buenos_Aires').format("DD/MM/YYYY")} - ${moment(item.to_date).format("DD/MM/YYYY")}`}</option>)
                          }) :
                            <option>No hay periodos disponibles</option>
                        }
                      </Input>
                    </FormGroup>
                    <div className="text-center">
                      <Button
                        onClick={async () => {
                          setNewPeriod(true)
                        }}
                        style={{ marginTop: "3em" }} color="secondary" type="submit">
                        Nuevo Ejercicio
                      </Button>
                      <Button
                        disabled={!activeButton}
                        onClick={async () => {
                          await init()
                          setDone(true)
                        }}
                        style={{ marginTop: "3em" }} color="primary" type="submit">
                        Ingresar
                      </Button>
                    </div>
                  </Form>
              }
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <NavLink
                className="text-light"
                to={process.env.PUBLIC_URL + "/auth/select-client"}
                tag={Link}
              >
                <small>Volver</small>
              </NavLink>
            </Col>
            <Col className="text-right" xs="6">
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default PeriodSelection;
