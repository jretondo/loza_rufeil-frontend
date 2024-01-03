import React from 'react';
import PurchasesEntriesCharge from '../charge';

const InvoiceDataConcepts = ({
    setInvoiceSelected,
    accountsList,
    hasAccountingModule,
    accountSearchFn,
    purchasePeriodId,
    refreshListToggle,
    periodMonth,
    periodYear,
    purchasePeriod,
    setPurchaseImported,
    invoiceSelected
}) => {
    console.log('periodMonth :>> ', periodMonth);
    return (<>
        <PurchasesEntriesCharge
            accountsList={accountsList}
            hasAccountingModule={hasAccountingModule}
            accountSearchFn={accountSearchFn}
            purchasePeriodId={purchasePeriodId}
            refreshListToggle={refreshListToggle}
            periodMonth={periodMonth}
            periodYear={periodYear}
            purchasePeriod={purchasePeriod}
            importedReceipt={true}
            setInvoiceSelected={setInvoiceSelected}
            setPurchaseImported={setPurchaseImported}
            invoiceSelected={invoiceSelected}
        />
    </>)
}

export default InvoiceDataConcepts