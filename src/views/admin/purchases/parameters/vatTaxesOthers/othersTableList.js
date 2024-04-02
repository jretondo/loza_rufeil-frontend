import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import React from 'react';
import { Button, Col } from 'reactstrap';

const OthersTableList = ({ othersArray, setOthersArray, accountsList, accountSearchFn, hasAccountingModule }) => {

    const changeOtherStatus = (currentType) => {
        const newOtherArray = othersArray.map((other) => {
            if (other.type === currentType) {
                other.active = !other.active
            }
            return other
        })
        setOthersArray(newOtherArray)
    }

    return (<Col md="8">
        <h4 className="text-center">Otros Items</h4>
        <TableList titlesArray={hasAccountingModule() ? ["Tipo de Item", "Ver en pantalla", "Cuenta Asociada"] : ["Tipo de Item", "Ver en pantalla"]}>
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
                        {
                            (hasAccountingModule() && other.is_tax) &&
                            <td>
                                {<InputSearch
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
                                />}
                            </td>
                        }
                    </tr>
                )
            })}
        </TableList>
    </Col>)
}

export default OthersTableList;