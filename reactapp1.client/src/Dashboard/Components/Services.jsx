import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    TableContainer,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Sidebar from "./Sidebar";  // Assuming you have a Sidebar component

const Records = () => {
    const [Records, setRecords] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [newServiceName, setNewServiceName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPrice, setNewPrice] = useState("");

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axios.get("https://localhost:7107/api/Sherbimi");
            setRecords(response.data);
        } catch (error) {
            const errorMsg = `Error fetching services: ${error.message}`;
            console.error(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setNewServiceName(service.emri_Sherbimit);
        setNewDescription(service.pershkrimi);
        setNewPrice(service.cmimi);
        setOpenEditDialog(true);
    };

    const handleDelete = async (serviceId) => {
        try {
            await axios.delete(`https://localhost:7107/api/Sherbimi/${serviceId}`);
            setRecords(Records.filter((service) => service.id !== serviceId));
            toast.success("Service deleted successfully!");
        } catch (error) {
            const errorMsg = error.response?.data?.title || "Error deleting service";
            console.error("Error deleting service:", error);
            toast.error(errorMsg);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const updatedService = {
                ...editingService,
                emri_Sherbimit: newServiceName,
                pershkrimi: newDescription,
                cmimi: newPrice,
            };
            await axios.put(
                `https://localhost:7107/api/Sherbimi/${editingService.id}`,
                updatedService
            );
            setRecords(Records.map((service) =>
                service.id === editingService.id ? updatedService : service
            ));
            setOpenEditDialog(false);
            toast.success("Service updated successfully!");
        } catch (error) {
            const errorMsg = error.response?.data?.title || "Error updating service";
            console.error("Error updating service:", error);
            toast.error(errorMsg);
        }
    };

    const handleAddService = async () => {
        const newService = {
            id: uuidv4(),  // Generate a UUID for the new service
            emri_Sherbimit: newServiceName,
            pershkrimi: newDescription,
            cmimi: newPrice,
        };

        try {
            const response = await axios.post("https://localhost:7107/api/Sherbimi", newService); // Adjust the endpoint
            setRecords([...Records, response.data]);
            setOpenAddDialog(false);
            toast.success("Service added successfully!");

            // Reset the fields after adding a service
            setNewServiceName("");
            setNewDescription("");
            setNewPrice("");
        } catch (error) {
            console.error("Error adding service:", error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6f7' }}>
                <Sidebar userType="doctor" /> {/* Sidebar component */}

                <Box sx={{ padding: 4, backgroundColor: "#f4f6f8", minHeight: "100vh", width: "100%" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Available Records
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginBottom: 3 }}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Add New Service
                    </Button>

                    <Paper sx={{ overflow: "hidden", width: "100%", borderRadius: "8px", boxShadow: 3 }}>
                        <TableContainer sx={{ maxHeight: 500, overflow: "auto" }}>
                            <Table stickyHeader sx={{ width: "100%" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Service Name</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Records.map((service) => (
                                    <TableRow key={service.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                                        <TableCell>{service.emri_Sherbimit}</TableCell>
                                        <TableCell>{service.pershkrimi}</TableCell>
                                            <TableCell>{!isNaN(Number(service.cmimi)) ? Number(service.cmimi).toFixed(2) : "0.00"}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(service)} color="primary" size="small">
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(service.id)} color="error" size="small">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </div>

            {/* Edit Service Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Service Name"
                        fullWidth
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add New Service Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Service Name"
                        fullWidth
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddService} color="primary">
                        Add Service
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Records;
