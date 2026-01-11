
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import AppointmentSchedule from './Dashboard/Components/AppointmentSchedule.jsx';
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
        localStorage.clear();
        navigate('/');
    };

    return (
        <header>
            <Navbar expand="lg" className="green-navbar shadow">
                <Container fluid>
                    <Navbar.Brand as={NavLink} to="/" className="brand-text">
                        HealthHub
                    </Navbar.Brand>

                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" className="nav-item">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/AboutUs" className="nav-item">About</Nav.Link>
                            <Nav.Link as={NavLink} to="/OurDoctors" className="nav-item">Our Doctors</Nav.Link>
                            <Nav.Link as={NavLink} to="/Contact" className="nav-item">Contact</Nav.Link>

                            {isAdmin && (
                                <Nav.Link as={NavLink} to="/AdminDashboard" className="nav-item">
                                    Admin Dashboard
                                </Nav.Link>
                            )}

                            {isDoctor && (
                                <Nav.Link as={NavLink} to="/Dashboard" className="nav-item">
                                    Doctor Dashboard
                                </Nav.Link>
                            )}
                        </Nav>

                        <div className="d-flex align-items-center gap-2">
                            {isUser && token && (
                                <Button
                                    className="appointment-btn"
                                    onClick={() => setShowAppointmentModal(true)}
                                >
                                    Make Appointment
                                </Button>
                            )}

                            {token ? (
                                <Button variant="outline-light" onClick={handleLogout}>
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button as={NavLink} to="/LoginForm" variant="outline-light">
                                        Login
                                    </Button>
                                    <Button as={NavLink} to="/RegisterForm" variant="light">
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AppointmentSchedule onSuccess={() => setShowAppointmentModal(false)} />
                </Modal.Body>
            </Modal>
        </header>
    );
};

export default Header;

