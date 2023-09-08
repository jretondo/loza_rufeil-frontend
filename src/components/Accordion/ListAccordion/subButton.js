import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Tooltip } from 'reactstrap';

const SubButtonAccordion = ({ id, name }) => {
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
        <Col md="1">
        </Col>
        <Col md="11" className="px-3 py-2" style={{ border: "3px solid #073863", backgroundColor: "#ff9c9c" }}>
            <Row>
                <Col md="6">
                    <Row>
                        <h2 className="mt-2 mx-3" style={{ color: "#073863", fontWeight: "bold" }}>{name}</h2>
                        <Button color="primary" id="plusButton" className="p-0 px-3 mx-1">
                            <i className="fa fa-plus"></i>
                        </Button>
                        <Tooltip placement="top" isOpen={plusToolTip} target="plusButton" toggle={() => setPlusToolTip(!plusToolTip)}>
                            Agregar nueva cuenta
                        </Tooltip>
                        <Button color="primary" id="trashButton" className="p-0 px-3 mx-1">
                            <i className="fa fa-trash"></i>
                        </Button>
                        <Tooltip placement="right" isOpen={trashToolTip} target="trashButton" toggle={() => setTrashToolTip(!trashToolTip)}>
                            Eliminar cuenta y sub cuentas
                        </Tooltip>
                    </Row>
                </Col>
                <Col md="6" className="text-right">
                    <Button color="primary" onClick={toggleButton} id="openButton" className={`animated-button${openedButton}`}>
                        <i className={"fa fa-caret-left"} style={{ position: "relative" }}></i>
                    </Button>
                    <Tooltip placement="top" isOpen={openButtonToolTip} target="openButton" toggle={() => setOpenButtonToolTip(!openButtonToolTip)}>
                        {openedButton === "-close" ? "Ver sub cuentas" : "Cerrar"}
                    </Tooltip>
                </Col>
            </Row>
        </Col>
    </Row></>)
}

export default SubButtonAccordion