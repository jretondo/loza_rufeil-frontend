import React, { useEffect, useState } from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const ModuleItem = ({ module, changePermission }) => {
    const [permissionGrade, setPermissionGrade] = useState({
        color: "gray",
        text: "Deshabilitado"
    })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const changePermissionGrade = (active) => {
        if (!active) {
            setPermissionGrade({
                color: "danger",
                text: "Deshabilitado"
            })
        } else {
            setPermissionGrade({
                color: "success",
                text: "Habilitado"
            })
        }
    }

    useEffect(() => {
        changePermissionGrade(module.active)
    }, [module.active])

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
                        changePermission(module.module_id, false)
                    }}
                >Deshabilitar</DropdownItem>
                <DropdownItem
                    style={{ cursor: "pointer" }}
                    onClick={e => {
                        e.preventDefault()
                        changePermission(module.module_id, true)
                    }}
                >Habilitar</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    )
}
export default ModuleItem