import React, { useState } from 'react';
import LoadingContext from '.';
import ClientSelectionCard from 'components/Cards/ClientSelection';

const LoadingClientActiveProvider = ({ children }) => {
    const [activeClient, setActiveClient] = useState()

    return (<LoadingContext.Provider value={{
        activeClient
    }}>
        <div style={{ position: "fixed", zIndex: 99, bottom: 0, right: 0 }}>
            <ClientSelectionCard
                activeClient={activeClient}
                setActiveClient={setActiveClient}
            />
        </div>
        {children}
    </LoadingContext.Provider>)
}

export default LoadingClientActiveProvider