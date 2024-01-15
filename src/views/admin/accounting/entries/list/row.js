import React from 'react';
import { numberFormat } from '../../../../../function/numberFormat';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const EntryRow = ({
    id,
    entry,
    first,
    page,
    setPage,
    refreshToggle,
    setEntryDetails
}) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = entry.description;
    const textContent = tempDiv.textContent || tempDiv.innerText;

    return (
        <tr>
            <td className='text-center' >{entry.date}</td>
            <td className='text-center' style={{ fontSize: "18px" }}>{entry.number}</td>
            <td>{textContent.length > 50 ? textContent.slice(0, 50) + "..." : textContent}</td>
            <td>{
                // eslint-disable-next-line array-callback-return
                entry.AccountingEntriesDetails.map((detail, key) => {
                    if (key < 2) {
                        return <p key={key} style={{ fontSize: "12px" }} >{detail.AccountChart.name} ({detail.AccountChart.code})</p>
                    } else if (key === 2) {
                        return <span key={key}>...<br /></span>
                    }
                })
            }</td>
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
                            onClick={() => setEntryDetails(entry)}
                        >
                            <i className="fas fa-edit"></i>
                            Ver Detalles
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
    )
}

export default EntryRow;