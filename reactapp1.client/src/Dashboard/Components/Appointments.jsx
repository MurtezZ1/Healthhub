import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
    Chip,
    CircularProgress,
    Alert,
    Button,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import Sidebar from "./Sidebar";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [notes, setNotes] = useState("");
    const [patientNames, setPatientNames] = useState({});
    const [status, setStatus] = useState("Planned");

    const getDoctorIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.uid;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const doctorId = getDoctorIdFromToken();
            if (!doctorId) {
                const errorMsg = "Unable to identify doctor. Please log in again.";
                setError(errorMsg);
                toast.error(errorMsg);
                return;
            }

            // Fetch appointments
            const appointmentsResponse = await axios.get(
                `https://localhost:7107/api/Termini/byDoctor/${doctorId}`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );

            // Extract unique patient IDs
            const patientIds = [...new Set(appointmentsResponse.data.map(a => a.pacientId))];

            // Fetch patient details in a single batch
            const patientsResponse = await axios.get(
                `https://localhost:7107/api/Pacienti/GetPatientsBatch`,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    params: { ids: patientIds.join(',') }
                }
            );

            // Create name mapping
            const namesMap = {};
            patientsResponse.data.forEach(patient => {
                namesMap[patient.id] = `${patient.name} ${patient.surname}`;
            });
            setPatientNames(namesMap);

            // Format appointments with patient names and validate times
const formattedAppointments = appointmentsResponse.data.map(appointment => {
    // Parse appointment time as local time explicitly to fix timezone offset
    const startTime = moment(appointment.dataTerminit).local().toDate();
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes duration

    // Validate appointment time (weekdays 8AM-5PM)
    const day = startTime.getDay();
    const hours = startTime.getHours();
    const isValidTime = (day >= 1 && day <= 5) && (hours >= 8 && hours < 17);

    return {
        title: `Appointment with ${namesMap[appointment.pacientId] || 'Patient'}`,
        start: startTime,
        end: endTime,
        id: appointment.id,
        patientId: appointment.pacientId,
        status: mapStatusToEnglish(appointment.statusi) || "Planned",
        notes: appointment.notes || "",
        originalDataTerminit: appointment.dataTerminit, // store original time string
        isValid: isValidTime
    };
}).filter(appt => appt.isValid); // Only show valid appointments

            setAppointments(formattedAppointments);
            setError(null);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            const errorMsg = error.response?.data?.message || error.message;
            setError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to map Albanian status to English
    const mapStatusToEnglish = (status) => {
        switch (status) {
            case 'Planifikuar': return 'Planned';
            case 'Perfunduar': return 'Completed';
            case 'Anuluar': return 'Cancelled';
            default: return status;
        }
    };

    // Helper function to map English status to Albanian for backend
    const mapStatusToAlbanian = (status) => {
        switch (status) {
            case 'Planned': return 'Planifikuar';
            case 'Completed': return 'Perfunduar';
            case 'Cancelled': return 'Anuluar';
            default: return status;
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [refresh]);

    const handleEventClick = (event) => {
        setSelectedAppointment(event);
        setNotes(event.notes || "");
        setStatus(event.status);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const deleteAppointment = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `https://localhost:7107/api/Termini/${selectedAppointment.id}`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            setRefresh(prev => !prev);
            handleCloseModal();
            toast.success('Appointment deleted successfully!');
        } catch (error) {
            console.error("Error deleting appointment:", error);
            const errorMessage = error.response?.data?.message || "Failed to delete appointment";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

const updateAppointment = async () => {
    try {
        setLoading(true);
        await axios.put(
            `https://localhost:7107/api/Termini/${selectedAppointment.id}`,
            {
                Id: selectedAppointment.id,
                DoktorId: getDoctorIdFromToken(),
                PacientId: selectedAppointment.patientId,
                DataTerminit: selectedAppointment.originalDataTerminit || selectedAppointment.start, // use original time if available
                Statusi: mapStatusToAlbanian(status),
                Notes: notes
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        setRefresh(prev => !prev);
        handleCloseModal();
        toast.success('Appointment updated successfully!');
    } catch (error) {
        console.error("Error updating appointment:", error);
        const errorMessage = error.response?.data?.message || "Failed to update appointment";
        setError(errorMessage);
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad'; // Blue for default/Planned
        if (event.status === 'Cancelled') backgroundColor = '#f44336'; // Red
        if (event.status === 'Completed') backgroundColor = '#4caf50'; // Green
        if (event.status === 'Planned') backgroundColor = '#ff9800'; // Orange

        return {
            style: {
                backgroundColor,
                color: 'white',
                borderRadius: '4px',
                padding: '2px',
                fontSize: '0.9rem'
            }
        };
    };

    const CustomEvent = ({ event }) => (
        <div>
            <strong>{event.title}</strong>
            <div>{moment(event.start).format('h:mm A')}</div>
            <Chip
                label={event.status}
                size="small"
                sx={{
                    mt: 0.5,
                    color: 'white',
                    backgroundColor:
                        event.status === 'Cancelled' ? '#f44336' :
                            event.status === 'Completed' ? '#4caf50' :
                                '#ff9800' // Orange for Planned
                }}
            />
        </div>
    );

    // Custom day view to hide weekends
    const CustomDayView = ({ date, children }) => {
        const day = date.getDay();
        if (day === 0 || day === 6) { // Sunday (0) or Saturday (6)
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    No appointments available on weekends
                </div>
            );
        }
        return children;
    };

    if (error) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar userType="doctor" />
                <Box sx={{ flex: 1, padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Alert severity="error">
                        {error}
                        <Button variant="contained" sx={{ ml: 2 }} onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </Alert>
                </Box>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar userType="doctor" />
                <Box sx={{ flex: 1, padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar userType="doctor" />
            <Box sx={{ flex: 1, padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Appointments
                </Typography>

                {appointments.length === 0 ? (
                    <Alert severity="info">
                        You have no scheduled appointments.
                    </Alert>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={appointments}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        defaultView="week"
                        views={['week', 'day', 'agenda']}
                        onSelectEvent={handleEventClick}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            event: CustomEvent,
                            week: {
                                header: ({ date }) => {
                                    const day = date.getDay();
                                    if (day === 0 || day === 6) {
                                        return null; // Hide weekend headers
                                    }
                                    return moment(date).format('dddd');
                                }
                            }
                        }}
                        min={new Date(0, 0, 0, 8, 0, 0)}  // 8AM
                        max={new Date(0, 0, 0, 17, 0, 0)}  // 5PM
                        step={30} // 30 minute intervals
                        timeslots={1} // One appointment per timeslot
                        dayLayoutAlgorithm="no-overlap"
                        showMultiDayTimes={false}
                    />
                )}

                <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle>Appointment Details</DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {selectedAppointment && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Patient: {patientNames[selectedAppointment.patientId] || selectedAppointment.patientId}
                                </Typography>
                                <Typography>
                                    <strong>Time:</strong> {moment(selectedAppointment.start).format('dddd, MMMM Do YYYY, h:mm a')}
                                </Typography>
                                <Typography>
                                    <strong>Duration:</strong> 30 minutes
                                </Typography>

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <MenuItem value="Planned">Planned</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Notes"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    sx={{ mt: 3 }}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={deleteAppointment}
                            disabled={loading}
                        >
                            Delete Appointment
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={updateAppointment}
                            disabled={loading || (status === selectedAppointment?.status && notes === selectedAppointment?.notes)}
                        >
                            Update
                        </Button>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Appointments;
