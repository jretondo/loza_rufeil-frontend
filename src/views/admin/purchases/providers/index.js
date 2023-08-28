import React, { useContext, useEffect, useState } from "react";
import secureContext from 'context/secureRoutes';
import apiRoutes from "../../../../api/routes";
import PurchasesLayout from "..";
import ProvidersList from "./list";
import LoadingContext from "context/loading";
import ProviderForm from "./form";

const Providers = () => {
    const [isOpenClientForm, setIsOpenClientForm] = useState(false)
    const [clientInfo, setClientInfo] = useState(false)

    const { setIsLoading } = useContext(LoadingContext)

    return (
        <>
            <PurchasesLayout >
                {
                    isOpenClientForm ?
                        <ProviderForm
                            clientInfo={clientInfo}
                            setIsOpenClientForm={setIsOpenClientForm}
                            setIsLoading={setIsLoading}
                        /> :
                        <ProvidersList
                            setClientInfo={setClientInfo}
                            setIsOpenClientForm={setIsOpenClientForm}
                            setIsLoading={setIsLoading}
                        />
                }
            </PurchasesLayout>
        </>
    )
}

export default Providers;
