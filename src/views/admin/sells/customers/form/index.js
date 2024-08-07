import API_ROUTES from '../../../../../api/routes';
import ActionsBackend from 'context/actionsBackend';
import AlertsContext from 'context/alerts';
import { verifyDocumentNumber } from 'function/verifyDocumentNumber';
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
  Tooltip,
} from 'reactstrap';

const ProviderForm = ({
  providerInfo,
  setIsOpenProviderForm,
  setIsLoading,
}) => {
  const [documentNumber, setDocumentNumber] = useState(
    providerInfo ? providerInfo.document_number : '',
  );
  const [isDocumentValid, setIsDocumentValid] = useState(
    providerInfo ? true : false,
  );
  const [businessName, setBusinessName] = useState(
    providerInfo ? providerInfo.business_name : '',
  );
  const [fantasieName, setFantasieName] = useState(
    providerInfo ? providerInfo.fantasie_name : '',
  );
  const [ivaConditionId, setIvaConditionId] = useState(
    providerInfo ? providerInfo.iva_condition_id : 30,
  );
  const [direction, setDirection] = useState(
    providerInfo ? providerInfo.direction : '',
  );
  const [activity, setActivity] = useState(
    providerInfo ? providerInfo.activity_description : '',
  );
  const [city, setCity] = useState(providerInfo ? providerInfo.city : '');
  const [dataInfoToolTip, setDataInfoToolTip] = useState(false);
  const [isMono, setIsMono] = useState(false);

  const { newAlert, newActivity } = useContext(AlertsContext);
  const { axiosGetQuery, loadingActions, axiosQueryFile, axiosPost } =
    useContext(ActionsBackend);

  const newClientPost = async () => {
    const dataPost = {
      document_type: 80,
      document_number: documentNumber,
      business_name: businessName,
      fantasie_name: fantasieName,
      iva_condition_id: ivaConditionId,
      direction: direction,
      city: city,
      activity_description: activity,
    };
    providerInfo && (dataPost.id = providerInfo.id);
    const response = await axiosPost(
      API_ROUTES.customersDir.customers,
      dataPost,
    );
    if (!response.error) {
      providerInfo &&
        newAlert(
          'success',
          'Modificado con éxito!',
          'Proveedor modificado éxitosamente!',
        );
      !providerInfo &&
        newAlert(
          'success',
          'Registrado con éxito!',
          'Proveedor registrado éxitosamente!',
        );
      providerInfo &&
        newActivity(
          'Ha modificado al proveedor: ' +
            businessName +
            ' (' +
            documentNumber +
            ')',
        );
      !providerInfo &&
        newActivity(
          'Ha registrado al proveedor: ' +
            businessName +
            ' (' +
            documentNumber +
            ')',
        );
      setIsOpenProviderForm(false);
    } else {
      newAlert(
        'danger',
        'Hubo un error!',
        'Controle que todos los datos sean los correctos!. Error: ' +
          response.errorMsg,
      );
    }
  };

  const downloadTaxProof = async () => {
    const dataPost = [{ documentNumber }, { isMono }];
    const response = await axiosQueryFile(
      API_ROUTES.customersDir.sub.dataTaxProof,
      dataPost,
      'application/pdf',
    );
    if (!response.error) {
      newAlert(
        'success',
        'Archivo descargado con éxito!',
        'En el PDF se encuentra la constancia de inscripción del contribuyente.',
      );
    } else {
      newAlert(
        'danger',
        'Hubo un error!',
        'Posiblemente no tenga un certificado activo o los permisos en AFIP para acceder al padrón. Error: ' +
          response.errorMsg,
      );
    }
  };

  const getClientDataTax = async (e) => {
    const documentVerify = verifyDocumentNumber(e.target.value);
    if (documentVerify.isValid) {
      setIsDocumentValid(true);
      const response = await axiosGetQuery(
        API_ROUTES.customersDir.sub.dataTax,
        [{ documentNumber: documentNumber }],
      );
      try {
        const personType = response.data.data.datosGenerales.tipoPersona;
        if (personType === 'FISICA') {
          setBusinessName(
            response.data.data.datosGenerales.apellido +
              ' ' +
              response.data.data.datosGenerales.nombre,
          );
          setFantasieName(
            response.data.data.datosGenerales.apellido +
              ' ' +
              response.data.data.datosGenerales.nombre,
          );
        } else {
          setBusinessName(response.data.data.datosGenerales.razonSocial);
          setFantasieName(response.data.data.datosGenerales.razonSocial);
        }
        setCity(
          response.data.data.datosGenerales.domicilioFiscal
            .descripcionProvincia,
        );
        setDirection(
          response.data.data.datosGenerales.domicilioFiscal.direccion,
        );
        if (response.data.data.datosMonotributo) {
          setIvaConditionId(20);
          setActivity(
            response.data.data.datosMonotributo.actividadMonotributista
              .descripcionActividad,
          );
          setIsMono(true);
        } else {
          setIsMono(false);
          const taxes = response.data.data.datosRegimenGeneral.impuesto;
          // eslint-disable-next-line
          taxes.map((item) => {
            switch (item.idImpuesto) {
              case 30:
                setIvaConditionId(item.idImpuesto);
                break;
              case 32:
                setIvaConditionId(item.idImpuesto);
                break;
              case 20:
                setIvaConditionId(item.idImpuesto);
                break;
              case 33:
                setIvaConditionId(item.idImpuesto);
                break;
              case 34:
                setIvaConditionId(item.idImpuesto);
                break;
              default:
                break;
            }
          });
          setActivity(
            response.data.data.datosRegimenGeneral.actividad[0]
              .descripcionActividad,
          );
        }
      } catch (error) {
        console.log('error :>> ', error);
      }
    } else {
      setIsDocumentValid(false);
    }
  };

  useEffect(() => {
    setIsLoading(loadingActions);
  }, [loadingActions, setIsLoading]);

  return (
    <>
      <Card>
        <CardHeader>
          <Row>
            <Col md="10">
              <h2>
                {providerInfo
                  ? `Modificar proveedor ${providerInfo.business_name} CUIT: ${providerInfo.document_number}`
                  : 'Proveedor Nuevo'}
              </h2>
            </Col>
            <Col md="2" style={{ textAlign: 'right' }}>
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenProviderForm(false);
                }}
              >
                X
              </button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              newClientPost();
            }}
          >
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label for="cuitTxt">CUIT</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      id="cuitTxt"
                      placeholder="CUIT del cliente..."
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      onBlur={(e) => getClientDataTax(e)}
                      invalid={!isDocumentValid}
                      valid={isDocumentValid}
                      required
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        id="btnTaxInfo"
                        color={isDocumentValid ? 'success' : 'danger'}
                        onClick={(e) => {
                          e.preventDefault();
                          downloadTaxProof();
                        }}
                        disabled={!isDocumentValid}
                      >
                        <i className="fas fa-search"></i>
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <Tooltip
                    placement="top"
                    isOpen={dataInfoToolTip}
                    target="btnTaxInfo"
                    toggle={() => setDataInfoToolTip(!dataInfoToolTip)}
                  >
                    Ver información completa
                  </Tooltip>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="businessNameTxt">Razón Social</Label>
                  <Input
                    type="text"
                    id="businessNameTxt"
                    placeholder="Razón Social..."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="fantasieTxt">Cond. IVA</Label>
                  <Input
                    type="select"
                    id="fantasieTxt"
                    placeholder="Nombre de fantasía..."
                    value={ivaConditionId}
                    onChange={(e) => setIvaConditionId(e.target.value)}
                  >
                    <option value={30}>IVA Responsable Inscripto</option>
                    <option value={32}>IVA Sujeto Exento</option>
                    <option value={20}>Responsable Monotributo</option>
                    <option value={33}>IVA Responsable No Inscripto</option>
                    <option value={34}>IVA No Alcanzado</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="fantasieTxt">Nombre de Fantasía</Label>
                  <Input
                    type="text"
                    id="fantasieTxt"
                    placeholder="Nombre de fantasía..."
                    value={fantasieName}
                    onChange={(e) => setFantasieName(e.target.value)}
                    onFocus={() => setFantasieName(businessName)}
                  />
                </FormGroup>
              </Col>
              <Col md="8">
                <FormGroup>
                  <Label for="fantasieTxt">Actividad</Label>
                  <Input
                    type="text"
                    id="activityTxt"
                    placeholder="Actividad principal..."
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="8">
                <FormGroup>
                  <Label for="directionTxt">Dirección</Label>
                  <Input
                    type="text"
                    id="directionTxt"
                    placeholder="Dirección del cliente..."
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="cityTxt">Localidad</Label>
                  <Input
                    type="text"
                    id="cityTxt"
                    placeholder="Localidad del cliente..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12" style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '150px', margin: '20px' }}
                  type="submit"
                >
                  {providerInfo ? 'Modificar' : 'Agregar'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{ width: '150px', margin: '20px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpenProviderForm(false);
                  }}
                >
                  Cancelar
                </button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default ProviderForm;
