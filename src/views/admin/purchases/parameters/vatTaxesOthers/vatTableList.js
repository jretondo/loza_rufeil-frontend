import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import React from 'react';
import { Button, Col, FormGroup } from 'reactstrap';

const VatTableList = ({ vatArray, setVatArray, accountsList, accountSearchFn, hasAccountingModule }) => {

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

    return (
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
            {
                hasAccountingModule() &&
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
            }
        </Col>
    )
}

export default VatTableList;