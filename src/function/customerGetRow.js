export function getCustomerRow(receiptItem) {
  if (receiptItem.Customer) {
    return `${receiptItem.Customer.business_name} (${receiptItem.Customer.document_number})`;
  } else {
    return receiptItem.CustomerRaw;
  }
}
