import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./RoomManagement.css";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        nrDhomes: "",
        lloji_Dhomes: "",
        kapaciteti: "",
        available: true
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError("Authentication required. Please log in again.");
                return;
            }

            const response = await axios.get("https://localhost:7107/api/Dhoma", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (Array.isArray(response.data)) {
                setRooms(response.data);
            } else {
                throw new Error("Invalid data format: rooms should be an array");
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching rooms:", err);
            if (err.response?.status === 401) {
                setError("Authentication failed. Please log in again.");
            } else {
                setError("Failed to fetch rooms. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const roomData = {
                id: "",
                nrDhomes: formData.nrDhomes,
                lloji_Dhomes: formData.lloji_Dhomes,
                kapaciteti: parseInt(formData.kapaciteti),
                available: formData.available
            };

            console.log(roomData);

            await axios.post("https://localhost:7107/api/Dhoma", roomData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setShowAddForm(false);
            resetForm();
            fetchRooms();
        } catch (err) {
            console.error("Error adding room:", err);
            setError("Failed to add room. Please try again.");
        }
    };

    const handleEditRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const roomData = {
                id: editingRoom.id,
                nrDhomes: formData.nrDhomes,
                lloji_Dhomes: formData.lloji_Dhomes,
                kapaciteti: parseInt(formData.kapaciteti),
                available: formData.available
            };

            await axios.put(`https://localhost:7107/api/Dhoma/${editingRoom.id}`, roomData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setEditingRoom(null);
            resetForm();
            fetchRooms();
        } catch (err) {
            console.error("Error updating room:", err);
            setError("Failed to update room. Please try again.");
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://localhost:7107/api/Dhoma/${roomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            fetchRooms();
        } catch (err) {
            console.error("Error deleting room:", err);
            setError("Failed to delete room. Please try again.");
        }
    };

    const startEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            nrDhomes: room.nrDhomes,
            lloji_Dhomes: room.lloji_Dhomes,
            kapaciteti: room.kapaciteti.toString(),
            available: room.available
        });
    };

    const cancelEdit = () => {
        setEditingRoom(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ nrDhomes: "", lloji_Dhomes: "", kapaciteti: "", available: true });
    };

    return (
        <div className="d-flex" style={{ backgroundColor: "#f5f6f7" }}>
            <Sidebar userType="admin" />

            <div className="room-management">
                <div className="room-header">
                    <h2>Room Management</h2>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel Add' : 'Add New Room'}
                    </button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {/* Add Room Form */}
                {showAddForm && (
                    <div className="form-section">
                        <h3>Add New Room</h3>
                        <form onSubmit={handleAddRoom} className="room-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <TextField label="Room Number" value={formData.nrDhomes} onChange={(e) => setFormData({...formData, nrDhomes: e.target.value})} fullWidth />
                                </div>
                                <div className="form-group">
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Room Type</InputLabel>
                                        <Select
                                            value={formData.lloji_Dhomes}
                                            onChange={e => setFormData({ ...formData, lloji_Dhomes: e.target.value })}
                                            label="Room Type"
                                        >
                                            <MenuItem value="">Select Type</MenuItem>
                                            <MenuItem value="Single">Single</MenuItem>
                                            <MenuItem value="Double">Double</MenuItem>
                                            <MenuItem value="ICU">ICU</MenuItem>
                                            <MenuItem value="Deluxe">Deluxe</MenuItem>
                                            <MenuItem value="Suite">Suite</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="form-group">
                                    <TextField label="Capacity" value={formData.kapaciteti} onChange={(e) => setFormData({...formData, kapaciteti: e.target.value})} fullWidth />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.available}
                                            onChange={(e) => setFormData({...formData, available: e.target.checked})}
                                        />
                                        Available
                                    </label>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Add Room</button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading rooms...</div>
                ) : (
                    <div className="room-table-container">
                        <h3>Existing Rooms</h3>
                        <table className="room-table">
                            <thead>
                                <tr>
                                    <th>Room Number</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <tr key={room.id}>
                                            {editingRoom && editingRoom.id === room.id ? (
                                                // Edit form row
                                                <td colSpan="5">
                                                    <form onSubmit={handleEditRoom} className="edit-form">
                                                        <div className="form-row">
                                                            <div className="form-group">
                                                                <TextField
                                                                    label="Room Number"
                                                                    value={formData.nrDhomes}
                                                                    onChange={(e) => setFormData({...formData, nrDhomes: e.target.value})}
                                                                    fullWidth
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <FormControl fullWidth margin="normal">
                                                                    <InputLabel>Room Type</InputLabel>
                                                                    <Select
                                                                        value={formData.lloji_Dhomes}
                                                                        onChange={(e) => setFormData({ ...formData, lloji_Dhomes: e.target.value })}
                                                                        label="Room Type"
                                                                    >
                                                                        <MenuItem value="Single">Single</MenuItem>
                                                                        <MenuItem value="Double">Double</MenuItem>
                                                                        <MenuItem value="ICU">ICU</MenuItem>
                                                                        <MenuItem value="Deluxe">Deluxe</MenuItem>
                                                                        <MenuItem value="Suite">Suite</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                            <div className="form-group">
                                                                <TextField
                                                                    label="Capacity"
                                                                    value={formData.kapaciteti}
                                                                    onChange={(e) => setFormData({...formData, kapaciteti: e.target.value})}
                                                                    fullWidth
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.available}
                                                                        onChange={(e) => setFormData({...formData, available: e.target.checked})}
                                                                    />
                                                                    Available
                                                                </label>
                                                            </div>
                                                            <div className="form-actions">
                                                                <button type="submit" className="btn btn-sm btn-primary">Save</button>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-sm btn-secondary"
                                                                    onClick={cancelEdit}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </td>
                                            ) : (
                                                // Normal display row
                                                <>
                                                    <td>{room.nrDhomes}</td>
                                                    <td>{room.lloji_Dhomes}</td>
                                                    <td>{room.kapaciteti} patients</td>
                                                    <td>
                                                        <span className={`status ${room.available ? 'available' : 'occupied'}`}>
                                                            {room.available ? 'Available' : 'Occupied'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => startEdit(room)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteRoom(room.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-rooms">
                                            No rooms found. Add your first room!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomManagement; 