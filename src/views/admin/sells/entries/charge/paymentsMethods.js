import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import roundNumber from 'function/roundNumber';
import React from 'react';
import { Button, Col, Input, Row } from 'reactstrap';

const ReceiptPaymentsTable = ({
    paymentsArray,
    setPaymentsArray,
    accountsList,
    accountSearchFn,
    hasAccountingModule
}) => {
    const tableTitles = hasAccountingModule ? ["Tipo de pago (Efvo, chq, etc)", "Cuenta Asdociada", "Importe", ""] : ["Tipo de pago (Efvo, chq, etc)", "Importe", ""]

    const handleClick = (key) => {
        const newPaymentArray = paymentsArray.map((payment, index) => {
            if (index === key) {
                payment.change = !payment.change
            }
            return payment
        })

        setPaymentsArray(newPaymentArray)
    }

    return (<>
        <Row>
            <Col md="12" >
                <TableList titlesArray={tableTitles}>
                    {paymentsArray && paymentsArray.map((payment, key) => {
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
                            {
                                hasAccountingModule &&
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
                                                    item.account_chart_id = account.id
                                                }
                                                return item
                                            })
                                            setPaymentsArray(newOtherArray)
                                        }}
                                        searchFn={accountSearchFn}
                                    />
                                </td>
                            }

                            <td className='text-center'>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    onFocus={(e) => {
                                        e.target.select()
                                    }}
                                    value={payment.amount} onChange={e => {
                                        const newPaymentArray = paymentsArray.map((item) => {
                                            if (item.id === payment.id) {
                                                item.amount = roundNumber(e.target.value)
                                            }
                                            return item
                                        })
                                        setPaymentsArray(newPaymentArray)
                                    }} />
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
                                    <i className="fas fa-trash-alt"></i>
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
                                        change: true,
                                        amount: 0
                                    }])
                                }}
                            >
                                <i className="fas fa-plus"></i>
                            </Button>
                        </td>
                        <td></td><td></td>
                        {
                            hasAccountingModule && <td></td>
                        }
                    </tr>
                </TableList>
            </Col>
        </Row>
    </>)
}

export default ReceiptPaymentsTable