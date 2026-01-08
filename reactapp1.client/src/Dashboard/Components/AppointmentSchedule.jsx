import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentSchedule = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [newAppointment, setNewAppointment] = useState({
        pacientId: "",
        dataTerminit: null,
        statusi: "Planned"
    });
    const [loading, setLoading] = useState({
        doctors: false,
        submitting: false
    });
    
    // Initialize toast container
    useEffect(() => {
        // This ensures the toast container is available
        return () => toast.dismiss();
    }, []);

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const pacientId = decoded.uid || decoded.sub || decoded.pacientId || decoded.nameid;
            if (!pacientId) throw new Error("No user ID in token");
            return pacientId;
        } catch (err) {
            console.error("Token decoding error:", err);
            throw err;
        }
    };

    const groupDoctorsBySpecialization = () => {
        const grouped = {};
        doctors.forEach(doctor => {
            const spec = doctor.Specializimi || 'Other';
            if (!grouped[spec]) {
                grouped[spec] = [];
            }
            grouped[spec].push(doctor);
        });
        return grouped;
    };

    const doctorsGrouped = groupDoctorsBySpecialization();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const loadData = async () => {
            try {
                const pacientId = decodeToken(token);
                setNewAppointment(prev => ({ ...prev, pacientId }));

                setLoading(prev => ({ ...prev, doctors: true }));
                await fetchDoctors(token);
            } catch (err) {
                toast.error("Session expired. Please login again.");
                navigate("/login");
            } finally {
                setLoading(prev => ({ ...prev, doctors: false }));
            }
        };

        loadData();
    }, [navigate]);

    const fetchDoctors = async (token) => {
        try {
            const response = await axios.get("https://localhost:7107/api/Mjeku", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const validatedDoctors = response.data.map(doctor => ({
                Id: doctor.id || doctor.Id,
                Name: doctor.name || doctor.Name,
                Specializimi: doctor.specializimi || doctor.Specializimi || 'No Specialization',
                NumriLicences: doctor.numriLicences || doctor.NumriLicences
            }));

            setDoctors(validatedDoctors);
        } catch (err) {
            console.error("Failed to fetch doctors:", err);
            toast.error("Failed to load doctors list. Please try again later.");
        }
    };

    const handleAddAppointment = async () => {
        const token = localStorage.getItem("token");

        if (!selectedDoctorId) {
            toast.error("Please select a doctor");
            return;
        }

        if (!newAppointment.dataTerminit) {
            toast.error("Please select appointment date and time");
            return;
        }

        const appointmentDate = new Date(newAppointment.dataTerminit);
        const hours = appointmentDate.getHours();
        const day = appointmentDate.getDay();

        if (day === 0 || day === 6) {
            toast.error("Appointments are only available on weekdays (Monday-Friday)");
            return;
        }

        if (hours < 8 || hours >= 17) {
            toast.error("Appointments are only available between 8AM and 5PM");
            return;
        }

        if (appointmentDate < new Date()) {
            toast.error("Appointment time must be in the future");
            return;
        }

        setLoading(prev => ({ ...prev, submitting: true }));

        try {
            const generateGuid = () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };

            const generatedId = generateGuid();

            // Only verify doctor exists (removed patient verification)
            const doctorResponse = await axios.get(`https://localhost:7107/api/Mjeku/${selectedDoctorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!doctorResponse.data) throw new Error("Doctor not found");

            console.log("Token being sent:", token);

            const patientResponse = await axios.get(
                `https://localhost:7107/api/Pacienti/byUserId/${newAppointment.pacientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const pacientId = patientResponse.data.id;

            const appointmentData = {
                Id: generatedId,
                PacientId: pacientId,
                DoktorId: selectedDoctorId,
                DataTerminit: newAppointment.dataTerminit, // Send as is, avoid toISOString()
                Statusi: "Planned"
            };

            console.log("Appointment Data:", appointmentData);

            await axios.post("https://localhost:7107/api/Termini", appointmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSelectedDoctorId("");
            setNewAppointment(prev => ({ ...prev, dataTerminit: "" }));
            toast.success("Appointment scheduled successfully!");
        } catch (err) {
            console.error("Appointment error:", err.response?.data || err.message);
            if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                toast.error(errorMessages.join(', '));
            } else {
                toast.error(err.response?.data?.title || "Failed to schedule appointment. Please try again.");
            }
        } finally {
            setLoading(prev => ({ ...prev, submitting: false }));
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Appointment Schedule</h2>

            {/* Toast container is already included in App.js */}

            <h3 className="mb-4">Schedule New Appointment</h3>
            <Alert variant="info" className="mb-4">
                <strong>Appointment Scheduling Rules:</strong>
                <ul className="mb-0">
                    <li>Available Monday�Friday only (no weekends)</li>
                    <li>Working hours: 8AM � 5PM</li>
                    <li>Must schedule at least 1 hour in advance (example 11:00,12:00,13:00)</li>
                    <li>Appointments are in 30-minute increments</li>
                </ul>
            </Alert>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Select Doctor by Specialization</Form.Label>
                    {loading.doctors ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        <Form.Select
                            value={selectedDoctorId}
                            onChange={(e) => {
                                setSelectedDoctorId(e.target.value);
                                setError("");
                            }}
                            required
                            disabled={loading.doctors || loading.submitting}
                        >
                            <option value="">Choose a doctor...</option>
                            {Object.entries(doctorsGrouped).map(([specialization, specDoctors]) => (
                                <optgroup label={specialization} key={`spec-${specialization}`}>
                                    {specDoctors.map(doctor => (
                                        <option key={`doctor-${doctor.Id}`} value={doctor.Id}>
                                            {doctor.Name} - {doctor.Specializimi}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </Form.Select>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Appointment Date & Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={newAppointment.dataTerminit || ""}
                        onChange={(e) => {
                            setNewAppointment({
                                ...newAppointment,
                                dataTerminit: e.target.value
                            });
                            setError("");
                        }}
                        required
                        disabled={loading.submitting}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={handleAddAppointment}
                    disabled={!selectedDoctorId || !newAppointment.dataTerminit || loading.submitting}
                >
                    {loading.submitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> Scheduling...
                        </>
                    ) : (
                        "Schedule Appointment"
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default AppointmentSchedule;
