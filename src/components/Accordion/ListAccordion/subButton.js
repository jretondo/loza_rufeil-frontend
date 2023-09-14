import React, { useState } from 'react';
import { Button, Col, Row, Tooltip } from 'reactstrap';

const SubButtonAccordion = ({ id, name, level, setActiveId, open, hasSub, bgColor, openNewForm, openUpdate }) => {
    const [openedButton, setOpenedButton] = useState("")
    const [plusToolTip, setPlusToolTip] = useState(false)
    const [trashToolTip, setTrashToolTip] = useState(false)
    const [openButtonToolTip, setOpenButtonToolTip] = useState(false)
    const [modifyButtonToolTip, setModifyButtonToolTip] = useState(false)

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

    const deleteAccount = () => {

    }

    return (<> <Row>
        <Col md={level}>
        </Col>
        <Col md={12 - level} className="px-3 py-0" style={{ border: "3px solid #073863", backgroundColor: `${bgColor}` }}>
            <Row>
                <Col md={8}>
                    <Row>
                        <Col>
                            <h3 className="mt-2 mx-3" style={{ color: "#073863", fontWeight: "bold" }}>{name}</h3>
                        </Col>
                    </Row>
                </Col>
                <Col md="4" className="text-right">
                    <Button disabled={level === 4} color="primary" id={`plusButton-${id}`} className="sm-button px-3 my-1 py-2" onClick={openNewForm}>
                        <i className="sm-button fa fa-plus"></i>
                    </Button>
                    {
                        level < 4 &&
                        <Tooltip placement="top" isOpen={plusToolTip} target={`plusButton-${id}`} toggle={() => setPlusToolTip(!plusToolTip)}>
                            Agregar nueva cuenta
                        </Tooltip>
                    }
                    <Button color="primary" id={`modifyButton-${id}`} className="sm-button px-3 my-1 py-2" onClick={openUpdate}>
                        <i className="sm-button fa fa-edit"></i>
                    </Button>
                    <Tooltip placement="top" isOpen={modifyButtonToolTip} target={`modifyButton-${id}`} toggle={() => setModifyButtonToolTip(!modifyButtonToolTip)}>
                        Modificar
                    </Tooltip>
                    <Button color="primary" id={`trashButton-${id}`} className="sm-button px-3 my-1 py-1">
                        <i className="fa fa-trash"></i>
                    </Button>
                    <Tooltip placement="top" isOpen={trashToolTip} target={`trashButton-${id}`} toggle={() => setTrashToolTip(!trashToolTip)}>
                        Eliminar cuenta y sub cuentas
                    </Tooltip>
                    <Button disabled={!hasSub} color="primary" onClick={toggleButton} id={`openButton-${id}`} className={`px-3 py-2 sm-animated-button${openedButton}`}>
                        <i className={"fa fa-caret-left"} style={{ position: "relative" }}></i>
                    </Button>
                    {
                        hasSub && <>

                            <Tooltip placement="top" isOpen={openButtonToolTip} target={`openButton-${id}`} toggle={() => setOpenButtonToolTip(!openButtonToolTip)}>
                                {openedButton === "-close" ? "Ver sub cuentas" : "Cerrar"}
                            </Tooltip>
                        </>
                    }
                </Col>
            </Row>
        </Col>
    </Row></>)
}

export default SubButtonAccordion