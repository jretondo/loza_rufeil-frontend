import React, { useContext, useState } from 'react';
import { numberFormat } from '../../../../../function/numberFormat';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import moment from 'moment';
import EntryModal from './entryModal';
import AlertsContext from '../../../../../context/alerts';
import ActionsBackend from '../../../../../context/actionsBackend';
import API_ROUTES from '../../../../../api/routes';
import swal from 'sweetalert';
import ReorderEntry from './reorderEntry';

const EntryRow = ({
    id,
    entry,
    first,
    page,
    setPage,
    refreshToggle,
    setEntryDetails
}) => {
    const businessData = JSON.parse(localStorage.getItem("activeClient"));
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = entry.description;
    const textContent = tempDiv.textContent || tempDiv.innerText;

    const [entryModal, setEntryModal] = useState(false);
    const [reOrderModal, setReOrderModal] = useState(false);

    const { newAlert, newActivity } = useContext(AlertsContext)
    const { axiosDelete } = useContext(ActionsBackend)



    const entryDelete = async (e) => {
        e.preventDefault()
        swal({
            title: "¿Está seguro de eliminar este comprobante? Esta desición es permanente.",
            text: `Eliminar el asiento Nº:${entry.number} con fecha:${moment(entry.date).format("DD/MM/YYYY")}`,
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                let backPage = false
                if (willDelete) {
                    const response = await axiosDelete(API_ROUTES.purchasesDir.sub.receipt, id)
                    if (!response.error) {
                        if (first) {
                            if (page > 1) {
                                backPage = true
                            }
                        }
                        newActivity(`Se ha eliminado el asiento Nº ${entry.number}) con fecha ${moment(entry.date).format("DD/MM/YYYY")} de la empresa (${businessData.business_name} (CUIT: ${businessData.document_number})`)
                        newAlert("success", "Comprobante de compra eliminado con éxito!", "")
                        if (backPage) {
                            setPage(parseInt(page - 1))
                        } else {
                            refreshToggle()
                        }
                    } else {
                        newAlert("danger", "Hubo un error!", "Intentelo nuevamente. Error: " + response.errorMsg)
                    }
                }
            });
    }

    return (
        <>
            <tr>
                <td className='text-center' >{moment(entry.date).format("DD/MM/YYYY")}</td>
                <td className='text-center' style={{ fontSize: "18px" }}>{entry.number}</td>
                <td>{textContent.length > 50 ? textContent.slice(0, 50) + "..." : textContent}</td>
                <td className='text-center' >$ {numberFormat(entry.debit)}</td>
                <td className="text-right">
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                href="#pablo"
                                onClick={() => setEntryModal(true)}
                            >
                                <i className="fas fa-eye"></i>
                                Ver Detalles
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={() => setEntryDetails(entry)}
                            >
                                <i className="fas fa-edit"></i>
                                Editar
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={() => setReOrderModal(true)}
                            >
                                <i className="fas fa-arrow-up"></i>
                                Reordenar
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={entryDelete}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
            <EntryModal
                entry={entry}
                toggle={() => setEntryModal(!entryModal)}
                isOpen={entryModal}
            />
            <ReorderEntry
                isOpen={reOrderModal}
                toggle={() => setReOrderModal(!reOrderModal)}
                entry={entry}
                refreshToggle={refreshToggle}
            />
        </>
    )
}

export default EntryRow;