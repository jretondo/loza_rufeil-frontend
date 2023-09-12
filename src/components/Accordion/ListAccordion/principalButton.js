import React, { useState } from 'react';
import { Button, Col, Row, Tooltip } from 'reactstrap';
import './accordion.css';
const PrincipalButtonAccordion = ({ id, name, setActiveId, open, hasSub, openNewForm }) => {
    const [openedButton, setOpenedButton] = useState("")
    const [plusToolTip, setPlusToolTip] = useState(false)
    const [openButtonToolTip, setOpenButtonToolTip] = useState(false)

    const toggleButton = () => {
        open && setOpenedButton("-close")
        !open && setOpenedButton("-open")
        open && setActiveId((activeIds) => {
            let newArray = []
            // eslint-disable-next-line
            activeIds.map((item) => {
                (item !== id) && newArray.push(item)
            })
            return newArray
        })
        !open && setActiveId((activeIds) => [...activeIds, id])
    }

    return (<>
        <Row>
            <Col md="12" className="py-2 px-3" style={{ border: "5px solid #073863", backgroundColor: "#e6e6e6" }}>
                <Row>
                    <Col md={hasSub ? 6 : 12}>
                        <Row>
                            <h2 className="mt-2 mx-3" style={{ color: "#073863", fontWeight: "bold" }}>{name}</h2>
                            <Button color="primary" id={`plusButton-${id}`} className="p-0 px-3 mx-1" onClick={openNewForm}>
                                <i className="fa fa-plus"></i>
                            </Button>
                            <Tooltip placement="right" isOpen={plusToolTip} target={`plusButton-${id}`} toggle={() => setPlusToolTip(!plusToolTip)}>
                                Agregar nueva cuenta
                            </Tooltip>
                        </Row>
                    </Col>
                    {
                        hasSub && <Col md="6" className="text-right">
                            <Button color="primary" onClick={toggleButton} id={`openButton-${id}`} className={`animated-button${openedButton}`}>
                                <i className={"fa fa-caret-left"} style={{ position: "relative" }}></i>
                            </Button>
                            <Tooltip placement="top" isOpen={openButtonToolTip} target={`openButton-${id}`} toggle={() => setOpenButtonToolTip(!openButtonToolTip)}>
                                {openedButton === "-close" ? "Ver sub cuentas" : "Cerrar"}
                            </Tooltip>
                        </Col>
                    }
                </Row>
            </Col>
        </Row>
    </>)
}

export default PrincipalButtonAccordion