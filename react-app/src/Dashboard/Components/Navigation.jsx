import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navigation() {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Get the user's email from localStorage after login
        const email = localStorage.getItem('email');
        if (email) {
            setUserEmail(email);
        }
    }, []);

    return (
        <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>Medical</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Dropdown>
                        {/* Dropdown content can go here */}
                    </Dropdown>
                    <Navbar.Text>
                        Signed in as: <a>{userEmail || 'Guest'}</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
