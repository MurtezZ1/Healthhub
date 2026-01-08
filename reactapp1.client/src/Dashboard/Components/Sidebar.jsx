import React from "react";
import {
    FaHome,
    FaUserAlt,
    FaCalendarAlt,
    FaFileInvoiceDollar,
    FaMedkit,
    FaCog,
    FaFileAlt,
    FaMoneyCheckAlt,
    FaUsers,
    FaBullhorn,
    FaBed,
    FaHospital,
    FaClinicMedical,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import the CSS file

const Sidebar = ({ userType }) => {
    // Define sidebar items based on userType
    const sidebarItems = userType === "admin"
        ? [
            { path: "/AdminDashboard", icon: <FaHome />, label: "Dashboard" },
            { path: "/ManageUsers", icon: <FaUsers />, label: "Manage Users" },
            { path: "/PaymentAdmin", icon: <FaMoneyCheckAlt />, label: "Payments" },
            { path: "/Doctors", icon: <FaClinicMedical />, label: "Doctors" },
            { path: "/RoomManagement", icon: <FaClinicMedical />, label: "Room Management" },

        ]
        : [
            { path: "/Dashboard", icon: <FaHome />, label: "Dashboard" },
            { path: "/Pacientet", icon: <FaUserAlt />, label: "Patients" },
            { path: "/Appointments", icon: <FaCalendarAlt />, label: "Appointments" },
            { path: "/Room", icon: <FaBed />, label: "Room" },
            { path: "/Payments", icon: <FaMoneyCheckAlt />, label: "Payments" },
            { path: "/Records", icon: <FaClinicMedical />, label: "Records" },
            { path: "/Services", icon: <FaClinicMedical />, label: "Services" },
            { path: "/Invoice", icon: <FaFileInvoiceDollar />, label: "Invoice" },
        ];

    return (
        <div className="sidebar-container">
            <h5 className="sidebar-title">{userType === "admin" ? "Admin Dashboard" : "Doctor Dashboard"}</h5>
            <ul className="sidebar-list">
                {sidebarItems.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path} className="sidebar-link">
                            {item.icon} {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
