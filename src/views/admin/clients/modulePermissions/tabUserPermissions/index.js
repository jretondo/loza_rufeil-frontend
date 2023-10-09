import React, { useEffect, useState } from 'react';
import { Nav, TabContent } from 'reactstrap';
import NavClient from './navClient';
import TabClient from './tabClient';

const TabUserPermission = ({ permissionsList, setPermissionsList }) => {
    const [moduleActive, setModuleActive] = useState(0)
    const [navClients, setNavClients] = useState(<></>)
    const [tabsClients, setTabsClients] = useState(<></>)

    const changePermission = (moduleId, active) => {
        let newPermissionsList = permissionsList.map(module => {
            if (module.module_id === moduleId) {
                module.active = active
            }
            return module
        }
        )
        setPermissionsList(() => newPermissionsList)
    }
    useEffect(() => {
        let navClient = <></>
        let tabClient = <></>
        // eslint-disable-next-line
        permissionsList.map((module, key) => {
            navClient = <>
                {navClient}
                <NavClient
                    key={key}
                    id={module.module_id}
                    moduleName={module.name}
                    moduleActive={moduleActive}
                    setModuleActive={setModuleActive}
                    active={module.active}
                />
            </>
            tabClient = <>
                {tabClient}
                <TabClient
                    key={key}
                    id={module.module_id}
                    module={module}
                    changePermission={changePermission}
                /></>
        })

        setNavClients(navClient)
        setTabsClients(tabClient)
        // eslint-disable-next-line
    }, [moduleActive, permissionsList])

    return (<>
        <Nav tabs>
            {navClients}
        </Nav>
        <TabContent activeTab={moduleActive}>
            {tabsClients}
        </TabContent>
    </>)
}

export default TabUserPermission