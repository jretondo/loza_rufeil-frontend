import React, { useContext, useEffect, useState } from 'react';
import API_ROUTES from '../../../../../../api/routes';
import LoadingContext from '../../../../../../context/loading';
import { useAxiosGetList } from '../../../../../../hooks/useAxiosGetList';
import EntriesListComponent from './list';

const LedgerList = ({ accountsList, activeTab }) => {
    const [page, setPage] = useState(1)
    const [filtersActive, setFiltersActive] = useState(false)
    const [refreshList, setRefreshList] = useState(false)
    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        account: false
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
        API_ROUTES.accountingDir.sub.ledger,
        page, refreshList, [
        { dateFrom: filters.dateFrom },
        { dateTo: filters.dateTo },
        { account: filters.account ? filters.account.id : false }
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
            <EntriesListComponent
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

export default LedgerList;