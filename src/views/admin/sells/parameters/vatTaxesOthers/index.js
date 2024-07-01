import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import ActionsBackend from 'context/actionsBackend';
import LoadingContext from 'context/loading';
import API_ROUTES from '../../../../../api/routes';
import AlertsContext from 'context/alerts';
import swal from 'sweetalert';
import VatTableList from './vatTableList';
import OthersTableList from './othersTableList';

const VatTaxesOthers = ({
  hasAccountingModule,
  accountsList,
  accountSearchFn,
  activeClient,
}) => {
  const [vatArray, setVatArray] = useState([]);
  const [othersArray, setOthersArray] = useState([]);
  const { axiosGetQuery, axiosPost, loadingActions } =
    useContext(ActionsBackend);
  const { setIsLoading } = useContext(LoadingContext);
  const { newAlert, newActivity } = useContext(AlertsContext);

  const getClientParams = async () => {
    const response = await axiosGetQuery(API_ROUTES.sellsDir.sub.params, []);
    if (!response.error) {
      setVatArray(response.data.vat);
      setOthersArray(response.data.others);
    } else {
      newAlert(
        'danger',
        'Error al cargar los parametros del cliente',
        response.errorMsg,
      );
    }
  };

  const saveClientParams = async () => {
    const response = await axiosPost(API_ROUTES.sellsDir.sub.params, {
      params: { vat: vatArray, others: othersArray },
    });
    if (!response.error) {
      newActivity(
        `Se actualizaron los parametros del cliente: ${activeClient.business_name}`,
      );
      newAlert('success', 'Parametros actualizados', '');
    } else {
      newAlert(
        'danger',
        'Error al cargar los parametros del cliente',
        response.errorMsg,
      );
    }
  };

  useEffect(() => {
    setIsLoading(loadingActions);
  }, [loadingActions, setIsLoading]);

  useEffect(() => {
    getClientParams();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Row>
        <VatTableList
          vatArray={vatArray}
          setVatArray={setVatArray}
          accountsList={accountsList}
          accountSearchFn={accountSearchFn}
          hasAccountingModule={hasAccountingModule}
        />
        <OthersTableList
          othersArray={othersArray}
          setOthersArray={setOthersArray}
          accountsList={accountsList}
          accountSearchFn={accountSearchFn}
          hasAccountingModule={hasAccountingModule}
        />
      </Row>
      <Row className="mt-3">
        <Col md="12" className="text-center">
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
                  getClientParams();
                }
              });
            }}
          >
            Restaurar valores de BD
          </Button>
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              saveClientParams();
            }}
          >
            Aplicar cambios
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default VatTaxesOthers;
