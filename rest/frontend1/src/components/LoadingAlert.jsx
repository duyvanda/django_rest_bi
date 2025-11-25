import React from 'react';
import { Row, Col, Button, Modal, Alert, Spinner } from 'react-bootstrap';
// Note: Row, Col, Link, useLocation are not used in this specific component, 
// but kept in the import list for reference if you expand it later.
import { Link, useLocation } from 'react-router-dom'; 

const LoadingAlert = ({ loading, alert, alertType, alertText, SetAlert }) => {
    
    // Check if the modal should be shown (based on 'loading' state)
    // You could also use 'alert' state here if you want the Modal to only show the alert.
    const showModal = loading || alert; 

    return (
        <Modal show={showModal} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
            {/* The Modal body content */}
            <Modal.Body className="text-center">
                {/* 1. Show Spinner/Loading Button if 'loading' is true */}
                {loading && (
                    <Button variant="secondary" disabled> 
                        <Spinner animation="grow" size="sm"/> 
                        <span className="ms-2">Đang tải...</span>
                    </Button>
                )}

                {/* 2. Show Alert if 'alert' is true */}
                {alert && (
                    <Alert
                        variant={alertType}
                        // Corrected the function name to SetAlert (camelCase)
                        onClose={() => SetAlert(false)} 
                        dismissible
                        className="mt-2 text-start"
                    >
                        <Alert.Heading as="h6" className="mb-1">
                            <strong>Cảnh Báo: </strong>
                        </Alert.Heading>
                        {alertText}
                    </Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default LoadingAlert;