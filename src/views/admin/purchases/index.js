import React, { useContext, useEffect } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../api/routes";
import { Container } from "reactstrap";
import ClientSelectionCard from "components/Cards/ClientSelection";


const PurchasesLayout = ({ children, activeClient, setActiveClient }) => {
    const { setUrlRoute } = useContext(secureContext)

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.purchases)
    }, [setUrlRoute])

    return (
        <>
            <Header />
            <Container className="mt--9" fluid>
                <ClientSelectionCard
                    activeClient={activeClient}
                    setActiveClient={setActiveClient}
                />
                {children}
            </Container>
        </>
    )
}

export default PurchasesLayout;
