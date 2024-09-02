import API_ROUTES from '../../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import LoadingContext from 'context/loading';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import swal from 'sweetalert';
import PaymentsMethodsTable from './tableList';

const DefaultSellParameter = ({
  hasAccountingModule,
  accountsList,
  accountSearchFn,
}) => {
  const activeClient = JSON.parse(localStorage.getItem('activeClient'));
  const [paymentsArray, setPaymentsArray] = useState([]);
  const { axiosGetQuery, axiosPost, loadingActions } =
    useContext(ActionsBackend);
  const { setIsLoading } = useContext(LoadingContext);
  const { newAlert, newActivity } = useContext(AlertsContext);

  const getPaymentsMethods = async () => {
    const response = await axiosGetQuery(
      API_ROUTES.sellsDir.sub.defaultParams,
      [],
    );
    if (!response.error) {
      const arrayData =
        response.data.length > 0
          ? response.data.map((payment, key) => {
              payment.id = key;
              return payment;
            })
          : [];
      setPaymentsArray(arrayData);
    } else {
      setPaymentsArray([]);
      newAlert(
        'danger',
        'Error al cargar el punto de venta',
        response.errorMsg,
      );
    }
  };

  const savePaymentsMethods = async () => {
    if (!hasAccountingModule()) {
      const newPaymentsArray = paymentsArray.map((payment) => {
        delete payment.AccountChart;
        return payment;
      });
      setPaymentsArray(newPaymentsArray);
    }
    const response = await axiosPost(
      API_ROUTES.sellsDir.sub.paymentsMethodsDefault,
      {
        params: paymentsArray,
      },
    );
    if (!response.error) {
      newActivity(
        `Se actualizaron los parametros del cliente: ${activeClient.business_name}`,
      );
      newAlert('success', 'Métodos de pago actualizados', '');
    } else {
      newAlert(
        'danger',
        'Error al cargar los métodos de pago',
        response.errorMsg,
      );
    }
  };

  useEffect(() => {
    getPaymentsMethods();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsLoading(loadingActions);
  }, [loadingActions, setIsLoading]);

  return (
    <Row>
      <Col md="12">
        <PaymentsMethodsTable
          paymentsArray={paymentsArray}
          setPaymentsArray={setPaymentsArray}
          accountsList={accountsList}
          accountSearchFn={accountSearchFn}
          hasAccountingModule={hasAccountingModule()}
        />
        <Col md="12" className="mt-3 text-center">
          <Button
            color="warning"
            onClick={(e) => {
              e.preventDefault();
              swal({
                title: '¿Está seguro?',
                text: 'Se restaurarán los valores de la base de datos y perderá los cambios realizados',
                icon: 'warning',
                buttons: ['Cancelar', 'Aceptar'],
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  getPaymentsMethods();
                }
              });
            }}
          >
            Restaurar valores de BD
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              savePaymentsMethods();
            }}
            color="primary"
          >
            Aplicar cambios
          </Button>
        </Col>
      </Col>
    </Row>
  );
};

export default DefaultSellParameter;
