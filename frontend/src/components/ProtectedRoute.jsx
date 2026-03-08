import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Fix #6: GuestRoute — redirects logged-in users away from Login/Register pages
export const GuestRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (user) return <Navigate to="/" replace />;
    return children;
};

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
