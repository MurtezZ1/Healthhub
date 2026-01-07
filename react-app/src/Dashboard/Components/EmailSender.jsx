import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

function EmailSender() {
    const [showA, setShowA] = useState(true);
    const [showB, setShowB] = useState(true);

    const toggleShowA = () => setShowA(!showA);
    const toggleShowB = () => setShowB(!showB);

    return (
        <Row>
            <Col md={6} className="mb-2">

                <Toast show={showA} onClose={toggleShowA}> 
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Success</strong>
                        <small>1 second ago</small>
                    </Toast.Header>
                    <Toast.Body>Email Send Succesfully!</Toast.Body>
                </Toast>
            </Col>
            
        </Row>
    );
}

export default EmailSender;