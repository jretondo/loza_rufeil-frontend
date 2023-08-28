import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  NavLink,
  Spinner
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import UrlNodeServer from '../../api/routes'
import axios from 'axios'
import alertsContext from 'context/alerts';
import ClientSelectionCard from "components/Cards/ClientSelection";

const ClientSelection = () => {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [activeClient, setActiveClient] = useState()
  const [activeButton, setActiveButton] = useState(true)

  const { newAlert } = useContext(alertsContext)

  useEffect(() => {
    if (!activeClient && !localStorage.getItem("admin")) {
      setActiveButton(false)
    }
  }, [activeClient])

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
                <span style={{ fontWeight: "bold" }}>Seleccione Empresa:</span>
              </div>
              {
                loading ?
                  <Col md="12" style={{ textAlign: "center" }}>
                    <Spinner color="primary" style={{ width: "250px", height: "250px" }} />
                  </Col> :
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
                        onClick={() => setDone(true)}
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
