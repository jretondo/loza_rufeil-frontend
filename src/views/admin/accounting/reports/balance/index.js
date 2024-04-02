import React from 'react';
import BalanceList from './list';

const BalanceComponent = ({
    accountsList,
    activeTab
}) => {
    return (
        <BalanceList
            accountsList={accountsList}
            activeTab={activeTab}
        />
    )
}
export default BalanceComponent;