import React, { useContext, useEffect, useState } from 'react';
import API_ROUTES from '../../../../../api/routes';
import LoadingContext from '../../../../../context/loading';
import { useAxiosGetList } from '../../../../../hooks/useAxiosGetList';
import EntriesListComponent from './list';
import ChargeEntriesComp from '../charge';

const EntriesList = ({ accountsList }) => {
    const [page, setPage] = useState(1)
    const [filtersActive, setFiltersActive] = useState(false)
    const [refreshList, setRefreshList] = useState(false)
    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        account: false,
        text: "",
        amountFrom: "",
        amountTo: "",
        number: ""
    })
    const [entryDetails, setEntryDetails] = useState(false)

    const { setIsLoading } = useContext(LoadingContext)
    const {
        dataPage,
        pageObj,
        errorList,
        loadingList
    } = useAxiosGetList(
        API_ROUTES.accountingDir.sub.entries,
        page, refreshList, [
        { dateFrom: filters.dateFrom },
        { dateTo: filters.dateTo },
        { account: filters.account ? filters.account.id : false },
        { text: filters.text },
        { amountFrom: filters.amountFrom },
        { amountTo: filters.amountTo },
        { number: filters.number }
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
    }, [entryDetails])

    return (
        <>
            {
                entryDetails ?
                    <ChargeEntriesComp
                        accountsList={accountsList}
                        entryDetails={entryDetails}
                        setEntryDetails={setEntryDetails}
                    />
                    :
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
                    />
            }
        </>
    );
}

export default EntriesList;