import React, { useContext } from 'react';
import { Button, Col, Row } from 'reactstrap';
import ActionsBackend from '../../../../../context/actionsBackend';
import AlertsContext from '../../../../../context/alerts';
import LoadingContext from '../../../../../context/loading';
import API_ROUTES from '../../../../../api/routes';

const PurchasesEntriesOperations = ({ purchasePeriod }) => {
    const { axiosGetFile, loadingActions } = useContext(ActionsBackend)
    const { newAlert, newActivity } = useContext(AlertsContext)
    const { setIsLoading } = useContext(LoadingContext)

    const importFromAFIP = async () => {
        const response = await axiosGetFile(API_ROUTES.purchasesDir.sub.receiptsTxt, purchasePeriod.id, "application/x-gzip")
        if (!response.error) {
            newAlert("success", "Archivo generado con éxito!", "Descomprima el archivo para encontrar el .csr y el .key")
        } else {
            console.log(response.error)
            newAlert("danger", "Hubo un error!", "Revise los datos colocados. Error: " + response.errorMsg)
        }
    }
    return (<>
        <Row>
            <Col md="4" className="text-center">
                <Button
                    onClick={() => importFromAFIP()}
                    color="primary">Importar TXT desde AFIP <i className='fas fa-download ml-2'></i></Button>
            </Col>
            <Col md="4" className="text-center">
                <Button color="primary">Cerrar Periodo <i className='fas fa-window-close ml-2'></i></Button>
            </Col>
            <Col md="4" className="text-center">
                <Button color="primary">Exportar TXT para AFIP <i className='fas fa-upload ml-2'></i></Button>
            </Col>
        </Row>
    </>)
}

export default PurchasesEntriesOperations