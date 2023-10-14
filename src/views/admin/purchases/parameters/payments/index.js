import API_ROUTES from '../../../../../api/routes';
import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import LoadingContext from 'context/loading';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import swal from 'sweetalert';

const PaymentMethods = ({ accountsList, accountSearchFn }) => {
    const [paymentsArray, setPaymentsArray] = useState([])
    const { axiosGetQuery, axiosPost, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)
    const { newAlert } = useContext(AlertsContext)

    const getPaymentsMethods = async () => {
        const response = await axiosGetQuery(API_ROUTES.purchasesDir.sub.paymentsMethods, [])
        if (!response.error) {
            const arrayData = response.data.length > 0 && response.data.map((payment, key) => {
                payment.id = key
                return payment
            })
            setPaymentsArray(arrayData)
        } else {
            newAlert("danger", "Error al cargar los métodos de pago", response.errorMsg)
        }
    }

    const savePaymentsMethods = async () => {
        const response = await axiosPost(API_ROUTES.purchasesDir.sub.paymentsMethods, { params: paymentsArray })
        if (!response.error) {
            newAlert("success", "Métodos de pago actualizados", "")
        } else {
            newAlert("danger", "Error al cargar los métodos de pago", response.errorMsg)
        }
    }

    const changeStatus = async (key) => {
        const newPaymentArray = paymentsArray.map((payment, index) => {
            if (index === key) {
                payment.active = !payment.active
            }
            return payment
        })

        setPaymentsArray(newPaymentArray)
    }

    const handleClick = (key) => {
        const newPaymentArray = paymentsArray.map((payment, index) => {
            if (index === key) {
                payment.change = !payment.change
            }
            return payment
        })

        setPaymentsArray(newPaymentArray)
    }

    useEffect(() => {
        getPaymentsMethods()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    return (<Row>
        <Col md="12">
            <TableList titlesArray={["Tipo de pago (Efvo, chq, etc)", "Cuenta Asdociada", "Visible", ""]}>
                {paymentsArray.map((payment, key) => {
                    return (<tr key={payment.id}>
                        <td className='text-center' onDoubleClick={!payment.change ? () => handleClick(key) : () => { }}>
                            {!payment.change ? payment.name :
                                <Input
                                    value={paymentsArray[key].name}
                                    onChange={(e) => {
                                        const newOtherArray = paymentsArray.map((item) => {
                                            if (item.id === payment.id) {
                                                item.name = e.target.value
                                            }
                                            return item
                                        })
                                        setPaymentsArray(newOtherArray)
                                    }}
                                    onKeyUp={(e) => {
                                        if (e.keyCode === 13 || e.keyCode === 27) {
                                            handleClick(key)
                                        }
                                    }}
                                    onBlur={() => {
                                        handleClick(key)
                                    }}
                                />}
                        </td>
                        <td className='text-center'>
                            <InputSearch
                                itemsList={accountsList}
                                itemSelected={paymentsArray[key] ? paymentsArray[key].AccountChart : false}
                                title={""}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                setItemSelected={(account) => {
                                    const newOtherArray = paymentsArray.map((item) => {
                                        if (item.id === payment.id) {
                                            item.AccountChart = account
                                        }
                                        return item
                                    })
                                    setPaymentsArray(newOtherArray)
                                }}
                                searchFn={accountSearchFn}
                            />
                        </td>
                        <td className='text-center'>
                            <Button
                                className="py-1"
                                color={payment.active ? "success" : "gray"}
                                onClick={() => {
                                    changeStatus(key)
                                }}
                            >
                                {payment.active ? "Si" : "No"}
                            </Button>
                        </td>
                        <td className='text-center'>
                            <Button className="py-0 px-3" color="danger"
                                style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                                onClick={e => {
                                    e.preventDefault()
                                    setPaymentsArray((paymentsArray) => {
                                        return paymentsArray.filter((item) => item.id !== payment.id)
                                    })
                                }}
                            >
                                -
                            </Button>
                        </td>
                    </tr>)
                })}
                <tr>
                    <td className='text-center'>
                        <Button className="py-0 px-2" color="primary"
                            style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                            onClick={e => {
                                e.preventDefault()
                                setPaymentsArray([...paymentsArray,
                                {
                                    id: paymentsArray.length,
                                    name: "",
                                    AccountChart: false,
                                    active: false,
                                    change: true
                                }])
                            }}
                        >
                            +
                        </Button>
                    </td>
                    <td></td><td></td><td></td>
                </tr>
            </TableList>
            <Col md="12" className="mt-3 text-center">
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
                                getPaymentsMethods()
                            }
                        })
                    }}
                >
                    Restaurar valores de BD
                </Button>
                <Button
                    onClick={e => {
                        e.preventDefault()
                        savePaymentsMethods()
                    }}
                    color="primary">
                    Aplicar cambios
                </Button>
            </Col>
        </Col>
    </Row>)
}

export default PaymentMethods;