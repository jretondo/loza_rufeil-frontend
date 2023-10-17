import React, { useContext, useEffect, useState } from "react";
import PurchasesLayout from "..";
import ProvidersList from "./list";
import LoadingContext from "context/loading";
import ProviderForm from "./form";
import AlertsContext from "context/alerts";
import ActionsBackend from "context/actionsBackend";
import API_ROUTES from "../../../../api/routes";

const Providers = () => {
    const accountPeriod = JSON.parse(localStorage.getItem("activePeriod"))
    const modules = JSON.parse(localStorage.getItem("modules"))
    const [isOpenProviderForm, setIsOpenProviderForm] = useState(false)
    const [providerInfo, setProviderInfo] = useState(false)
    const [accountsList, setAccountsList] = useState([])

    const { axiosGetQuery, loadingActions } = useContext(ActionsBackend)
    const { setIsLoading } = useContext(LoadingContext)
    const { newAlert } = useContext(AlertsContext)

    const getAttributableAccounts = async () => {
        const response = await axiosGetQuery(API_ROUTES.accountingDir.sub.attributableAccountingChart, [{ accountPeriodId: accountPeriod.id }])
        if (!response.error) {
            setAccountsList(response.data)
        } else {
            newAlert("danger", "Error al cargar las cuentas atribuibles", response.errorMsg)
        }
    }

    const accountSearchFn = (account, searchedText) => {
        if ((account.name).toLowerCase().includes(searchedText.toLowerCase()) || (account.code).toLowerCase().includes(searchedText.toLowerCase())) {
            return account
        }
    }

    const hasAccountingModule = () => {
        const find = modules.find((module) => module.module_id === 11)
        if (find) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        getAttributableAccounts()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setIsLoading(loadingActions)
    }, [loadingActions, setIsLoading])

    return (
        <>
            <PurchasesLayout >
                {
                    isOpenProviderForm ?
                        <ProviderForm
                            providerInfo={providerInfo}
                            setIsOpenProviderForm={setIsOpenProviderForm}
                            setIsLoading={setIsLoading}
                        /> :
                        <ProvidersList
                            setProviderInfo={setProviderInfo}
                            setIsOpenProviderForm={setIsOpenProviderForm}
                            setIsLoading={setIsLoading}
                            providerInfo={providerInfo}
                            accountsList={accountsList}
                            accountSearchFn={accountSearchFn}
                            hasAccountingModule={hasAccountingModule}
                            accountPeriod={accountPeriod}
                        />
                }
            </PurchasesLayout>
        </>
    )
}

export default Providers;
