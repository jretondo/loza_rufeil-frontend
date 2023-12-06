import React, { useEffect, useState } from 'react';
import { Nav, TabContent } from 'reactstrap';
import NavClient from './navClient';
import TabClient from './tabClient';

const TabUserPermission = ({ permissionsList, setPermissionsList }) => {
    const [clientActive, setClientActive] = useState(0)
    const [navClients, setNavClients] = useState(<></>)
    const [tabsClients, setTabsClients] = useState(<></>)

    const changePermission = (clientId, moduleId, grade) => {
        let newPermissionsList = permissionsList.map(client => {
            if (client.client_id === clientId) {
                client.permissions.map(permission => {
                    if (permission.module_id === moduleId) {
                        permission.permission_grade_id = grade
                    }
                    return permission
                })
            }
            return client
        }
        )
        setPermissionsList(() => newPermissionsList)
    }
    useEffect(() => {
        let navClient = <></>
        let tabClient = <></>
        // eslint-disable-next-line
        permissionsList.map((client, key) => {
            navClient = <>
                {navClient}
                <NavClient
                    key={key}
                    id={client.client_id}
                    business_name={client.business_name}
                    clientActive={clientActive}
                    setClientActive={setClientActive}
                    permissions={client.permissions}
                />
            </>
            tabClient = <>
                {tabClient}
                <TabClient
                    key={key}
                    id={client.client_id}
                    client={client}
                    changePermission={changePermission}
                /></>
        })

        setNavClients(navClient)
        setTabsClients(tabClient)
        // eslint-disable-next-line
    }, [clientActive, permissionsList])

    return (<>
        <Nav tabs>
            {navClients}
        </Nav>
        <TabContent activeTab={clientActive}>
            {tabsClients}
        </TabContent>
    </>)
}

export default TabUserPermission