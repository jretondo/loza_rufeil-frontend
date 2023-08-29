import React, { useContext, useEffect } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../api/routes";
import { Container } from "reactstrap";


const PurchasesLayout = ({ children }) => {
    const { setUrlRoute } = useContext(secureContext)

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.purchases)
    }, [setUrlRoute])

    return (
        <>
            <Header />
            <Container className="mt--9" fluid>
                {children}
            </Container>
        </>
    )
}

export default PurchasesLayout;
