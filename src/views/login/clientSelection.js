import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Row,
  Col,
  NavLink
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import ClientSelectionCard from "components/Cards/ClientSelection";
import ActionsBackend from "context/actionsBackend";
import API_ROUTES from '../../api/routes';
import LoadingContext from "context/loading";

const ClientSelection = () => {
  const [done, setDone] = useState(false)
  const [activeClient, setActiveClient] = useState(false)
  const [activeButton, setActiveButton] = useState(true)

  const { axiosGetQuery } = useContext(ActionsBackend)
  const { setIsLoading } = useContext(LoadingContext)

  useEffect(() => {
    localStorage.removeItem("activeClient")
    localStorage.removeItem("activePeriod")
    if (!activeClient && !localStorage.getItem("admin")) {
      setActiveButton(false)
    } else {
      setActiveButton(true)
    }
  }, [activeClient])

  const init = async () => {
    if (activeClient) {
      setIsLoading(true)
      localStorage.setItem("activeClient", JSON.stringify(activeClient))
      const response = await axiosGetQuery(API_ROUTES.usersDir.sub.modules, [{ clientId: activeClient.id }])
      setIsLoading(false)
      if (!response.error) {
        localStorage.setItem("modules", JSON.stringify(response.data))
      }
    }
  }
  if (done) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + (activeClient ? "/auth/select-period" : "/admin/dashboard")}
      />
    )
  } else {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5">
              <div className="text-center text-muted mb-4">
                <span style={{ fontWeight: "bold" }}>Seleccione Empresa:</span>
              </div>
              <Form onSubmit={e => {
                e.preventDefault()
              }}>
                <FormGroup className="mb-3">
                  <ClientSelectionCard
                    activeClient={activeClient}
                    setActiveClient={setActiveClient}
                  />
                </FormGroup>

                <div className="text-center">
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
                to={process.env.PUBLIC_URL + "/auth/login"}
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

export default ClientSelection;
