import React from 'react';
import JornalList from './list';

const JournalComponent = ({
    accountsList,
    activeTab
}) => {
    return (
        <JornalList
            accountsList={accountsList}
            activeTab={activeTab}
        />
    )
}

export default JournalComponent;