import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import roundNumber from 'function/roundNumber';
import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const TaxesEntry = ({
    taxesList,
    setTaxesList,
    hasAccountingModule,
    accountsList,
    accountSearchFn
}) => {
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false)
    const toggleModalAdd = () => setIsOpenModalAdd(!isOpenModalAdd)
    return (<>
        <TableList titlesArray={hasAccountingModule ? ["Tipo", "Cuenta", "Grabado", "Importe", ""] : ["Tipo", "Grabado", "Importe", ""]} >
            {taxesList && taxesList.map((tax, key) => {
                return (tax.active && <tr key={key}>
                    <td>
                        <Input value={tax.name} disabled />
                    </td>
                    {
                        hasAccountingModule &&
                        <td className='text-center'>
                            <InputSearch
                                itemsList={accountsList}
                                itemSelected={taxesList[key] ? taxesList[key].AccountChart : false}
                                title={""}
                                placeholderInput={"Busque una cuenta..."}
                                getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                setItemSelected={(account) => {
                                    const newTaxesArray = taxesList.map((item) => {
                                        if (item.id === tax.id) {
                                            item.AccountChart = account
                                        }
                                        return item
                                    })
                                    setTaxesList(newTaxesArray)
                                }}
                                searchFn={accountSearchFn}
                            />
                        </td>
                    }
                    <td className='text-center'>
                        <Input
                            value={tax.recorded}
                            onChange={(e) => {
                                const newTaxesArray = taxesList.map((item) => {
                                    if (item.id === tax.id) {
                                        tax.recorded = roundNumber(e.target.value)
                                    }
                                    return item
                                })
                                setTaxesList(newTaxesArray)
                            }}
                        />
                    </td>
                    <td className='text-center'>
                        <Input
                            value={tax.amount}
                            onChange={(e) => {
                                const newTaxesArray = taxesList.map((item) => {
                                    if (item.id === tax.id) {
                                        tax.amount = roundNumber(e.target.value)
                                    }
                                    return item
                                })
                                setTaxesList(newTaxesArray)
                            }}
                        />
                    </td>
                    <td>
                        <Button
                            color="danger"
                            onClick={() => {
                                const newTaxesArray = taxesList.map((item) => {
                                    if (item.id === tax.id) {
                                        item.active = !item.active
                                        item.amount = 0
                                        item.recorded = 0
                                    }
                                    return item
                                })
                                setTaxesList(newTaxesArray)
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
                        onClick={toggleModalAdd}
                    >
                        <i className="fas fa-plus"></i>
                    </Button>
                </td><td></td><td></td>
                {
                    hasAccountingModule && <td></td>
                }
            </tr>
        </TableList>
        <Modal size="lg" isOpen={isOpenModalAdd} toggle={toggleModalAdd}>
            <ModalHeader>Impuestos Disponibles</ModalHeader>
            <ModalBody>
                <TableList titlesArray={hasAccountingModule ? ["Tipo", "Cuenta", ""] : ["Tipo", ""]} >
                    {taxesList && taxesList.map((tax, key) => {
                        return (!tax.active && <tr key={key}>
                            <td>
                                <Input value={tax.name} disabled />
                            </td>
                            {
                                hasAccountingModule &&
                                <td className='text-center'>
                                    <InputSearch
                                        itemsList={accountsList}
                                        itemSelected={taxesList[key] ? taxesList[key].AccountChart : false}
                                        title={""}
                                        placeholderInput={"Busque una cuenta..."}
                                        getNameFn={(accountItem) => `${accountItem.name} (${accountItem.code})`}
                                        setItemSelected={(account) => {
                                            const newTaxesArray = taxesList.map((item) => {
                                                if (item.id === tax.id) {
                                                    item.AccountChart = account
                                                }
                                                return item
                                            })
                                            setTaxesList(newTaxesArray)
                                        }}
                                        searchFn={accountSearchFn}
                                    />
                                </td>
                            }
                            <td>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        const newTaxesArray = taxesList.map((item) => {
                                            if (item.id === tax.id) {
                                                item.active = !item.active
                                            }
                                            return item
                                        })
                                        setTaxesList(newTaxesArray)
                                        toggleModalAdd()
                                    }}
                                >
                                    <i className="fas fa-plus"></i>
                                </Button>
                            </td>
                        </tr>)
                    })}
                </TableList>
            </ModalBody>
            <ModalFooter>
                <Button
                    onClick={toggleModalAdd}
                    color="danger"
                >Cerrar</Button>
            </ModalFooter>
        </Modal>
    </>)
}

export default TaxesEntry