import React, { useState } from 'react';
import LoadingContext from '.';
import { Col, Row, Spinner } from 'reactstrap';

const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)

    return (<LoadingContext.Provider value={{ setIsLoading }}>
        {
            isLoading &&
            <>
                <Row style={{ position: "fixed", zIndex: 9998, width: "100%", height: "100%", backgroundColor: "#ddd", opacity: 0.5 }}>
                </Row>
                <Row style={{ position: "fixed", zIndex: 9999, width: "100%", top: "30%" }}>
                    <Col md="12" style={{ textAlign: "center" }}>
                        <Spinner style={{ width: "250px", height: "250px" }} />
                        <h4 style={{ textAlign: "center", color: "#073863", fontWeight: "bold", fontSize: "20px" }}>Procesando...</h4>
                    </Col>
                </Row>
            </>

        }
        {children}
    </LoadingContext.Provider>)
}

export default LoadingProvider