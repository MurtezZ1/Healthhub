import React, { useState } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { NavLink, useNavigate } from 'react-router-dom';
import contactImage from './assets/R.jpeg';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const userData = { email, password };

        try {
            // Update the URL to the correct endpoint
            const response = await fetch('https://localhost:7107/api/User/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Login failed:', errorText);
                setErrorMessage('Login failed. Please check your email and password.');
                return;
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Save tokens, roles, and email in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('userRoles', JSON.stringify(data.roles || []));
            localStorage.setItem('email', email); // Store the email in localStorage

            setSuccessMessage(data.message || 'Login successful!');

            const roles = data.roles || [];
            const redirectPath = roles.includes('Doctor') ? '/' : '/'; // Adjust the redirect based on roles if needed
            navigate(redirectPath); // Use navigate to redirect
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundImage: `url(${contactImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
        >
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                <MDBCard
                    style={{
                        minWidth: '26rem',  // Increase the width of the card
                        borderRadius: '15px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <MDBCardBody className="px-5 py-4" >
                        <h2 className="text-uppercase text-center mb-3">Log In</h2>
                        <form onSubmit={handleLogin}>
                            <MDBInput
                                placeholder="Your Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    marginBottom: '1.5rem',
                                    padding: '15px',
                                    fontSize: '1.1rem',
                                    borderRadius: '8px',
                                }}
                                required
                            />
                            <MDBInput
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    marginBottom: '1.5rem',
                                    padding: '15px',
                                    fontSize: '1.1rem',
                                    borderRadius: '8px',
                                }}
                                required
                            />

                            {errorMessage && (
                                <div className="text-danger mb-2" style={{ fontSize: '0.9rem' }}>
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="text-success mb-2" style={{ fontSize: '0.9rem' }}>
                                    {successMessage}
                                </div>
                            )}

                            <MDBBtn
                                size="lg"
                                type="submit"
                                style={{
                                    width: '100%',
                                    height: '60px',
                                    fontSize: '1.2rem',
                                    backgroundColor: '#007bff',
                                    borderRadius: '8px',
                                }}
                            >
                                Login
                            </MDBBtn>
                        </form>

                        <NavLink
                            to="/ForgotPassword"
                            className="text-center d-block mt-3"
                            style={{ color: 'green', fontSize: '1rem' }}
                        >
                            Forgot Password?
                        </NavLink>

                        <NavLink
                            to="/RegisterForm"
                            className="text-center d-block mt-2"
                            style={{ color: 'blue', fontSize: '1rem' }}
                        >
                            Don't have an account? Register here
                        </NavLink>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </div>
    );
};

export default LoginForm;
