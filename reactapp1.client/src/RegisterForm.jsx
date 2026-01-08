import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { NavLink, useNavigate } from 'react-router-dom';
import contactImage from './assets/R.jpeg';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    document.title = "Register";

    const navigate = useNavigate();

    // Redirect if user is already registered
    useEffect(() => {
        const user = localStorage.getItem("User");
        if (user) {
            navigate("/");
        }
    }, [navigate]);

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    // Initialize toast container
    useEffect(() => {
        return () => toast.dismiss();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        // Reset any previous errors
        toast.dismiss();

        const today = new Date();
        const selectedDate = new Date(dateOfBirth);

        if (selectedDate > today) {
            toast.error('Date of Birth cannot be in the future.');
            setIsSubmitting(false);
            return;
        }
        
        // Check password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 6 characters long, contain one uppercase letter, and one special character.');
            setIsSubmitting(false);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            setIsSubmitting(false);
            return;
        }

        const userData = {
            Username: username,
            FirstName: fullName,
            LastName: lastName,
            Email: email,
            Password: password,
            Ditelindja: dateOfBirth
        };

        try {
            // API call to backend for registration
            const token = localStorage.getItem("token");
            const response = await axios.post(
                'https://localhost:7107/api/User/register',
                userData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = response.data;

            if (typeof data === "string" && data.includes("User Registered")) {
                console.log('Registration successful');
                if (data.token && data.token.split('.').length === 3) {
                    localStorage.setItem("token", data.token);
                } else {
                    console.error('Invalid token received');
                }
                document.location = "/login"; // Redirect to login page
            } else {
                console.error('Registration failed:', data.message || data);
                setErrorMessage(data.message || 'Registration failed. Please try again.');
            }

        } catch (error) {
            console.error('Registration failed:', error);
            setErrorMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-form-container" style={{
            backgroundImage: `url(${contactImage})`,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
            }}>
                <MDBCard className='p-3' style={{
                    maxWidth: '400px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                }}>
                    <MDBCardBody className='px-4 py-3'>
                        <h2 className="text-uppercase text-center mb-2" style={{ fontSize: '1.3rem' }}>Create an account</h2>
                        <form onSubmit={handleRegister}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <MDBInput
                                    placeholder='Username'
                                    id='form1'
                                    type='text'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <MDBInput
                                    placeholder='Full Name'
                                    id='form2'
                                    type='text'
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <MDBInput
                                    placeholder='Last Name'
                                    id='form3'
                                    type='text'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <MDBInput
                                    placeholder='Your Email'
                                    id='form4'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <MDBInput
                                    placeholder='Password'
                                    id='form5'
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <MDBInput
                                    placeholder='Repeat your password'
                                    id='form6'
                                    type='password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <MDBInput
                                    placeholder='Date of Birth'
                                    id='form7'
                                    type='date'
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    required
                                    style={{ fontSize: '0.9rem' }}
                                />

                                {/* Error messages are now shown via toast notifications */}

                                <MDBBtn
                                    className='register-btn'
                                    size='lg'
                                    type='submit'
                                    style={{
                                        width: '120px',
                                        height: '40px',
                                        alignSelf: 'center',
                                        fontSize: '0.9rem',
                                    }}
                                >Register</MDBBtn>
                            </div>
                        </form>
                        <NavLink to="/LoginForm" className="text-center d-block mt-2" style={{ color: 'green', fontSize: '0.9rem' }}>Already have an account? Log in here</NavLink>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </div>
    );
}

export default Register;
