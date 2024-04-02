import React from 'react';
import LedgerListComponent from './list';

const LedgerComponent = ({
    accountsList,
    activeTab
}) => {
    return (
        <LedgerListComponent
            accountsList={accountsList}
            activeTab={activeTab}
        />
    )
}

export default LedgerComponent;