import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// ProtectedRoute component to check for authentication and authorization
const ProtectedRoute = ({ element, roles = [], ...rest }) => {
    const token = localStorage.getItem('token');
    const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/LoginForm" />;
    }

    // If user does not have the required roles, redirect to a forbidden page or another location
    if (roles.length > 0 && !roles.some(role => userRoles.includes(role))) {
        return <Navigate to="/" />;
    }

    return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
