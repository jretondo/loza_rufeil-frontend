import classNames from 'classnames';
import React from 'react';
import { NavItem, NavLink } from 'reactstrap';

const NavClient = ({ id, business_name, clientActive, setClientActive, grade }) => {

    return (
        <NavItem style={{ cursor: "pointer" }} key={id}>
            <NavLink
                className={classNames({ active: clientActive === id })}
                style={
                    clientActive === id ?
                        { background: "#073863", color: "white" } :
                        grade === 0 ? { background: "#959595", color: "white" } :
                            grade === 1 ? { background: "#0da5c0" } :
                                grade === 2 ? { background: "#2dce89" } :
                                    grade === 3 ? { background: "#fb6340" } : null
                }
                onClick={() => setClientActive(id)}
            >
                {clientActive === id ? business_name : business_name.length > 10 ? business_name.slice(0, 10) + "..." : business_name}
            </NavLink>
        </NavItem>
    )
}

export default NavClient