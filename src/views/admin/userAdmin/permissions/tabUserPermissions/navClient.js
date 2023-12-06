import classNames from 'classnames';
import React from 'react';
import { NavItem, NavLink } from 'reactstrap';

const NavClient = ({ id, business_name, clientActive, setClientActive, permissions }) => {
    const hasPermission = permissions.some(permission => permission.permission_grade_id > 0)

    return (
        <NavItem style={{ cursor: "pointer" }} key={id}>
            <NavLink
                className={classNames({ active: clientActive === id })}
                style={
                    clientActive === id ?
                        { background: "#073863", color: "white" } :
                        !hasPermission ? { background: "#959595", color: "white" } :
                            hasPermission ? { background: "#2dce89" } : null
                }
                onClick={() => setClientActive(id)}
            >
                {clientActive === id ? business_name : business_name.length > 10 ? business_name.slice(0, 10) + "..." : business_name}
            </NavLink>
        </NavItem>
    )
}

export default NavClient