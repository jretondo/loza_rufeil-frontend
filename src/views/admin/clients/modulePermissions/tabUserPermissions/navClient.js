import classNames from 'classnames';
import React from 'react';
import { NavItem, NavLink } from 'reactstrap';

const NavClient = ({ id, moduleName, moduleActive, setModuleActive, active }) => {

    return (
        <NavItem style={{ cursor: "pointer" }} key={id}>
            <NavLink
                className={classNames({ active: moduleActive === id })}
                style={
                    moduleActive === id ?
                        { background: "#073863", color: "white" } :
                        active ? { background: "#2dce89", color: "white" } :
                            { background: "#fb6340" }
                }
                onClick={() => setModuleActive(id)}
            >
                {moduleName}
            </NavLink>
        </NavItem>
    )
}

export default NavClient