import React, { useContext, useEffect, useState } from 'react';
import API_ROUTES from '../../../../../../api/routes';
import LoadingContext from '../../../../../../context/loading';
import { useAxiosGetList } from '../../../../../../hooks/useAxiosGetList';
import BalanceListComponent from './list';

const BalanceList = ({ accountsList, activeTab }) => {
    const [page, setPage] = useState(1)
    const [filtersActive, setFiltersActive] = useState(false)
    const [refreshList, setRefreshList] = useState(false)
    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        accountFrom: false,
        accountTo: false,
    })
    const [entryDetails, setEntryDetails] = useState(false)

    const { setIsLoading } = useContext(LoadingContext)
    const {
        dataPage,
        pageObj,
        errorList,
        pagesQuantity,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.accountingDir.sub.balance,
        page, refreshList, [
        { dateFrom: filters.dateFrom },
        { dateTo: filters.dateTo },
        { accountFrom: filters.accountFrom ? filters.accountFrom.code : false },
        { accountTo: filters.accountTo ? filters.accountTo.code : false },
    ])

    const accountSearchFn = (account, searchedText) => {
        if ((account.name).toLowerCase().includes(searchedText.toLowerCase()) || (account.code).toLowerCase().includes(searchedText.toLowerCase())) {
            return account
        }
    }

    useEffect(() => {
        setIsLoading(loadingList)
    }, [loadingList, setIsLoading])

    useEffect(() => {
        setRefreshList(!refreshList)
        // eslint-disable-next-line
    }, [entryDetails, activeTab])

    return (
        <>
            <BalanceListComponent
                accountsList={accountsList}
                page={page}
                setPage={setPage}
                dataPage={dataPage}
                pageObj={pageObj}
                errorList={errorList}
                refreshList={refreshList}
                setRefreshList={setRefreshList}
                filters={filters}
                setFilters={setFilters}
                filtersActive={filtersActive}
                setFiltersActive={setFiltersActive}
                accountSearchFn={accountSearchFn}
                setEntryDetails={setEntryDetails}
                pagesQuantity={pagesQuantity}
            />
        </>
    );
}

export default BalanceList;