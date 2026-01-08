import React, { Component, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./Footer";
import Ballina from './Ballina';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import Header from './Header';
import Dashboard from './Dashboard/Components/Dashboard';
import Pacientet from './Dashboard/Components/Pacientet';
import Appointments from './Dashboard/Components/Appointments';
import AppointmentSchedule from './Dashboard/Components/AppointmentSchedule';
import DashboardAdmin from './Dashboard/Components/DashboardAdmin';
import ManageUsers from './Dashboard/Components/ManageUsers';
import OurDoctors from './OurDoctors';
import PaymentAdmin from './Dashboard/Components/PaymentAdmin';
import Doctors from './Dashboard/Components/Doctors';
import Settings from './Dashboard/Components/Settings';
import Room from './Dashboard/Components/Room';
import RoomManagement from './Dashboard/Components/RoomManagement';
import Payments from './Dashboard/Components/Payments';
import Records from './Dashboard/Components/Records';
import Services from './Dashboard/Components/Services';
import Invoice from './Dashboard/Components/Invoice';
import LiveChat from './LiveChat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// Lazy loading components
const RegisterForm = React.lazy(() => import("./RegisterForm"));
const LoginForm = React.lazy(() => import("./LoginForm"));
const AboutUs = React.lazy(() => import("./AboutUs"));
const Contact = React.lazy(() => import("./Contact"));

// Error Boundary Component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error occurred in child component:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

// ProtectedRoute Component
const ProtectedRoute = ({ children, roles }) => {
    const token = localStorage.getItem('token');
    const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];

    if (!token) return <Navigate to="/LoginForm" />;
    if (roles && !roles.some(role => userRoles.includes(role))) return <Navigate to="/" />;

    return children;
};

class App extends Component {
    render() {
        return (
            <Suspense fallback={<div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>}>
                <HashRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Ballina />} />
                        <Route path="/RegisterForm" element={<ErrorBoundary><RegisterForm /></ErrorBoundary>} />
                        <Route path="/LoginForm" element={<ErrorBoundary><LoginForm /></ErrorBoundary>} />
                        <Route path="/AboutUs" element={<ErrorBoundary><AboutUs /></ErrorBoundary>} />
                        <Route path="/OurDoctors" element={<ErrorBoundary><OurDoctors /></ErrorBoundary>} />
                        <Route path="/Contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />

                        {/* User-specific routes */}
                        <Route path="/AppointmentSchedule" element={
                            <ProtectedRoute roles={['User']}>
                                <ErrorBoundary><AppointmentSchedule /></ErrorBoundary>
                            </ProtectedRoute>
                        } />

                        {/* Doctor-specific routes */}
                        <Route path="/Dashboard" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Dashboard /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Pacientet" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Pacientet /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Appointments" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Appointments /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Room" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Room /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Payments" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Payments /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Records" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Records /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Services" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Services /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Invoice" element={
                            <ProtectedRoute roles={['Doctor']}>
                                <ErrorBoundary><Invoice /></ErrorBoundary>
                            </ProtectedRoute>
                        } />

                        {/* Admin-specific routes */}
                        <Route path="/AdminDashboard" element={
                            <ProtectedRoute roles={['Administrator']}>
                                <ErrorBoundary><DashboardAdmin /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/ManageUsers" element={
                            <ProtectedRoute roles={['Administrator']}>
                                <ErrorBoundary><ManageUsers /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                       
                        <Route path="/PaymentAdmin" element={
                            <ProtectedRoute roles={['Administrator']}>
                                <ErrorBoundary><PaymentAdmin /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/RoomManagement" element={
                            <ProtectedRoute roles={['Administrator']}>
                                <ErrorBoundary><RoomManagement /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Doctors" element={
                            <ProtectedRoute roles={['Administrator']}>
                                <ErrorBoundary><Doctors /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/Settings" element={
                            <ProtectedRoute roles={['Administrator']}>
                                <ErrorBoundary><Settings /></ErrorBoundary>
                            </ProtectedRoute>
                        } />
                    </Routes>
                    <Footer />
                    <LiveChat />
                    <ToastContainer />
                </HashRouter>
            </Suspense>
        );
    }
}

export default App;

