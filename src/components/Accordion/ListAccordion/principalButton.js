import React from 'react';
import { Button, Col, Row } from 'reactstrap';

const PrincipalButtonAccordion = ({ name }) => {
    return (<>
        <Row>
            <Col md="12" className="p-3" style={{ border: "5px solid #073863", backgroundColor: "#e6e6e6" }}>
                <Row>
                    <Col md="6">
                        <h2 className="mt-2" style={{ color: "#073863", fontWeight: "bold" }}>{name}</h2>
                    </Col>
                    <Col md="6" className="text-right">
                        <Button color="primary">
                            <i className="fa fa-plus"></i>
                        </Button>
                        <Button color="primary">
                            <i className="fa fa-caret-down"></i>
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>)
}

export default PrincipalButtonAccordion