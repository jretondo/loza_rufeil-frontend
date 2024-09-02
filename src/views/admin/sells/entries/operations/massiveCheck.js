import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import API_ROUTES from '../../../../../api/routes';
import AlertsContext from '../../../../../context/alerts';
import ActionsBackend from '../../../../../context/actionsBackend';
import { invoiceTypeConvertObject } from '../../../../../function/invoiceType';
import roundNumber from '../../../../../function/roundNumber';

const MassiveCheck = ({
  purchaseImported,
  setPurchaseImported,
  accountsList,
  periodMonth,
  periodYear,
  purchasePeriod,
  hasAccountingModule,
}) => {
  const { axiosGetQuery, axiosPost } = useContext(ActionsBackend);
  const { newAlert, newActivity } = useContext(AlertsContext);

  const getDefaultParams = async (total) => {
    const response = await axiosGetQuery(
      API_ROUTES.sellsDir.sub.defaultParams,
      [],
    );
    if (!response.error) {
      const arrayData = response.data.map((account, key) => {
        return { ...account, id: key, amount: total, recordType: 0 };
      });
      return arrayData;
    } else {
      return [];
    }
  };

  const completeFieldsImported = (invoiceSelected) => {
    const invoiceNumber = parseInt(invoiceSelected.receipt_type);
    const { word, type } = invoiceTypeConvertObject(invoiceNumber);
    const newHeader = {
      date: invoiceSelected.date,
      total: invoiceSelected.total,
      type: type,
      word: word,
      sellPoint: invoiceSelected.sell_point,
      number: invoiceSelected.number,
    };
    return newHeader;
  };

  const getPaymentsMethods = async () => {
    const response = await axiosGetQuery(
      API_ROUTES.sellsDir.sub.paymentsMethods,
      [],
    );
    if (!response.error) {
      const arrayData =
        response.data.length > 0
          ? response.data.map((payment, key) => {
              payment.id = key;
              payment.amount = 0;
              return payment;
            })
          : [];
      return arrayData;
    } else {
      return [];
    }
  };

  const getProviderAccount = async (selectedProvider, headerInvoice) => {
    const response = await axiosGetQuery(
      API_ROUTES.customersDir.sub.parameters,
      [{ providerId: selectedProvider.id }],
    );
    if (!response.error) {
      const arrayData =
        response.data.length > 0
          ? response.data.map((account, key) => {
              account.id = key;
              account.amount = 0;
              account.recordType = 0;
              return account;
            })
          : [];
      if (arrayData.length === 0) {
        return await getDefaultParams(headerInvoice.total);
      } else {
        return arrayData;
      }
    } else {
      return [];
    }
  };

  const importedTaxes = (dataTaxes, invoiceSelected) => {
    let vatRatesReceipts = [];
    invoiceSelected.VatRatesReceipts &&
      (vatRatesReceipts = invoiceSelected.VatRatesReceipts.filter(
        (vat) => vat !== 0,
      ));
    const newArray = dataTaxes.map((item) => {
      const vat = vatRatesReceipts.find((vat) => vat.vat_type_id === item.type);
      if (vat) {
        return {
          ...item,
          amount: vat.vat_amount,
          recorded: vat.recorded_net,
          active: true,
        };
      } else {
        return item;
      }
    });

    return newArray;
  };

  const getTaxes = async (vat_condition) => {
    const response = await axiosGetQuery(API_ROUTES.sellsDir.sub.params, [
      { vat_condition },
    ]);
    if (!response.error) {
      const arrayDataVat =
        response.data.vat.length > 0
          ? response.data.vat.map((tax, key) => {
              tax.id = key;
              tax.amount = 0;
              return tax;
            })
          : [];
      const arrayDataOthers =
        response.data.others.length > 0
          ? response.data.others.map((tax, key) => {
              tax.id = arrayDataVat.length - 1 + key;
              tax.amount = 0;
              return tax;
            })
          : [];

      return [...arrayDataVat, ...arrayDataOthers];
    } else {
      return [];
    }
  };

  const correctAmounts = (
    taxesList,
    headerInvoice,
    receiptConcepts,
    paymentsMethods,
  ) => {
    const { taxes, recorded } = getVatAmount(taxesList, headerInvoice.total);
    const newReceiptsArray =
      receiptConcepts && receiptConcepts.length
        ? receiptConcepts.map((item, key) => {
            if (key === 0) {
              item.amount = roundNumber(recorded);
            }
            return item;
          })
        : [];
    const newPaymentsPaymentsArray =
      paymentsMethods && paymentsMethods.length
        ? paymentsMethods.map((item, key) => {
            if (key === 0) {
              item.amount = roundNumber(headerInvoice.total);
            }
            return item;
          })
        : [];
    return {
      taxes: taxes,
      receiptConcepts: newReceiptsArray,
      paymentsMethods: newPaymentsPaymentsArray,
    };
  };

  const getVatAmount = (taxesList, totalAmount, isRecorded) => {
    const newTaxesArray = taxesList.map((tax) => {
      if (roundNumber(totalAmount) > 0 && tax.active) {
        switch (parseInt(tax.type)) {
          case 4:
            if (tax.recorded) {
              tax.recorded = parseFloat(tax.recorded) > 0 ? tax.recorded : 0;
              tax.amount = tax.recorded * 0.105;
            } else {
              tax.amount = !isRecorded
                ? totalAmount - totalAmount / 1.105
                : totalAmount * 0.105;
              tax.recorded = tax.amount / 0.105;
            }
            break;
          case 5:
            if (tax.recorded) {
              tax.recorded = parseFloat(tax.recorded) > 0 ? tax.recorded : 0;
              tax.amount = tax.recorded * 0.21;
            } else {
              tax.amount = !isRecorded
                ? totalAmount - totalAmount / 1.21
                : totalAmount * 0.21;
              tax.recorded = tax.amount / 0.21;
            }
            break;
          case 6:
            if (tax.recorded) {
              tax.recorded = parseFloat(tax.recorded) > 0 ? tax.recorded : 0;
              tax.amount = tax.recorded * 0.27;
            } else {
              tax.amount = !isRecorded
                ? totalAmount - totalAmount / 1.27
                : totalAmount * 0.27;
              tax.recorded = tax.amount / 0.27;
            }
            break;
          case 8:
            if (tax.recorded) {
              tax.recorded = parseFloat(tax.recorded) > 0 ? tax.recorded : 0;
              tax.amount = tax.recorded * 0.05;
            } else {
              tax.amount = !isRecorded
                ? totalAmount - totalAmount / 1.05
                : totalAmount * 0.05;
              tax.recorded = tax.amount / 0.05;
            }
            break;
          case 9:
            if (tax.recorded) {
              tax.recorded = parseFloat(tax.recorded) > 0 ? tax.recorded : 0;
              tax.amount = tax.recorded * 0.025;
            } else {
              tax.amount = !isRecorded
                ? totalAmount - totalAmount / 1.025
                : totalAmount * 0.025;
              tax.recorded = tax.amount / 0.025;
            }
            break;
          default:
            break;
        }
      } else {
        tax.amount = 0;
        tax.recorded = 0;
      }
      tax.amount = roundNumber(tax.amount);
      tax.recorded = roundNumber(tax.recorded);
      return tax;
    });
    return {
      taxes: newTaxesArray,
      recorded: roundNumber(
        taxesList.reduce((acc, tax) => acc + roundNumber(tax.recorded), 0),
      ),
    };
  };

  const checkAll = async () => {
    const purchaseCorrectedPromises = purchaseImported.map(
      async (invoiceSelected) => {
        const newHeader = completeFieldsImported(invoiceSelected);
        const receiptConcepts = await getDefaultParams(newHeader.total);
        const paymentMethods = await getPaymentsMethods();
        const accounts = await getProviderAccount(
          invoiceSelected.Customer,
          newHeader,
        );
        const taxeList = await getTaxes(invoiceSelected.Customer.vat_condition);
        const vatRates = importedTaxes(taxeList, invoiceSelected);
        const correctedAmounts = correctAmounts(
          taxeList,
          newHeader,
          receiptConcepts,
          paymentMethods,
        );

        const data = {
          header: newHeader,
          payments: correctedAmounts.paymentsMethods,
          accounts: accounts,
          taxes: correctedAmounts.taxes,
          concepts: correctedAmounts.receiptConcepts,
          vatRates: vatRates,
          period: {
            month: periodMonth,
            year: periodYear,
          },
          accountsList: accountsList,
          purchase_period_id: purchasePeriod.id,
          hasAccountingModule: hasAccountingModule,
        };

        const newItem = await saveImportedInvoice(
          newHeader,
          data.payments,
          data.concepts,
          data.taxes,
          invoiceSelected.Customer,
          invoiceSelected,
        );
        return newItem;
      },
    );

    const purchaseCorrected = await Promise.all(purchaseCorrectedPromises);
    setPurchaseImported(purchaseCorrected);
  };

  const saveImportedInvoice = async (
    headerInvoice,
    paymentsMethods,
    receiptConcepts,
    taxesList,
    selectedProvider,
    invoiceSelected,
  ) => {
    const data = {
      header: headerInvoice,
      payments: paymentsMethods
        .filter((payment) => parseFloat(payment.amount) > 0)
        .map((payment) => {
          return { ...payment, amount: roundNumber(payment.amount) };
        }),
      concepts: receiptConcepts
        .filter((concept) => parseFloat(concept.amount) > 0)
        .map((concept) => {
          return { ...concept, amount: roundNumber(concept.amount) };
        }),
      taxes: taxesList
        .filter((tax) => parseFloat(tax.amount) > 0 && tax.active)
        .map((tax) => {
          return {
            ...tax,
            amount: roundNumber(tax.amount),
            recorded: roundNumber(tax.recorded),
          };
        }),
      purchasePeriodId: purchasePeriod.id,
      provider: selectedProvider,
      observations: '',
    };
    const response = await axiosPost(
      API_ROUTES.sellsDir.sub.checkReceipts,
      data,
    );
    if (!response.error) {
      const newInvoice = {
        ...invoiceSelected,
        header: headerInvoice,
        payments: paymentsMethods
          .filter((payment) => parseFloat(payment.amount) > 0)
          .map((payment) => {
            return { ...payment, amount: roundNumber(payment.amount) };
          }),
        concepts: receiptConcepts
          .filter((concept) => parseFloat(concept.amount) > 0)
          .map((concept) => {
            return { ...concept, amount: roundNumber(concept.amount) };
          }),
        taxes: taxesList
          .filter((tax) => parseFloat(tax.amount) > 0 && tax.active)
          .map((tax) => {
            return {
              ...tax,
              amount: roundNumber(tax.amount),
              recorded: roundNumber(tax.recorded),
            };
          }),
        Provider: selectedProvider,
        provider: selectedProvider,
        observations: '',
        checked: true,
        total: headerInvoice.total,
      };
      return newInvoice;
    } else {
      return invoiceSelected;
    }
  };

  return (
    <Button
      color="info"
      onClick={(e) => {
        e.preventDefault();
        checkAll();
      }}
    >
      Chequear todo
    </Button>
  );
};

export default MassiveCheck;
