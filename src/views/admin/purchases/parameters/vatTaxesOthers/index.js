import React, { useContext, useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import { TableList } from "components/Lists/TableList";
import ActionsBackend from "context/actionsBackend";
import LoadingContext from "context/loading";
import API_ROUTES from "../../../../../api/routes";
import AlertsContext from "context/alerts";
import InputSearch from "components/Search/InputSearch";
import swal from "sweetalert";

const VatTaxesOthers = ({ accountsList, accountSearchFn }) => {

    const [vatArray, setVatArray] = useState([])
    const [othersArray, setOthersArray] = useState([])
    const { axiosGetQuery, axiosPost, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)
    const { newAlert } = useContext(AlertsContext)

    const getClientParams = async () => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.params, [])
        if (!response.error) {
            setVatArray(response.data.vat)
            setOthersArray(response.data.others)
        } else {
            newAlert("danger", "Error al cargar los parametros del cliente", response.errorMsg)
        }
    }

    const saveClientParams = async () => {
        const response = await axiosPost(API_ROUTES.purchasesDir.sub.params, { params: { vat: vatArray, others: othersArray } })
        if (!response.error) {
            newAlert("success", "Parametros actualizados", "")
        } else {
            newAlert("danger", "Error al cargar los parametros del cliente", response.errorMsg)
        }
    }

    const changeVatStatus = (currentType) => {
        const newVatArray = vatArray.map((vat) => {
            if (vat.type === currentType) {
                vat.active = !vat.active
            }
            return vat
        })
        setVatArray(newVatArray)
    }

    const changeVatAccount = (account) => {
        const newVatArray = vatArray.map((vat) => {
            vat.AccountChart = account
            return vat
        })
        setVatArray(newVatArray)
    }

    const changeOtherStatus = (currentType) => {
        const newOtherArray = othersArray.map((other) => {
            if (other.type === currentType) {
                other.active = !other.active
            }
            return other
        })
        setOthersArray(newOtherArray)
    }

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    useEffect(() => {
        getClientParams()
        // eslint-disable-next-line
    }, [])

    return (<>
        <Row>
            <Col md="4">
                <h4 className="text-center">IVA</h4>
                <TableList titlesArray={["Alicuota", "Ver en pantalla"]}>
                    {vatArray.map((vat, key) => {
                        return (
                            <tr key={key}>
                                <td className="text-center">{vat.name}</td>
                                <td className="text-center">
                                    <Button
                                        className="py-1"
                                        color={vat.active ? "success" : "gray"}
                                        onClick={() => {
                                            changeVatStatus(vat.type)
                                        }}
                                    >
                                        {vat.active ? "Si" : "No"}
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </TableList>
                <FormGroup>
                    <InputSearch
                        itemsList={accountsList}
                        itemSelected={vatArray[0] ? vatArray[0].AccountChart : false}
                        title={"Cuenta asociada al IVA"}
                        placeholderInput={"Busque una cuenta..."}
                        getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                        setItemSelected={changeVatAccount}
                        searchFn={accountSearchFn}
                    />
                </FormGroup>
            </Col>
            <Col md="8">
                <h4 className="text-center">Otros Items</h4>
                <TableList titlesArray={["Tipo de Item", "Ver en pantalla", "Cuenta Asociada"]}>
                    {othersArray.map((other, key) => {
                        return (
                            <tr key={key}>
                                <td className="text-center">{other.name}</td>
                                <td className="text-center">
                                    <Button
                                        className="py-1"
                                        color={other.active ? "success" : "gray"}
                                        onClick={() => {
                                            changeOtherStatus(other.type)
                                        }}
                                    >
                                        {other.active ? "Si" : "No"}
                                    </Button>
                                </td>
                                <td>
                                    {
                                        other.active ?
                                            <InputSearch
                                                itemsList={accountsList}
                                                itemSelected={othersArray[key] ? othersArray[key].AccountChart : false}
                                                title={""}
                                                placeholderInput={"Busque una cuenta..."}
                                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                                setItemSelected={(account) => {
                                                    const newOtherArray = othersArray.map((item) => {
                                                        if (item.type === other.type) {
                                                            item.AccountChart = account
                                                        }
                                                        return item
                                                    })
                                                    setOthersArray(newOtherArray)
                                                }}
                                                searchFn={accountSearchFn}
                                            />
                                            :
                                            <Input disabled value={other.AccountChart ? `${other.AccountChart.name} (${other.AccountChart.code})` : ""} />
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </TableList>
            </Col>
        </Row>
        <Row className="mt-3">
            <Col md="12" className="text-center">
                <Button
                    color="warning"
                    onClick={e => {
                        e.preventDefault()
                        swal({
                            title: "¿Está seguro?",
                            text: "Se restaurarán los valores de la base de datos y perderá los cambios realizados",
                            icon: "warning",
                            buttons: ["Cancelar", "Aceptar"],
                            dangerMode: true,
                        }).then((willDelete) => {
                            if (willDelete) {
                                getClientParams()
                            }
                        })
                    }}
                >
                    Restaurar valores de BD
                </Button>
                <Button color="primary"
                    onClick={e => { e.preventDefault(); saveClientParams() }}
                >
                    Aplicar cambios
                </Button>
            </Col>
        </Row>
    </>);
}

export default VatTaxesOthers;