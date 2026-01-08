import React, { useEffect, useState } from "react";
import axios from "axios";
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
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    Grid,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { FilterList, Add, Edit, Delete } from "@mui/icons-material";
import moment from "moment";
import Sidebar from "./Sidebar";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateRangeFilter, setDateRangeFilter] = useState("");
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        id: "",
        patientId: "",
        patientName: "",
        amount: "",
        date: moment().format("YYYY-MM-DD"),
        status: "Progress",
        sherbimiId: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [services, setServices] = useState([]);

    // Get the localStorage key for payments based on the token
    const getPaymentsKey = () => {
        const token = localStorage.getItem("token");
        return token ? `payments_${token}` : null;
    };

    // Load payments from localStorage on component mount
    useEffect(() => {
        const paymentsKey = getPaymentsKey();
        if (paymentsKey) {
            const savedPayments = localStorage.getItem(paymentsKey);
            if (savedPayments) {
                try {
                    const parsedPayments = JSON.parse(savedPayments);
                    setPayments(parsedPayments);
                    setFilteredPayments(parsedPayments);
                } catch (error) {
                    console.error("Error parsing payments from localStorage:", error);
                }
            }
        }
        fetchServices();
        fetchPayments(patients);
    }, []);

    // Save payments to localStorage whenever payments change
    useEffect(() => {
        const paymentsKey = getPaymentsKey();
        if (paymentsKey) {
            localStorage.setItem(paymentsKey, JSON.stringify(payments));
        }
    }, [payments]);

    // Fetch services from the API
    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get("https://localhost:7107/api/Sherbimi", config);
            setServices(response.data);
        } catch (error) {
            toast.error("Error fetching services: " + error.message);
        }
    };

    // Fetch payments from the backend
    const fetchPayments = async (patientsList) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get("https://localhost:7107/api/Fatura", config);
            const normalized = response.data.map(p => {
                const patient = patientsList.find(pt => pt.id === (p.pacientId ?? p.patientId));
                return {
                    ...p,
                    amount: p.shuma ?? p.amount,
                    patientId: p.pacientId ?? p.patientId,
                    patientName: patient
                        ? `${patient.name ?? patient.emri ?? ""} ${patient.surname ?? patient.mbiemri ?? ""}`.trim()
                        : "Unknown",
                    date: p.data ?? p.date,
                    status: p.paguar ? "Paid" : "Progress",
                    id: p.id,
                    sherbimiId: p.sherbimiId ?? p.sherbimiId,
                };
            });
            setPayments(normalized);
            setFilteredPayments(normalized);
        } catch (error) {
            toast.error("Error fetching payments: " + error.message);
        }
    };

    // Handle adding a new payment
    const handleAddPayment = async () => {
        if (!paymentForm.patientId || !paymentForm.amount || !paymentForm.date || !paymentForm.sherbimiId) {
            toast.error("Please fill in all fields.");
            return;
        }

        // Date validation
        const selectedDate = moment(paymentForm.date);
        const today = moment().startOf("day");
        if (selectedDate.isBefore(today)) {
            toast.error("Date cannot be earlier than today.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const paymentPayload = {
                PacientId: paymentForm.patientId,
                SherbimiId: paymentForm.sherbimiId,
                Shuma: paymentForm.amount,
                Data: paymentForm.date,
                // Paguar: paymentForm.status === "Paid"
            };
            const response = await axios.post("https://localhost:7107/api/Fatura", paymentPayload, config);
            const newPayment = {
                ...response.data,
                amount: response.data.shuma ?? response.data.amount,
                // ...map other fields if needed
            };
            setPayments([newPayment, ...payments]);
            setFilteredPayments([newPayment, ...payments]);
            // Close the dialog and reset the form
            setOpenAddDialog(false);
            resetForm();
            toast.success("Payment added successfully!");
        } catch (error) {
            const errorMsg = "Error adding payment: " + error.message;
            console.error(errorMsg);
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    // Handle editing an existing payment
    const handleEditPayment = async () => {
        if (!paymentForm.patientName || !paymentForm.amount || !paymentForm.date || !paymentForm.sherbimiId) {
            toast.error("Please fill in all fields.");
            return;
        }

        const amount = parseFloat(paymentForm.amount);
        if (isNaN(amount)) {
            toast.error("Amount must be a valid number.");
            return;
        }

        const selectedDate = moment(paymentForm.date);
        const today = moment().startOf("day");
        if (selectedDate.isBefore(today)) {
            toast.error("Date cannot be earlier than today.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const paymentPayload = {
                Id: paymentForm.id,
                PacientId: paymentForm.patientId,
                SherbimiId: paymentForm.sherbimiId,
                Shuma: amount,
                Data: paymentForm.date,
                Paguar: paymentForm.status === "Paid"
            };
            await axios.put(`https://localhost:7107/api/Fatura/${paymentForm.id}`, paymentPayload, config);

            await fetchPayments(patients);

            setOpenEditDialog(false);
            resetForm();
            toast.success("Payment updated successfully!");
        } catch (error) {
            toast.error("Error updating payment: " + error.message);
        }
    };

    // Handle deleting a payment
    const handleDeletePayment = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment?")) {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`https://localhost:7107/api/Fatura/${id}`, config);

                // Optionally, re-fetch payments from backend to ensure sync
                await fetchPayments(patients);

                toast.success("Payment deleted successfully!");
            } catch (error) {
                toast.error("Error deleting payment: " + error.message);
            }
        }
    };

    // Reset the payment form
    const resetForm = () => {
        setPaymentForm({
            id: "",
            patientId: "",
            patientName: "",
            amount: "",
            date: moment().format("YYYY-MM-DD"),
            status: "Progress",
            sherbimiId: "",
        });
    };

    // Filter payments based on search term, status, and date range
    const handleFilter = () => {
        const filtered = payments.filter((payment) => {
            const matchesSearchTerm = searchTerm
                ? payment.patientId === searchTerm // Filter by patient ID
                : true;
            const matchesStatus = statusFilter ? payment.status === statusFilter : true;
            const matchesDateRange = dateRangeFilter
                ? moment(payment.date).isSame(dateRangeFilter, "day")
                : true;

            return matchesSearchTerm && matchesStatus && matchesDateRange;
        });
        setFilteredPayments(filtered);
    };

    // Get patient name by ID
    const getPatientNameById = (id) => {
        const patient = patients.find((patient) => patient.id === id);
        return patient ? `${patient.name} ${patient.surname}` : "Unknown";
    };

    // Clear payments when token is removed or expires
    const clearPayments = () => {
        const paymentsKey = getPaymentsKey();
        if (paymentsKey) {
            localStorage.removeItem(paymentsKey);
        }
        setPayments([]);
        setFilteredPayments([]);
    };

    // Check token status periodically
    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                clearPayments();
            }
        };

        const interval = setInterval(checkToken, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            await fetchServices();
            // Fetch patients, then payments
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get("https://localhost:7107/api/Pacienti", config);
            setPatients(response.data);
            await fetchPayments(response.data);
            setLoading(false);
        };
        fetchAll();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f9f4" }}>
            <Sidebar userType="doctor" />
            <Box sx={{ flex: 1, padding: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Payments
                </Typography>

                {/* Add Payment Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Add />}
                        onClick={() => {
                            resetForm();
                            setOpenAddDialog(true);
                            setIsEditMode(false);
                        }}
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: 2,
                            backgroundColor: "#2e7d32",
                            "&:hover": {
                                backgroundColor: "#1b5e20",
                            },
                        }}
                    >
                        Add Payment
                    </Button>
                </Box>

                {/* Filters */}
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        mb: 4,
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        {/* Patient Filter */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Patient</InputLabel>
                                <Select
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    variant="outlined"
                                >
                                    <MenuItem value="">All Patients</MenuItem>
                                    {patients.map((patient) => (
                                        <MenuItem key={patient.id} value={patient.id}>
                                            {`${patient.name} ${patient.surname}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Status Filter */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    variant="outlined"
                                >
                                    <MenuItem value="">All Statuses</MenuItem>
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Progress">Progress</MenuItem>
                                    <MenuItem value="Canceled">Canceled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Date Filter */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                type="date"
                                label="Date"
                                InputLabelProps={{ shrink: true }}
                                value={dateRangeFilter}
                                onChange={(e) => setDateRangeFilter(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>

                        {/* Filter Button */}
                        <Grid item xs={12} sm={6} md={2}>
                            <Button
                                variant="contained"
                                onClick={handleFilter}
                                startIcon={<FilterList />}
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: "#2e7d32",
                                    "&:hover": {
                                        backgroundColor: "#1b5e20",
                                    },
                                }}
                            >
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Payments Table */}
                <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: "#2e7d32",
                                    "& th": { color: "#ffffff", fontWeight: "bold" },
                                }}
                            >
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPayments.map((payment) => (
                                <TableRow
                                    key={payment.id}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "#e8f5e9",
                                        },
                                    }}
                                >
                                    <TableCell>{payment.id}</TableCell>
                                    <TableCell>{payment.patientName}</TableCell>
                                    <TableCell>{moment(payment.date).format("MMM DD, YYYY")}</TableCell>
                                    <TableCell>
                                        {payment.status === "Paid" ? (
                                            <Typography color="green">Paid</Typography>
                                        ) : payment.status === "Progress" ? (
                                            <Typography color="orange">Progress</Typography>
                                        ) : (
                                            <Typography color="red">Canceled</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {payment.amount !== undefined
                                            ? `$${Number(payment.amount).toFixed(2)}`
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setPaymentForm(payment);
                                                setIsEditMode(true);
                                                setOpenEditDialog(true);
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeletePayment(payment.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                {/* Add/Edit Dialog */}
                <Dialog
                    open={openAddDialog || openEditDialog}
                    onClose={() => {
                        setOpenAddDialog(false);
                        setOpenEditDialog(false);
                    }}
                >
                    <DialogTitle>{isEditMode ? "Edit Payment" : "Add Payment"}</DialogTitle>
                    <DialogContent>
                        {/* Patient Field */}
                        {isEditMode ? (
                            <TextField
                                label="Patient"
                                value={paymentForm.patientName}
                                onChange={(e) =>
                                    setPaymentForm({ ...paymentForm, patientName: e.target.value })
                                }
                                fullWidth
                                margin="normal"
                            />
                        ) : (
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Patient</InputLabel>
                                <Select
                                    value={paymentForm.patientId}
                                    onChange={(e) =>
                                        setPaymentForm({ ...paymentForm, patientId: e.target.value })
                                    }
                                    fullWidth
                                    variant="outlined"
                                >
                                    <MenuItem value="">Select Patient</MenuItem>
                                    {patients.map((patient) => (
                                        <MenuItem key={patient.id} value={patient.id}>
                                            {`${patient.name} ${patient.surname}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Sherbimi ID Field */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Service</InputLabel>
                            <Select
                                value={paymentForm.sherbimiId}
                                onChange={(e) => {
                                    const selectedService = services.find(
                                        s => (s.id ?? s.Id) === e.target.value
                                    );
                                    setPaymentForm({
                                        ...paymentForm,
                                        sherbimiId: e.target.value,
                                        amount: selectedService ? (selectedService.cmimi ?? selectedService.Cmimi) : ""
                                    });
                                }}
                                fullWidth
                                variant="outlined"
                            >
                                <MenuItem value="">Select Service</MenuItem>
                                {services.map(service => (
                                    <MenuItem key={service.id ?? service.Id} value={service.id ?? service.Id}>
                                        {service.emri_Sherbimit ?? service.Emri_Sherbimit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Amount Field */}
                        <TextField
                            label="Amount"
                            type="number"
                            value={paymentForm.amount}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                        />

                        {/* Date Field */}
                        <TextField
                            label="Date"
                            type="date"
                            value={paymentForm.date}
                            onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />

                        {/* Status Field */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={paymentForm.status}
                                onChange={(e) =>
                                    setPaymentForm({
                                        ...paymentForm,
                                        status: e.target.value,
                                    })
                                }
                                variant="outlined"
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Progress">Progress</MenuItem>
                                <MenuItem value="Canceled">Canceled</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenAddDialog(false);
                                setOpenEditDialog(false);
                            }}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={isEditMode ? handleEditPayment : handleAddPayment}
                            color="primary"
                        >
                            {isEditMode ? "Save Changes" : "Add Payment"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Payments;