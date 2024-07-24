import API_ROUTES from '../../../../../api/routes';
import { TableList } from 'components/Lists/TableList';
import InputSearch from 'components/Search/InputSearch';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import LoadingContext from 'context/loading';
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

const ProvidersListAccounts = ({
  isOpen,
  toggle,
  providerData,
  accountsList,
  accountSearchFn,
  hasAccountingModule,
  refreshList,
}) => {
  const [clientAccountsArray, setClientAccountsArray] = useState([]);
  const { axiosGetQuery, axiosPost, loadingActions } =
    useContext(ActionsBackend);
  const { setIsLoading } = useContext(LoadingContext);
  const { newAlert, newActivity } = useContext(AlertsContext);

  const getAccounts = async () => {
    const response = await axiosGetQuery(
      API_ROUTES.customersDir.sub.parameters,
      [{ providerId: providerData.id }],
    );
    if (!response.error) {
      setClientAccountsArray(response.data);
    } else {
      newAlert(
        'danger',
        'Error al cargar las cuentas del proveedor',
        response.errorMsg,
      );
    }
  };

  const saveAccounts = async () => {
    const accountsToSave = clientAccountsArray.map((account) => {
      return {
        account_chart_id: account.AccountChart.id,
        description: account.description,
        active: account.active,
        customer_id: providerData.id,
      };
    });
    const response = await axiosPost(API_ROUTES.sellsDir.sub.parameters, {
      params: accountsToSave,
      providerId: providerData.id,
    });
    if (!response.error) {
      newActivity(
        `Se guardaron las cuentas del proveedor ${providerData.business_name}`,
      );
      newAlert('success', 'Cuentas guardadas correctamente', '');
      refreshList();
      toggle();
    } else {
      newAlert(
        'danger',
        'Error al guardar las cuentas al proveedor',
        response.errorMsg,
      );
    }
  };

  const changeStatus = async (key) => {
    const newAccountsArray = clientAccountsArray.map((account, index) => {
      if (index === key) {
        account.active = !account.active;
      }
      return account;
    });
    setClientAccountsArray(newAccountsArray);
  };

  const handleClick = (key) => {
    const newAccountsArray = clientAccountsArray.map((account, index) => {
      if (index === key) {
        account.change = !account.change;
      }
      return account;
    });
    setClientAccountsArray(newAccountsArray);
  };

  useEffect(() => {
    isOpen && getAccounts();
    // eslint-disable-next-line
  }, [providerData]);

  useEffect(() => {
    setIsLoading(loadingActions);
  }, [setIsLoading, loadingActions]);

  return (
    <>
      <Modal size="lg" isOpen={isOpen} toggle={toggle}>
        <ModalHeader>
          Cuentas asociadas a {providerData.business_name}
        </ModalHeader>
        <ModalBody>
          <TableList
            titlesArray={
              hasAccountingModule()
                ? ['Cuenta', 'Activo', 'Descripción', '']
                : ['Activo', 'Descripción', '']
            }
          >
            {clientAccountsArray &&
              clientAccountsArray.map((clientAccount, key) => {
                return (
                  <tr key={key}>
                    {hasAccountingModule() && (
                      <td className="text-center">
                        <InputSearch
                          itemsList={accountsList}
                          itemSelected={
                            clientAccountsArray[key]
                              ? clientAccountsArray[key].AccountChart
                              : false
                          }
                          title={''}
                          placeholderInput={'Busque una cuenta...'}
                          getNameFn={(accountItem) =>
                            `${accountItem.name} (${accountItem.code})`
                          }
                          setItemSelected={(account) => {
                            const newAccountsArray = clientAccountsArray.map(
                              (item) => {
                                if (item.id === clientAccount.id) {
                                  item.AccountChart = account;
                                }
                                return item;
                              },
                            );
                            setClientAccountsArray(newAccountsArray);
                          }}
                          searchFn={accountSearchFn}
                        />
                      </td>
                    )}
                    <td className="text-center">
                      <Button
                        className="py-1"
                        color={clientAccount.active ? 'success' : 'gray'}
                        onClick={() => {
                          changeStatus(key);
                        }}
                      >
                        {clientAccount.active ? 'Si' : 'No'}
                      </Button>
                    </td>
                    <td
                      className="text-center"
                      onDoubleClick={
                        !clientAccount.change
                          ? () => handleClick(key)
                          : () => {}
                      }
                    >
                      {!clientAccount.change ? (
                        clientAccount.description
                      ) : (
                        <Input
                          type="textarea"
                          value={clientAccountsArray[key].description}
                          onChange={(e) => {
                            const newAccountsArray = clientAccountsArray.map(
                              (item) => {
                                if (item.id === clientAccount.id) {
                                  clientAccount.description = e.target.value;
                                }
                                return item;
                              },
                            );
                            setClientAccountsArray(newAccountsArray);
                          }}
                          onKeyUp={(e) => {
                            if (e.keyCode === 27) {
                              handleClick(key);
                            }
                          }}
                          onBlur={() => {
                            handleClick(key);
                          }}
                        />
                      )}
                    </td>
                    <td>
                      <Button
                        color="danger"
                        onClick={() => {
                          const newAccountsArray = clientAccountsArray.filter(
                            (account, index) => {
                              return index !== key;
                            },
                          );
                          setClientAccountsArray(newAccountsArray);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td className="text-center">
                <Button
                  color="primary"
                  onClick={() => {
                    setClientAccountsArray([
                      ...clientAccountsArray,
                      {
                        AccountChart: false,
                        active: true,
                        description: '',
                        change: true,
                        id: clientAccountsArray.length - 1,
                      },
                    ]);
                  }}
                >
                  <i className="fas fa-plus"></i>
                </Button>
              </td>
              <td></td>
              <td></td>
              {hasAccountingModule() && <td></td>}
            </tr>
          </TableList>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              saveAccounts();
              toggle();
            }}
          >
            Aplicar Cambios
          </Button>
          <Button color="danger" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProvidersListAccounts;
