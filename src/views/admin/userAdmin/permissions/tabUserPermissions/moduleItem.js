import React, { useEffect, useState } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupButtonDropdown, Row } from 'reactstrap';

const ModuleItem = ({ id, client, changePermission }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        if (client.permissions.length > 0) {
            setIsDropdownOpen(client.permissions.map(() => false))
        }
    }, [client.permissions])

    return (
        <>
            {client.permissions.length > 0 && client.permissions.map((permission, key) => {
                let config = {
                    color: "gray",
                    text: "Deshabilitado"
                }
                switch (parseInt(permission.permission_grade_id)) {
                    case 0:
                        config = {
                            color: "gray",
                            text: "Deshabilitado"
                        }
                        break;
                    case 1:
                        config = {
                            color: "info",
                            text: "Sólo lectura"
                        }
                        break;
                    case 2:
                        config = {
                            color: "success",
                            text: "Lectura e inserción"
                        }
                        break;
                    case 3:
                        config = {
                            color: "warning",
                            text: "Lectura, inserción y modificación"
                        }
                        break;
                    case 4:
                        config = {
                            color: "danger",
                            text: "Control Total (incluye eliminación)"
                        }
                        break;
                    default:
                        break;
                }
                return (
                    <Row className="mt-2" key={key}>
                        <InputGroup>
                            <Input value={permission.module_name} type="text" disabled />
                            <InputGroupButtonDropdown addonType="append" isOpen={isDropdownOpen[key]} toggle={() => setIsDropdownOpen(() => {
                                let newIsDropdownOpen = isDropdownOpen.map((item, index) => {
                                    if (index === key) {
                                        return !item
                                    }
                                    return item
                                })
                                return newIsDropdownOpen
                            })}>
                                <DropdownToggle color={config.color} caret>
                                    {config.text}
                                </DropdownToggle>
                                <DropdownMenu >
                                    <DropdownItem
                                        style={{ cursor: "pointer" }}
                                        onClick={e => {
                                            e.preventDefault()
                                            changePermission(id, permission.module_id, 0)
                                        }}
                                    >Deshabilitar</DropdownItem>
                                    <DropdownItem
                                        style={{ cursor: "pointer" }}
                                        onClick={e => {
                                            e.preventDefault()
                                            changePermission(id, permission.module_id, 1)
                                        }}
                                    >Sólo lectura</DropdownItem>
                                    <DropdownItem
                                        style={{ cursor: "pointer" }}
                                        onClick={e => {
                                            e.preventDefault()
                                            changePermission(id, permission.module_id, 2)
                                        }}
                                    >Lectura e inserción</DropdownItem>
                                    <DropdownItem
                                        style={{ cursor: "pointer" }}
                                        onClick={e => {
                                            e.preventDefault()
                                            changePermission(id, permission.module_id, 3)
                                        }}
                                    >Control total</DropdownItem>
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                        </InputGroup>
                    </Row>
                )
            })
            }
        </>
    )
}
export default ModuleItem