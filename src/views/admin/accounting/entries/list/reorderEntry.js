import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import ActionsBackend from '../../../../../context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import AlertsContext from '../../../../../context/alerts';

const ReorderEntry = ({
    entry,
    isOpen,
    toggle,
    refreshToggle
}) => {
    const activePeriod = JSON.parse(localStorage.getItem("activePeriod"))

    const [entryDate, setEntryDate] = useState(entry.date)
    const [entryNumber, setEntryNumber] = useState(entry.number)
    const [entryCheck, setEntryCheck] = useState(false)
    const [dateLimits, setDateLimits] = useState({
        min: "",
        max: ""
    })

    const { axiosGet, axiosPut } = useContext(ActionsBackend)
    const { newAlert } = useContext(AlertsContext)

    const checkEntryNumber = async (e) => {
        e.preventDefault()
        const response = await axiosGet(API_ROUTES.accountingDir.sub.reorderCheckEntryNumber, `${activePeriod.id}/${entry.number}/${entryNumber}`)
        if (!response.error) {
            setDateLimits({
                min: response.data.minLimitDate ? response.data.minLimitDate : activePeriod.from_date,
                max: response.data.maxLimitDate ? response.data.maxLimitDate : activePeriod.to_date
            })
            setEntryDate(response.data.minLimitDate ? response.data.minLimitDate : activePeriod.from_date)
            setEntryCheck(true)
        } else {
            setEntryCheck(false)
            newAlert("danger", "Error al cargar las cuentas atribuibles", response.errorMsg)
        }
    }

    const saveReorder = async (e) => {
        e.preventDefault()
        if (!entryCheck) {
            newAlert("danger", "Error", "Debe ingresar un número de asiento válido")
            return
        }
        if (
            entryDate === "" ||
            entryDate === null ||
            entryDate === undefined ||
            entryDate === "Invalid date" ||
            entryDate > dateLimits.max ||
            entryDate < dateLimits.min
        ) {
            newAlert("danger", "Error", `Debe ingresar una fecha válida entre ${dateLimits.min} y ${dateLimits.max}`)
            return
        }
        if (typeof entryNumber !== "number") {
            newAlert("danger", "Error", "El número de asiento debe ser un número entero")
            return
        }
        const data = {
            periodId: activePeriod.id,
            number: entry.number,
            id: entry.id,
            newNumber: entryNumber,
            newDate: entryDate
        }
        const response = await axiosPut(API_ROUTES.accountingDir.sub.reorderEntry, data)
        if (!response.error) {
            newAlert("success", "Asiento reordenado con éxito", "")
            refreshToggle()
            toggle()
        } else {
            newAlert("danger", "Error al reordenar los asientos", response.errorMsg)
        }

    }

    const entryNumberHandler = (e) => {
        setEntryNumber(parseInt(e.target.value))
        entryCheck && setEntryCheck(false)
    }

    useEffect(() => {
        setEntryDate(entry.date)
        setEntryNumber(entry.number)
        setEntryCheck(false)
    }, [isOpen, entry])

    return (
        <>
            <Modal size="sm" toggle={toggle} isOpen={isOpen}>
                <ModalHeader>
                    Reordenar asiento contable Nº: {entry.number}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <Label>Nuevo Nº</Label>
                                <Input
                                    min={1}
                                    type="number"
                                    value={entryNumber}
                                    onChange={entryNumberHandler}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <Button
                                style={{ marginTop: "33px" }}
                                color={entryCheck ? "success" : "secondary"}
                                onClick={checkEntryNumber}
                            >
                                <i className="fas fa-check"></i>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <Label>Nueva Fecha</Label>
                                <Input
                                    min={dateLimits.min}
                                    max={dateLimits.max}
                                    type="date"
                                    disabled={!entryCheck}
                                    value={entryDate}
                                    onChange={(e) => setEntryDate(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        disabled={!entryCheck}
                        onClick={saveReorder}
                    >
                        Aplicar
                    </Button>
                    <Button
                        color="danger"
                        onClick={toggle}
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default ReorderEntry;