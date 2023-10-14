import React, { useEffect, useState } from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const ModuleItem = ({ id, client, changePermission }) => {
    const [permissionGrade, setPermissionGrade] = useState({
        color: "gray",
        text: "Deshabilitado"
    })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const changePermissionGrade = (grade) => {
        switch (grade) {
            case 0:
                setPermissionGrade({
                    color: "micolor5",
                    text: "Deshabilitado"
                })
                break;
            case 1:
                setPermissionGrade({
                    color: "info",
                    text: "Sólo lectura"
                })
                break;
            case 2:
                setPermissionGrade({
                    color: "success",
                    text: "Lectura e inserción"
                })
                break;
            case 3:
                setPermissionGrade({
                    color: "warning",
                    text: "Lectura, inserción y modificación"
                })
                break;
            case 4:
                setPermissionGrade({
                    color: "danger",
                    text: "Control Total (incluye eliminación)"
                })
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        changePermissionGrade(client.permission_grade_id)
    }, [client.permission_grade_id])

    return (
        <ButtonDropdown isOpen={isDropdownOpen} toggle={() => setIsDropdownOpen(!isDropdownOpen)} style={{ width: "100%" }}>
            <DropdownToggle color={permissionGrade.color} caret style={{ width: "100%", textAlign: "center", margin: "auto" }}>
                {permissionGrade.text}
            </DropdownToggle>
            <DropdownMenu >
                <DropdownItem
                    style={{ cursor: "pointer" }}
                    onClick={e => {
                        e.preventDefault()
                        changePermission(id, 0)
                    }}
                >Deshabilitar</DropdownItem>
                <DropdownItem
                    style={{ cursor: "pointer" }}
                    onClick={e => {
                        e.preventDefault()
                        changePermission(id, 1)
                    }}
                >Sólo lectura</DropdownItem>
                <DropdownItem
                    style={{ cursor: "pointer" }}
                    onClick={e => {
                        e.preventDefault()
                        changePermission(id, 2)
                    }}
                >Lectura e inserción</DropdownItem>
                <DropdownItem
                    style={{ cursor: "pointer" }}
                    onClick={e => {
                        e.preventDefault()
                        changePermission(id, 3)
                    }}
                >Control total</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    )
}
export default ModuleItem