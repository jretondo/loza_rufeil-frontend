import React from 'react';
import { Button } from 'reactstrap';

const ReceiptRow = ({
    receipt,
    first,
    page,
    setReceiptInfo,
    setIsOpenReceiptForm
}) => {
    return (<>
        <tr>
            <td>{receipt.date}</td>
            <td>{receipt.number}</td>
            <td>{receipt.provider.name}</td>
            <td>{receipt.total}</td>
            <td>
                <Button
                    color="primary"
                    onClick={() => {
                        setReceiptInfo(receipt)
                        setIsOpenReceiptForm(true)
                    }}
                >
                    Editar
                </Button>
            </td>
        </tr>
    </>)
}

export default ReceiptRow