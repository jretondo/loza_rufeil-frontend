import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import roundNumber from 'function/roundNumber';
import React from 'react';
import { Button, Input } from 'reactstrap';

const ReceiptsConceptsTable = ({
    hasAccountingModule,
    accountsList,
    accountSearchFn,
    receiptConcepts,
    setReceiptConcepts
}) => {

    const handleClick = (key) => {
        const newAccountsArray = receiptConcepts.map((account, index) => {
            if (index === key) {
                account.change = !account.change
            }
            return account
        })
        setReceiptConcepts(newAccountsArray)
    }

    return (<>
        <TableList titlesArray={hasAccountingModule ? ["Descripción", "Cuenta", "Importe", "Grabament", ""] : ["Descripción", "Importe", "Grabament", ""]} >
            {receiptConcepts && receiptConcepts.map((receiptConcept, key) => {
                return (<tr key={key}>
                    <td className='text-center' onDoubleClick={!receiptConcept.change ? () => handleClick(key) : () => { }}>
                        {!receiptConcept.change ? receiptConcept.description :
                            <Input
                                value={receiptConcepts[key].description}
                                onChange={(e) => {
                                    const newOtherArray = receiptConcepts.map((item) => {
                                        if (item.id === receiptConcept.id) {
                                            item.description = e.target.value
                                        }
                                        return item
                                    })
                                    setReceiptConcepts(newOtherArray)
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
                                itemSelected={receiptConcepts[key] ? receiptConcepts[key].AccountChart : false}
                                title={""}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                setItemSelected={(account) => {
                                    const newAccountsArray = receiptConcepts.map((item) => {
                                        if (item.id === receiptConcept.id) {
                                            item.AccountChart = account
                                        }
                                        return item
                                    })
                                    setReceiptConcepts(newAccountsArray)
                                }}
                                searchFn={accountSearchFn}
                            />
                        </td>
                    }
                    <td className='text-center'>
                        <Input
                            min="0.01"
                            step="0.01"
                            type="number"
                            value={receiptConcept.amount}
                            onChange={(e) => {
                                const newAccountsArray = receiptConcepts.map((item) => {
                                    if (item.id === receiptConcept.id) {
                                        item.amount = roundNumber(e.target.value)
                                    }
                                    return item
                                })
                                setReceiptConcepts(newAccountsArray)
                            }}
                        />
                    </td>
                    <td className='text-center' onDoubleClick={!receiptConcept.change ? () => handleClick(key) : () => { }}>
                        <Input
                            type="select"
                            value={receiptConcepts[key].recordType}
                            onChange={(e) => {
                                const newAccountsArray = receiptConcepts.map((item) => {
                                    if (item.id === receiptConcept.id) {
                                        receiptConcept.recordType = parseInt(e.target.value)
                                    }
                                    return item
                                })
                                setReceiptConcepts(newAccountsArray)
                            }}
                        >
                            <option value={0}>Grabado</option>
                            <option value={1}>No Grabado</option>
                            <option value={2}>Op. Exenta</option>
                        </Input>
                    </td>
                    <td>
                        <Button
                            color="danger"
                            onClick={() => {
                                const newAccountsArray = receiptConcepts.filter((account, index) => {
                                    return index !== key
                                })
                                setReceiptConcepts(newAccountsArray)
                            }}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </Button>
                    </td>
                </tr>)
            })}
            <tr>
                <td className='text-center'>
                    <Button
                        color="primary"
                        onClick={() => {
                            setReceiptConcepts([...receiptConcepts, {
                                AccountChart: false,
                                active: true,
                                description: "",
                                change: true,
                                id: receiptConcepts.length,
                                amount: 0,
                                recordType: 0
                            }])
                        }}
                    >
                        <i className="fas fa-plus"></i>
                    </Button>
                </td><td></td><td></td><td></td>
                {
                    hasAccountingModule && <td></td>
                }
            </tr>
        </TableList>
    </>)
}

export default ReceiptsConceptsTable;