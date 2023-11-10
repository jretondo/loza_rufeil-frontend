export function getProviderRow(receiptItem) {
    if (receiptItem.Provider) {
        return `${receiptItem.Provider.business_name} (${receiptItem.Provider.document_number})`
    } else {
        return receiptItem.ProviderRaw
    }
}