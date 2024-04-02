import React, { useState } from 'react';
import { numberFormat } from '../../../../../function/numberFormat';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import moment from 'moment';
import EntryModal from './entryModal';

const EntryRow = ({
    id,
    entry,
    first,
    page,
    setPage,
    refreshToggle,
    setEntryDetails
}) => {
    const [entryModal, setEntryModal] = useState(false);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = entry.description;
    const textContent = tempDiv.textContent || tempDiv.innerText;

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
        </>
    )
}

export default EntryRow;