import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Tooltip } from 'reactstrap';

const SubButtonAccordion = ({ id, name, level, toggle }) => {
    const [openedButton, setOpenedButton] = useState("")
    const [plusToolTip, setPlusToolTip] = useState(false)
    const [trashToolTip, setTrashToolTip] = useState(false)
    const [openButtonToolTip, setOpenButtonToolTip] = useState(false)
    const toggleButton = () => {
        openedButton === "" && setOpenedButton("-open")
        openedButton === "-open" && setOpenedButton("-close")
        openedButton === "-close" && setOpenedButton("-open")
    }

    return (<> <Row>
        <Col md={level}>
        </Col>
        <Col md={12 - level} className="px-3 py-0" style={{ border: "3px solid #073863", backgroundColor: "#ff9c9c" }}>
            <Row>
                <Col md="10">
                    <Row>
                        <Col>
                            <h2 className="mt-2 mx-3" style={{ color: "#073863", fontWeight: "bold" }}>{name}</h2>
                        </Col>
                        <Col>
                            <Button color="primary" id={`plusButton-${id}`} className="sm-button px-3 my-2 py-2">
                                <i className="sm-button fa fa-plus"></i>
                            </Button>
                            <Tooltip placement="top" isOpen={plusToolTip} target={`plusButton-${id}`} toggle={() => setPlusToolTip(!plusToolTip)}>
                                Agregar nueva cuenta
                            </Tooltip>
                            <Button color="primary" id={`trashButton-${id}`} className="sm-button px-3 my-2 py-1">
                                <i className="fa fa-trash"></i>
                            </Button>
                            <Tooltip placement="right" isOpen={trashToolTip} target={`trashButton-${id}`} toggle={() => setTrashToolTip(!trashToolTip)}>
                                Eliminar cuenta y sub cuentas
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
                <Col md="2" className="text-right">
                    <Button color="primary" onClick={toggleButton} id={`openButton-${id}`} className={`px-3 py-2 mt-2 sm-animated-button${openedButton}`}>
                        <i className={"fa fa-caret-left"} style={{ position: "relative" }}></i>
                    </Button>
                    <Tooltip placement="top" isOpen={openButtonToolTip} target={`openButton-${id}`} toggle={() => setOpenButtonToolTip(!openButtonToolTip)}>
                        {openedButton === "-close" ? "Ver sub cuentas" : "Cerrar"}
                    </Tooltip>
                </Col>
            </Row>
        </Col>
    </Row></>)
}

export default SubButtonAccordion