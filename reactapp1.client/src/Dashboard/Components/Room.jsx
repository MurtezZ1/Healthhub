import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";

const Room = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        pacientId: "",
        pacientName: "",
        dhomaId: "",
        roomNumber: "",
        roomType: "",
        roomCapacity: "",
        isAvailable: "true",
        checkInDate: "",
        checkOutDate: "",
    });
    const [patients, setPatients] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [assignmentsRaw, setAssignmentsRaw] = useState([]);

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingIndex(null);
        setFormData({
            pacientId: "",
            pacientName: "",
            dhomaId: "",
            roomNumber: "",
            roomType: "",
            roomCapacity: "",
            isAvailable: "true",
            checkInDate: "",
            checkOutDate: "",
        });
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            try {
                const patientsResponse = await fetch("https://localhost:7107/api/Pacienti", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                if (patientsResponse.ok) {
                    const patientsData = await patientsResponse.json();
                    setPatients(patientsData);
                } else {
                    const errorMsg = "Data could not be fetched.";
                    setError(errorMsg);
                    toast.error(errorMsg);
                    throw new Error(errorMsg);
                }
            } catch (error) {
                const errorMsg = `Error fetching data: ${error.message}`;
                console.error(errorMsg);
                setError(errorMsg);
                toast.error(errorMsg);
            }
        }
    };

    const fetchAssignments = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("https://localhost:7107/api/DhomaPacientit", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched assignments:", data);
                setAssignmentsRaw(data);
            } else {
                const errorMsg = `Failed to fetch assignments: ${response.status}`;
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = `Failed to fetch assignments: ${err.message}`;
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const fetchRooms = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("https://localhost:7107/api/Dhoma", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
                console.log('Fetched rooms:', data);
            } else {
                toast.error("Failed to fetch rooms");
            }
        } catch (err) {
            toast.error("Failed to fetch rooms");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (patients.length) {
            fetchAssignments();
        }
    }, [patients]);

    useEffect(() => {
        if (assignmentsRaw.length && patients.length) {
            const mapped = assignmentsRaw.map(assignment => {
                const patient = patients.find(p => p.id === assignment.pacientId || p.Id === assignment.pacientId);
                const room = rooms.find(r => String(r.id) === String(assignment.dhomaId));
                return {
                    ...assignment,
                    pacientName: patient ? `${patient.name} ${patient.surname}` : assignment.pacientId,
                    roomNumber: room ? room.nrDhomes : assignment.dhomaId
                };
            });
            console.log("Mapped assignments:", mapped);
            setAssignments(mapped);
        }
    }, [assignmentsRaw, patients, rooms]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const generateGuid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (!formData.pacientId || !formData.roomNumber || !formData.roomType || !formData.roomCapacity || !formData.checkInDate) {
            setError("Patient, Room, and Check-in Date are required.");
            return;
        }

        if (formData.checkOutDate && new Date(formData.checkOutDate) < new Date(formData.checkInDate)) {
            setError("Check-out date cannot be before the check-in date.");
            return;
        }

        const token = localStorage.getItem("token");
        const newAssignment = {
            Id: "",
            PacientId: formData.pacientId,
            DhomaId: formData.dhomaId,
            CheckInDate: formData.checkInDate,
            CheckOutDate: formData.checkOutDate,
            roomNumber: formData.roomNumber,
            roomType: formData.roomType,
            roomCapacity: formData.roomCapacity,
            isAvailable: formData.isAvailable === "true",
        };

        const occupancy = getRoomOccupancy();
        const selectedRoom = rooms.find(r => String(r.id) === String(formData.dhomaId));
        if (selectedRoom && occupancy[selectedRoom.id] >= selectedRoom.kapaciteti) {
            setError("This room is already at full capacity.");
            return;
        }

        try {
            await axios.post("https://localhost:7107/api/DhomaPacientit", newAssignment, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            fetchAssignments();
            handleCloseEditModal();
            toast.success('Room assignment added successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.title || "Failed to add assignment.";
            console.error("Error adding room assignment:", error);
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const assignmentId = formData.id;
        if (!assignmentId) {
            setError("Assignment ID not found.");
            return;
        }

        const updatedAssignment = {
            Id: assignmentId,
            PacientId: formData.pacientId,
            DhomaId: formData.dhomaId,
            CheckInDate: formData.checkInDate,
            CheckOutDate: formData.checkOutDate,
        };

        const token = localStorage.getItem("token");

        try {
            console.log("PUT URL:", `https://localhost:7107/api/DhomaPacientit/${assignmentId}`);
            console.log("PUT BODY:", updatedAssignment);
            await axios.put(
                `https://localhost:7107/api/DhomaPacientit/${assignmentId}`,
                updatedAssignment,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            fetchAssignments();
            handleCloseEditModal();
            toast.success('Room assignment updated successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.title || "Failed to update assignment.";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        const selectedAssignment = assignments[index];
        const selectedRoom = rooms.find(r => String(r.id) === String(selectedAssignment.dhomaId));

        setFormData({
            id: selectedAssignment.id || selectedAssignment.Id,
            pacientId: selectedAssignment.pacientId,
            pacientName: selectedAssignment.pacientName,
            dhomaId: selectedAssignment.dhomaId,
            roomNumber: selectedRoom ? selectedRoom.nrDhomes : "",
            roomType: selectedRoom ? selectedRoom.lloji_Dhomes : "",
            roomCapacity: selectedRoom ? selectedRoom.kapaciteti : "",
            isAvailable: selectedRoom ? (selectedRoom.available ? "true" : "false") : "true",
            checkInDate: selectedAssignment.checkInDate,
            checkOutDate: selectedAssignment.checkOutDate !== "N/A" ? selectedAssignment.checkOutDate : "",
        });

        setShowEditModal(true);
    };

    const handleDelete = async (index) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            const token = localStorage.getItem("token");
            const assignmentId = assignments[index]?.id || assignments[index]?.Id;
            console.log("Deleting assignment with ID:", assignmentId);
            if (!assignmentId) {
                toast.error("Assignment ID not found.");
                return;
            }
            try {
                await axios.delete(`https://localhost:7107/api/DhomaPacientit/${assignmentId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                fetchAssignments();
                toast.success('Room assignment deleted successfully!');
            } catch (error) {
                toast.error("Failed to delete assignment.");
            }
        }
    };

    const availablePatients = patients.filter(
        (patient) => !assignments.some((assignment) => assignment.pacientId === patient.id)
    );

    const handleRoomChange = (e) => {
        const selectedId = e.target.value;
        const selectedRoom = rooms.find(r => String(r.id) === String(selectedId));
        setFormData(prev => ({
            ...prev,
            dhomaId: selectedRoom ? selectedRoom.id : "",
            roomNumber: selectedRoom ? selectedRoom.nrDhomes : "",
            roomType: selectedRoom ? selectedRoom.lloji_Dhomes : "",
            roomCapacity: selectedRoom ? selectedRoom.kapaciteti : "",
            isAvailable: selectedRoom ? (selectedRoom.available ? "true" : "false") : "true"
        }));
    };

    // Returns a map: { roomId: numberOfAssignments }
    const getRoomOccupancy = () => {
        const occupancy = {};
        assignments.forEach(a => {
            if (!occupancy[a.dhomaId]) occupancy[a.dhomaId] = 0;
            occupancy[a.dhomaId]++;
        });
        return occupancy;
    };

    const occupancy = getRoomOccupancy();

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f6f7" }}>
            <Sidebar userType="doctor" />
            <div style={{ flex: 1, padding: "20px" }}>
                <Container>
                    <h3 className="dashboard-title">Room Assignments</h3>
                    <Row>
                        <Col xs={12} md={6}>
                            <h4>Add New Room Assignment</h4>
                            <Form onSubmit={handleSubmitAdd}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Patient</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="pacientId"
                                        value={formData.pacientId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Patient</option>
                                        {availablePatients.map((patient) => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name} {patient.surname}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room Number</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="dhomaId"
                                        value={formData.dhomaId || ""}
                                        onChange={handleRoomChange}
                                        required
                                    >
                                        <option value="">Select Room</option>
                                        {rooms.map(room => {
                                            const isFull = occupancy[room.id] >= room.kapaciteti;
                                            return (
                                                <option key={room.id} value={room.id} disabled={isFull}>
                                                    {room.nrDhomes} {isFull ? "(Full)" : ""}
                                                </option>
                                            );
                                        })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roomType"
                                        value={formData.roomType || ""}
                                        readOnly
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="roomCapacity"
                                        value={formData.roomCapacity !== undefined && formData.roomCapacity !== null ? formData.roomCapacity : ""}
                                        readOnly
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Is Available?</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="isAvailable"
                                        value={formData.isAvailable || "true"}
                                        readOnly
                                        required
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Check-in Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="checkInDate"
                                        value={formData.checkInDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Check-out Date (Optional)</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="checkOutDate"
                                        value={formData.checkOutDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Add Assignment
                                </Button>
                            </Form>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </Col>
                        <Col xs={12} md={6}>
                            <h4>Current Room Assignments</h4>
                            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
                                <Table striped bordered hover responsive="sm" size="sm">
                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Room</th>
                                            <th>Check-in Date</th>
                                            <th>Check-out Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.length > 0 ? (
                                            assignments.map((assignment, index) => (
                                                <tr key={index}>
                                                    <td>{assignment.pacientName}</td>
                                                    <td>{assignment.roomNumber}</td>
                                                    <td>{assignment.checkInDate ? dayjs(assignment.checkInDate).format("DD-MM-YYYY") : ""}</td>
                                                    <td>{assignment.checkOutDate ? dayjs(assignment.checkOutDate).format("DD-MM-YYYY") : ""}</td>
                                                    <td>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEdit(index)}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(index)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No room assignments available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Room Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Check-in Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate ? dayjs(formData.checkInDate).format("YYYY-MM-DD") : ""}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Check-out Date (Optional)</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkOutDate"
                                value={formData.checkOutDate ? dayjs(formData.checkOutDate).format("YYYY-MM-DD") : ""}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Assignment
                        </Button>
                    </Form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Room;