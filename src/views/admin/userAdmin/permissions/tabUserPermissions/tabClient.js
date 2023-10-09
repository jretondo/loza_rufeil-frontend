import React from 'react';
import { Col, Row, TabPane } from 'reactstrap';
import ModuleItem from './moduleItem';

const TabClient = ({ id, client, changePermission }) => {

    return (
        <TabPane tabId={id} className="p-5" style={{ background: "#073863" }}>
            <Row className="pt-4">
                <Col md="12" className="text-center">
                    <ModuleItem
                        module={module}
                        changePermission={changePermission}
                        client={client}
                        id={id}
                    />
                </Col>
            </Row>
        </TabPane>
    )
}

export default TabClient