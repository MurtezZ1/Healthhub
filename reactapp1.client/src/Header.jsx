import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import AppointmentSchedule from './Dashboard/Components/AppointmentSchedule.jsx'; // Import your AppointmentSchedule component
import PropTypes from 'prop-types';
import './Header.css';

const Header = () => {
    const [isDoctor, setIsDoctor] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];
        setIsDoctor(userRoles.includes('Doctor'));
        setIsAdmin(userRoles.includes('Administrator'));
        setIsUser(!userRoles.includes('Doctor') && !userRoles.includes('Administrator'));
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRoles');
        setIsDoctor(false);
        setIsAdmin(false);
        setIsUser(false);
        navigate('/');
    };

    const handleMakeAppointment = () => {
        setShowAppointmentModal(true);
    };

    const handleCloseAppointmentModal = () => {
        setShowAppointmentModal(false);
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
                <Container fluid>
                    <Navbar.Brand href="#/">Medical</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" className="nav-item">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/AboutUs" className="nav-item">About</Nav.Link>
                            <Nav.Link as={NavLink} to="/OurDoctors" className="nav-item">Our Doctors</Nav.Link>
                            <Nav.Link as={NavLink} to="/Contact" className="nav-item">Contact</Nav.Link>

                            {isAdmin && (
                                <Nav.Link as={NavLink} to="/AdminDashboard" className="nav-item">Admin Dashboard</Nav.Link>
                            )}

                            {isDoctor && (
                                <Nav.Link as={NavLink} to="/Dashboard" className="nav-item">Doctor Dashboard</Nav.Link>
                            )}

                            {token ? (
                                <Button variant="danger" onClick={handleLogout}>Log Out</Button>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/RegisterForm" className="nav-item">Register</Nav.Link>
                                    <Nav.Link as={NavLink} to="/LoginForm" className="nav-item">Login</Nav.Link>
                                </>
                            )}
                        </Nav>

                        {isUser && token && (
                            <Button variant="success" className="ms-2" onClick={handleMakeAppointment}>
                                Make an Appointment
                            </Button>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Appointment Scheduling Modal */}
            <Modal
                show={showAppointmentModal}
                onHide={handleCloseAppointmentModal}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Schedule New Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AppointmentSchedule onSuccess={handleCloseAppointmentModal} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAppointmentModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </header>
    );
};

Header.propTypes = {
    userRoles: PropTypes.array,
};

export default Header;