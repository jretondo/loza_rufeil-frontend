import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Tooltip } from 'reactstrap';
import './accordion.css';
const PrincipalButtonAccordion = ({ id, name, toggle }) => {
    const [openedButton, setOpenedButton] = useState("")
    const [plusToolTip, setPlusToolTip] = useState(false)
    const [openButtonToolTip, setOpenButtonToolTip] = useState(false)
    const toggleButton = () => {
        openedButton === "" && setOpenedButton("-open")
        openedButton === "-open" && setOpenedButton("-close")
        openedButton === "-close" && setOpenedButton("-open")
    }

    useEffect(() => {
        openedButton === "-open" && toggle()
        openedButton === "-close" && toggle()
    }, [openedButton, toggle])

    return (<>
        <Row>
            <Col md="12" className="py-2 px-3" style={{ border: "5px solid #073863", backgroundColor: "#e6e6e6" }}>
                <Row>
                    <Col md="6">
                        <Row>
                            <h2 className="mt-2 mx-3" style={{ color: "#073863", fontWeight: "bold" }}>{name}</h2>
                            <Button color="primary" id={`plusButton-${id}`} className="p-0 px-3 mx-1">
                                <i className="fa fa-plus"></i>
                            </Button>
                            <Tooltip placement="right" isOpen={plusToolTip} target={`plusButton-${id}`} toggle={() => setPlusToolTip(!plusToolTip)}>
                                Agregar nueva cuenta
                            </Tooltip>
                        </Row>
                    </Col>
                    <Col md="6" className="text-right">
                        <Button color="primary" onClick={toggleButton} id={`openButton-${id}`} className={`animated-button${openedButton}`}>
                            <i className={"fa fa-caret-left"} style={{ position: "relative" }}></i>
                        </Button>
                        <Tooltip placement="top" isOpen={openButtonToolTip} target={`openButton-${id}`} toggle={() => setOpenButtonToolTip(!openButtonToolTip)}>
                            {openedButton === "-close" ? "Ver sub cuentas" : "Cerrar"}
                        </Tooltip>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>)
}

export default PrincipalButtonAccordion