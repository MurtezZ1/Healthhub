import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://localhost:7107/api/User");
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                throw new Error("Invalid data format: users should be an array");
            }
            setError(null);
        } catch (err) {
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("https://localhost:7107/api/User/roles");
            if (Array.isArray(response.data)) {
                setAvailableRoles(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch roles:", err);
            // Fallback to default roles
            setAvailableRoles(['Administrator', 'Doctor', 'User']);
        }
    };

    const handleEdit = (user) => {
        setEditingUser({
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || ''
        });
        setShowEditModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleChangeRole = (user) => {
        setSelectedUser(user);
        setShowRoleModal(true);
    };

    const saveEdit = async () => {
        try {
            await axios.put(`https://localhost:7107/api/User/${editingUser.id}`, editingUser);
            setShowEditModal(false);
            setEditingUser(null);
            fetchUsers(); // Refresh the list
            setError(null);
        } catch (err) {
            setError("Failed to update user. Please try again.");
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://localhost:7107/api/User/${selectedUser.id}`);
            setShowDeleteModal(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh the list
            setError(null);
        } catch (err) {
            setError("Failed to delete user. Please try again.");
        }
    };

    const confirmRoleChange = async () => {
        try {
            const roleData = {
                email: selectedUser.email,
                role: selectedUser.newRole
            };
            await axios.post("https://localhost:7107/api/User/changerole", roleData);
            setShowRoleModal(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh the list
            setError(null);
        } catch (err) {
            setError("Failed to change user role. Please try again.");
        }
    };

    const getUserRoles = (user) => {
        if (user.roles && Array.isArray(user.roles)) {
            return user.roles.join(', ');
        }
        return 'User'; // Default role
    };

    return (
        <div className="d-flex" style={{ backgroundColor: '#f5f6f7' }}>
            <Sidebar userType="admin" />

            <div className="admin-dashboard">
                {error && <div className="error">{error}</div>}
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="user-list">
                        <h2>Manage Users</h2>
                        <div className="table-container">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Email Confirmed</th>
                                        <th>Current Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.firstName || '-'}</td>
                                                <td>{user.lastName || '-'}</td>
                                                <td>{user.email}</td>
                                                <td>{user.emailConfirmed ? "Yes" : "No"}</td>
                                                <td>{getUserRoles(user)}</td>
                                                <td className="action-buttons">
                                                    <button 
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => handleChangeRole(user)}
                                                    >
                                                        Change Role
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(user)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No users available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && editingUser && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Edit User</h3>
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={editingUser.firstName}
                                    onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={editingUser.lastName}
                                    onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete user: <strong>{selectedUser.email}</strong>?</p>
                            <p>This action cannot be undone.</p>
                            <div className="modal-actions">
                                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Role Modal */}
                {showRoleModal && selectedUser && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Change User Role</h3>
                            <p>Current user: <strong>{selectedUser.email}</strong></p>
                            <p>Current role: <strong>{getUserRoles(selectedUser)}</strong></p>
                            <div className="form-group">
                                <label>New Role:</label>
                                <select 
                                    className="form-control"
                                    onChange={(e) => setSelectedUser({...selectedUser, newRole: e.target.value})}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a role</option>
                                    {availableRoles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="btn btn-primary" 
                                    onClick={confirmRoleChange}
                                    disabled={!selectedUser.newRole}
                                >
                                    Change Role
                                </button>
                                <button className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
