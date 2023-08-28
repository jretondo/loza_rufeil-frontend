import React, { useContext, useEffect } from "react";
import Header from "components/Headers/Header.js";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../api/routes";

const Index = () => {
    const { setUrlRoute } = useContext(secureContext)

    useEffect(() => {
        setUrlRoute(apiRoutes.routesDir.sub.sells)
    }, [setUrlRoute])

    return (
        <>
            <Header />
        </>
    )
}

export default Index;
