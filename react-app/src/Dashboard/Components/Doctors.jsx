import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Sidebar from "./Sidebar";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Doctors = () => {
    const [mjeket, setMjeket] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMjeku, setCurrentMjeku] = useState({
        id: "",
        specializimi: "",
        numriLicences: "",
    });
    const [isEdit, setIsEdit] = useState(false);

    const apiUrl = "https://localhost:7107/api/Mjeku";

    const fetchMjeket = async () => {
        try {
            const response = await axios.get(apiUrl);
            setMjeket(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchMjeket();
    }, []);

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await axios.put(`${apiUrl}/${currentMjeku.id}`, currentMjeku);
            } else {
                await axios.post(apiUrl, currentMjeku);
            }
            setShowModal(false);
            fetchMjeket();
        } catch (error) {
            console.error("Error saving data", error);
        }
    };

    const deleteMjeku = async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            fetchMjeket();
        } catch (error) {
            console.error("Error deleting data", error);
        }
    };

    const openModal = (mjeku = { id: "", specializimi: "", numriLicences: "" }) => {
        setCurrentMjeku(mjeku);
        setIsEdit(!!mjeku.id);
        setShowModal(true);
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar userType="admin" />

            {/* Content */}
            <div className="container mt-4" style={{ flex: 1 }}>
                <h2>Doctors</h2>
                <Button onClick={() => openModal()}>Add New Doctor</Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Specialization</th>
                            <th>License Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mjeket.map((mjeku) => (
                            <tr key={mjeku.id}>
                                <td>{mjeku.id}</td>
                                <td>{mjeku.specializimi}</td>
                                <td>{mjeku.numriLicences}</td>
                                <td>
                                    <IconButton
                                        color="primary"
                                        onClick={() => openModal(mjeku)}
                                        sx={{ mr: 1 }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => deleteMjeku(mjeku.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Modal for Create/Update */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEdit ? "Update Doctor" : "Add New Doctor"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="ID"
                                    value={currentMjeku.id}
                                    onChange={(e) =>
                                        setCurrentMjeku({ ...currentMjeku, id: e.target.value })
                                    }
                                    disabled={isEdit}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Specialization</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Specialization"
                                    value={currentMjeku.specializimi}
                                    onChange={(e) =>
                                        setCurrentMjeku({
                                            ...currentMjeku,
                                            specializimi: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>License Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="License Number"
                                    value={currentMjeku.numriLicences}
                                    onChange={(e) =>
                                        setCurrentMjeku({
                                            ...currentMjeku,
                                            numriLicences: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Doctors;