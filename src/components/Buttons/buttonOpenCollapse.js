import React from 'react';
import { Button } from 'reactstrap';

const ButtonOpenCollapse = ({
    action,
    tittle,
    active,
}) => {

    return (
        <Button
            color={active ? "primary" : "gray"}
            style={{ width: "100%", height: "50px", paddingInline: "60px" }}
            onClick={() => action()}
            disabled={active}
        >
            {tittle}
        </Button>
    )
}

export default ButtonOpenCollapse