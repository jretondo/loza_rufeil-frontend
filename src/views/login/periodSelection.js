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

const PeriodSelection = () => {
  const [done, setDone] = useState(false)
  const [activePeriod, setActivePeriod] = useState()
  const [activeButton, setActiveButton] = useState(true)
  const [periodsList, setPeriodList] = useState([])

  const { axiosGetQuery } = useContext(ActionsBackend)
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
      console.log('response :>> ', response.data);
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
              <Form onSubmit={e => {
                e.preventDefault()
              }}>
                <FormGroup className="mb-3">
                  <Label>Periodos</Label>
                  <Input type="select" >
                    {
                      periodsList.length > 0 ? periodsList.map((item, key) => {
                        return (<option key={key}>{item.name}</option>)
                      }) :
                        <option>No hay periodos disponibles</option>
                    }
                  </Input>
                </FormGroup>
                <div className="text-center">
                  <Button
                    disabled={!activeButton}
                    onClick={async () => {
                      await init()
                      setDone(true)
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
