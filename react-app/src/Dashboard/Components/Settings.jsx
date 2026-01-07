import React, { useState } from "react";
import axios from "axios";
import "./Settings.css"; // Ensure your CSS file contains appropriate styles
import Sidebar from "./Sidebar";

function Settings() {
    const [formData, setFormData] = useState({
        Email: "", // User's email
        Password: "", // User's password
        Role: "", // Desired role
    });
    const [notification, setNotification] = useState({
        message: "",
        type: "", // 'success' or 'error'
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("FormData being sent:", formData); // Debug payload

        try {
            const response = await axios.post("https://localhost:7107/api/User/addrole", formData);
            console.log("API response:", response.data); // Debug response
            setNotification({
                message: "Role successfully updated!",
                type: "success",
            });
        } catch (error) {
            if (error.response) {
                console.error("Backend error:", error.response.data);
                const validationErrors = error.response.data.errors;
                let errorMessage = error.response.data.title || "Failed to update role.";

                if (validationErrors) {
                    errorMessage += " " + Object.values(validationErrors)
                        .flat()
                        .join(", ");
                }

                setNotification({
                    message: errorMessage,
                    type: "error",
                });
            } else {
                console.error("Error updating role:", error.message);
                setNotification({
                    message: "An unexpected error occurred. Please try again.",
                    type: "error",
                });
            }
        } finally {
            setTimeout(() => setNotification({ message: "", type: "" }), 3000); // Clear notification
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f6f7" }}>
            <Sidebar userType="admin" />
            <div className="admin-page">
                <h1>Admin - Manage User Roles</h1>

                {/* Notification Message */}
                {notification.message && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label htmlFor="Email">Email:</label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            placeholder="Enter user email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Password">Password:</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChange}
                            placeholder="Enter user password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Role">Role:</label>
                        <select
                            id="Role"
                            name="Role"
                            value={formData.Role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">
                        Update Role
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
