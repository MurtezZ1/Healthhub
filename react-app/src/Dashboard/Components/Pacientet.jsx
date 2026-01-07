import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from "./Sidebar.jsx";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pacientet = () => {
    const [show, setShow] = useState(false);
    const [Id, setId] = useState("");
    const [Name, setName] = useState("");
    const [Surname, setSurname] = useState("");
    const [Ditelindja, setDitelindja] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
        clearForm();
    };

    const handleShow = () => setShow(true);

    const decodeJWT = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        return JSON.parse(decoded);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            try {
                const decoded = decodeJWT(token);
                console.log(decoded);
                getData(decoded.id);
            } catch (error) {
                console.error("Invalid token", error);
                navigate("/login");
            }
        }
    }, [navigate]);

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    const getData = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`https://localhost:7107/api/Pacienti?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setData(response.data);
        } catch (error) {
            const errorMsg = `Error fetching patient data: ${error.response?.data?.title || error.message}`;
            console.error(errorMsg);
            toast.error(errorMsg);
        }
    };

    const clearForm = () => {
        setId("");
        setName("");
        setSurname("");
        setDitelindja("");
    };

    const handleAddPatient = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("User not authenticated. Please log in.");
            return;
        }

        const decoded = decodeJWT(token);
        const userId = decoded.id || decoded.uid;

        const today = new Date();
        const dob = new Date(Ditelindja);
        if (dob > today) {
            toast.error("Date of Birth cannot be in the future.");
            return;
        }

        const newPatientId = uuidv4();

        const payload = { Id: newPatientId, Name, Surname, Ditelindja };
        console.log("Payload to send:", payload);

        if (!Name || !Surname || !Ditelindja) {
            toast.error("Please fill out all required fields.");
            return;
        }

        try {
            const response = await axios.post("https://localhost:7107/api/Pacienti/Add-Patient", payload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const existingPatients = JSON.parse(localStorage.getItem('patients')) || [];
            existingPatients.push({ id: newPatientId, name: Name, surname: Surname, ditelindja: Ditelindja });
            localStorage.setItem('patients', JSON.stringify(existingPatients));

            getData(userId);
            clearForm();
            toast.success("Patient added successfully!");
        } catch (error) {
            console.error("Error adding patient:", error);
            const errorMessage = error.response?.data?.title || error.response?.data || error.message;
            toast.error(`Error adding patient: ${errorMessage}`);
        }
    };

    const handleEdit = (patient) => {
        console.log("Editing patient:", patient);
        setId(patient.id);
        setName(patient.name);
        setSurname(patient.surname);
        setDitelindja(formatDate(patient.ditelindja));
        handleShow();
    };

    const handleUpdatePatient = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("User not authenticated. Please log in.");
            return;
        }

        const decoded = decodeJWT(token);

        const today = new Date();
        const dob = new Date(Ditelindja);
        if (dob > today) {
            toast.error("Date of Birth cannot be in the future.");
            return;
        }

        const updatedPatient = { Id, Name, Surname, Ditelindja };
        console.log("Updating patient with payload:", updatedPatient);

        try {
            const response = await axios.post(
                `https://localhost:7107/api/Pacienti/Update-Pacienti?id=${Id}`,
                updatedPatient,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Patient updated successfully");
            handleClose();
            getData(decoded.id);
            toast.success("Patient updated successfully!");
        } catch (error) {
            console.error("Error updating patient:", error);
            const errorMessage = error.response?.data?.title || error.response?.data || error.message;
            toast.error(`Error updating patient: ${errorMessage}`);
        }
    };

    const handleDelete = async (id) => {
        console.log("Deleting patient with ID:", id);
        if (window.confirm("Are you sure you want to delete this patient?")) {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("User not authenticated. Please log in.");
                return;
            }

            const decoded = decodeJWT(token);

            try {
                const response = await axios.delete(`https://localhost:7107/api/Pacienti/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    console.log("Patient deleted successfully");
                    toast.success("Patient deleted successfully!");
                    getData(decoded.id);
                } else {
                    console.error("Failed to delete patient:", response.statusText);
                    toast.error("Error deleting patient.");
                }
            } catch (error) {
                const errorMsg = error.response?.data?.title || "Error deleting patient";
                console.error("Error deleting patient:", error);
                toast.error(errorMsg);
            }
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6f7' }}>
            <Sidebar userType="doctor" />
            <div style={{ flex: 1, padding: '20px' }}>
                <Container>
                    <h4 className="dashboard-title">Patients</h4>
                    <Row>
                        <Col xs={12} md={6}>
                            <h3>Add New Patient</h3>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Emri</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Emri"
                                        value={Name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mbiemri</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Mbiemri"
                                        value={Surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Viti i Lindjes</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Enter Viti Lindjes"
                                        value={Ditelindja}
                                        onChange={(e) => setDitelindja(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="success" onClick={handleAddPatient}>
                                    Add Patient
                                </Button>
                            </Form>
                        </Col>
                        <Col xs={12} md={6}>
                            <h3>Patient List</h3>
                            <div style={{
                                maxHeight: '500px',
                                overflowY: 'auto',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                            }}>
                                <Table striped bordered hover responsive="sm" size="sm" style={{ marginBottom: '0' }}>
                                    <thead style={{
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: 'white',
                                        zIndex: 1,
                                        boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)'
                                    }}>
                                        <tr>
                                            <th>Id</th>
                                            <th>Emri</th>
                                            <th>Mbiemri</th>
                                            <th>Ditelindja</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.surname}</td>
                                                    <td>{formatDate(item.ditelindja)}</td>
                                                    <td>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEdit(item)}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center" }}>
                                                    No data available or failed to load data.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Patient</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Emri</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Emri"
                                    value={Name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mbiemri</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Mbiemri"
                                    value={Surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Viti i Lindjes</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Enter Viti Lindjes"
                                    value={Ditelindja}
                                    onChange={(e) => setDitelindja(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleUpdatePatient}>
                                Update Patient
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Pacientet;