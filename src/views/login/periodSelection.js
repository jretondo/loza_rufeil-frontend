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
import AlertsContext from "context/alerts";

const PeriodSelection = () => {
  const activeClient = JSON.parse(localStorage.getItem("activeClient"))
  const [done, setDone] = useState(false)
  const [activePeriod, setActivePeriod] = useState()
  const [activeButton, setActiveButton] = useState(true)
  const [periodsList, setPeriodList] = useState([])
  const [newPeriod, setNewPeriod] = useState(false)
  const [fromDate, setFromDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"))

  const { newAlert, newActivity } = useContext(AlertsContext)
  const { axiosGetQuery, axiosPost } = useContext(ActionsBackend)
  const { setIsLoading } = useContext(LoadingContext)

  const init = async () => {
    activePeriod && localStorage.setItem("activePeriod", JSON.stringify(activePeriod))
    const error = await getClientToken()
    if (error) {
      newAlert("danger", "Hubo un error!")
    } else {
      setDone(true)
    }
  }

  const getPeriods = async () => {
    setIsLoading(true)
    const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.period, [{ clientId: activeClient.id }])
    if (!response.error) {
      response.data.length > 0 && setActivePeriod(response.data[0])
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
      newActivity(`El usuario agregó un nuevo ejercicio contable. Cliente: ${clientData.business_name} (${clientData.document_number}) Ejercicio: ${moment(fromDate).format("DD/MM/YYYY")} - ${moment(toDate).format("DD/MM/YYYY")}`)
      newAlert("success", "Cargado con éxito!", "")
      getPeriods()
      setNewPeriod(false)
    } else {
      newAlert("danger", "Hubo un error!", "Error: " + response.errorMsg)
    }
    setIsLoading(false)
  }

  const getClientToken = async () => {
    if (activePeriod) {
      setIsLoading(true)
      const response = await axiosGetQuery(API_ROUTES.clientsDir.sub.token, [{ clientId: activeClient.id }, { periodId: activePeriod.id }])
      setIsLoading(false)
      if (!response.error) {
        localStorage.setItem("client-token", JSON.stringify(response.data.token).replace(/['"]+/g, '').trim())
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  useEffect(() => {
    if (!activePeriod && !localStorage.getItem("admin")) {
      setActiveButton(false)
    } else {
      setActiveButton(true)
    }
  }, [activePeriod])

  useEffect(() => {
    getPeriods()
    // eslint-disable-next-line
  }, [])

  if (done) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + "/admin/dashboard"}
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
                        }} type="date" required max={toDate} />
                      </Col>
                      <Col md="6">
                        <Label>Hasta</Label>
                        <Input value={toDate} onChange={e => {
                          setToDate(e.target.value)
                        }} type="date" required min={fromDate} />
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
                      <Input type="select" value={JSON.stringify(activePeriod)} onChange={e => setActivePeriod(JSON.parse(e.target.value))}>
                        {
                          periodsList.length > 0 ? periodsList.map((item, key) => {

                            return (<option key={key} value={JSON.stringify(item)}>{`${moment(item.from_date).format("DD/MM/YYYY")} - ${moment(item.to_date).format("DD/MM/YYYY")}`}</option>)
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
