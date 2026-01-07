import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const Records = () => {
    const [newEntry, setNewEntry] = useState({
        Id: "",
        MjekuId: "",
        PacientId: "",
        Data: "",
        Anamneza_Statusi: "",
        Ekzaminimi: "",
        Diagnoza: "",
        Terapia: "",
        Perfundimi: "",
    });

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [records, setRecords] = useState([]);
    const [editRecord, setEditRecord] = useState(null);

    useEffect(() => {
        fetchPatients();
        fetchLoggedInDoctorId();
        fetchRecords();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Unauthorized: No token found.");
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get("https://localhost:7107/api/Pacienti", config);
            if (Array.isArray(response.data)) {
                setPatients(response.data);
            } else {
                const errorMsg = "Invalid patient data format.";
            setError(errorMsg);
            toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = `Error fetching patients: ${error.message}`;
            setError(errorMsg);
            console.error("Error fetching patients:", error);
            toast.error(errorMsg);
        }
    };

    const fetchLoggedInDoctorId = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const doctorId = decodedToken.uid;
                if (doctorId) {
                    setNewEntry((prevEntry) => ({
                        ...prevEntry,
                        MjekuId: doctorId,
                    }));
                }
            } catch (error) {
                const errorMsg = error.response?.data?.title || "Error decoding token. Please try again.";
                console.error("Error decoding token:", error);
                setError(errorMsg);
                toast.error(errorMsg);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({
            ...newEntry,
            [name]: name === "Data" ? value : value,
        });
    };

    const handlePatientSelect = (e) => {
        const selectedPatientId = e.target.value;
        setNewEntry({
            ...newEntry,
            PacientId: selectedPatientId,
        });
    };

    const validateEntry = () => {
        if (!newEntry.MjekuId || !newEntry.PacientId || !newEntry.Data) {
            const errorMsg = "All fields are required.";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }

        const inputDate = new Date(newEntry.Data);
        const today = new Date();

        // Normalize both to midnight
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (isNaN(inputDate)) {
            setError("Invalid date format.");
            return false;
        }

        if (inputDate.getTime() !== today.getTime()) {
            setError("Date must be today.");
            return false;
        }

        return true;
    };

    const handleAdd = async () => {
        if (!validateEntry()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not logged in. Please log in again.");
                toast.error("You are not logged in. Please log in again.");
                setLoading(false);
                return;
            }

            const newData = {
                id: uuidv4(),
                mjekuId: newEntry.MjekuId,
                pacientId: newEntry.PacientId,
                data: newEntry.Data ? new Date(newEntry.Data).toISOString() : new Date().toISOString(),
                anamneza_Statusi: newEntry.Anamneza_Statusi || "",
                ekzaminimi: newEntry.Ekzaminimi || "",
                diagnoza: newEntry.Diagnoza || "",
                terapia: newEntry.Terapia || "",
                perfundimi: newEntry.Perfundimi || "",
            };

            await axios.post(
                "https://localhost:7107/api/Historiku",
                newData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const successMsg = "Record saved successfully!";
            setMessage(successMsg);
            setError("");
            toast.success(successMsg);
            setNewEntry({
                Id: "",
                MjekuId: newEntry.MjekuId,
                PacientId: "",
                Data: "",
                Anamneza_Statusi: "",
                Ekzaminimi: "",
                Diagnoza: "",
                Terapia: "",
                Perfundimi: "",
            });
            fetchRecords();
        } catch (error) {
            setError("Error adding entry: " + error.message);
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.get("https://localhost:7107/api/Historiku", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setRecords(response.data);
        } catch (error) {
            console.error("Error fetching records:", error);
            setError("Error fetching records: " + error.message);
        }
    };

    const todayStr = new Date().toISOString().split("T")[0];

    const formatDate = (isoString) => {
        if (!isoString) return "";
        const d = new Date(isoString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const mappedRecords = records.map((record) => {
        // Try different ways to find the patient
        const patient = patients.find(p => 
            p.id === record.pacientId || 
            p.Id === record.pacientId ||
            p.pacientId === record.pacientId ||
            p.PacientId === record.pacientId
        );
        
        return {
            ...record,
            patientName: patient ? `${patient.name || patient.Name} ${patient.surname || patient.Surname}` : `Patient ID: ${record.pacientId}`,
        };
    });

    const handleEdit = (record) => {
        setEditRecord(record);
        setNewEntry({
            Id: record.id || record.Id || "",
            MjekuId: record.mjekuId || record.MjekuId || "",
            PacientId: record.pacientId || record.PacientId || "",
            Data: record.data ? record.data.split("T")[0] : "",
            Anamneza_Statusi: record.anamneza_Statusi || "",
            Ekzaminimi: record.ekzaminimi || "",
            Diagnoza: record.diagnoza || "",
            Terapia: record.terapia || "",
            Perfundimi: record.perfundimi || "",
        });
    };

    const handleCancelEdit = () => {
        setEditRecord(null);
        setNewEntry({
            Id: "",
            MjekuId: newEntry.MjekuId,
            PacientId: "",
            Data: "",
            Anamneza_Statusi: "",
            Ekzaminimi: "",
            Diagnoza: "",
            Terapia: "",
            Perfundimi: "",
        });
    };

    const handleUpdate = async () => {
        if (!validateEntry()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not logged in. Please log in again.");
                toast.error("You are not logged in. Please log in again.");
                setLoading(false);
                return;
            }
            const updatedData = {
                id: newEntry.Id,
                mjekuId: newEntry.MjekuId,
                pacientId: newEntry.PacientId,
                data: newEntry.Data ? new Date(newEntry.Data).toISOString() : new Date().toISOString(),
                anamneza_Statusi: newEntry.Anamneza_Statusi || "",
                ekzaminimi: newEntry.Ekzaminimi || "",
                diagnoza: newEntry.Diagnoza || "",
                terapia: newEntry.Terapia || "",
                perfundimi: newEntry.Perfundimi || "",
            };
            await axios.put(
                `https://localhost:7107/api/Historiku/${newEntry.Id}`,
                updatedData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Record updated successfully!");
            setEditRecord(null);
            setNewEntry({
                Id: "",
                MjekuId: newEntry.MjekuId,
                PacientId: "",
                Data: "",
                Anamneza_Statusi: "",
                Ekzaminimi: "",
                Diagnoza: "",
                Terapia: "",
                Perfundimi: "",
            });
            fetchRecords();
        } catch (error) {
            setError("Error updating entry: " + error.message);
            toast.error("Error updating entry: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`https://localhost:7107/api/Historiku/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Record deleted!");
            fetchRecords();
        } catch (error) {
            toast.error("Failed to delete record.");
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
            <Sidebar userType="doctor" />
            <Box sx={{ flex: 1, padding: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Add Patient History
                </Typography>
                <Paper sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select Patient</InputLabel>
                                <Select
                                    name="PacientId"
                                    value={newEntry.PacientId || ""}
                                    onChange={handlePatientSelect}
                                    label="Select Patient"
                                >
                                    {patients.map((patient) => (
                                        <MenuItem key={patient.id || patient.Id} value={patient.id || patient.Id}>
                                            {`${patient.name || patient.Name} ${patient.surname || patient.Surname}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date"
                                type="date"
                                name="Data"
                                value={newEntry.Data ? newEntry.Data : todayStr}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Anamneza Status"
                                name="Anamneza_Statusi"
                                value={newEntry.Anamneza_Statusi || ""}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Examination"
                                name="Ekzaminimi"
                                value={newEntry.Ekzaminimi || ""}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Diagnosis"
                                name="Diagnoza"
                                value={newEntry.Diagnoza || ""}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Therapy"
                                name="Terapia"
                                value={newEntry.Terapia || ""}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Conclusion"
                                name="Perfundimi"
                                value={newEntry.Perfundimi || ""}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color={editRecord ? "primary" : "success"}
                        onClick={editRecord ? handleUpdate : handleAdd}
                        disabled={loading}
                        sx={{ mt: 2, mr: 2 }}
                    >
                        {loading ? (editRecord ? "Updating..." : "Adding...") : (editRecord ? "Update Entry" : "Add Entry")}
                    </Button>
                    {editRecord && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelEdit}
                            sx={{ mt: 2 }}
                        >
                            Cancel
                        </Button>
                    )}
                    {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
                    {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
                </Paper>
                {patients.length > 0 && records.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 4, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Patient</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Anamneza</TableCell>
                                    <TableCell>Examination</TableCell>
                                    <TableCell>Diagnosis</TableCell>
                                    <TableCell>Therapy</TableCell>
                                    <TableCell>Conclusion</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mappedRecords.map((record, idx) => (
                                    <TableRow key={record.id || record.Id || idx}>
                                        <TableCell>{record.patientName}</TableCell>
                                        <TableCell>{formatDate(record.data)}</TableCell>
                                        <TableCell>{record.anamneza_Statusi}</TableCell>
                                        <TableCell>{record.ekzaminimi}</TableCell>
                                        <TableCell>{record.diagnoza}</TableCell>
                                        <TableCell>{record.terapia}</TableCell>
                                        <TableCell>{record.perfundimi}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleEdit(record)}
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(record.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default Records;
