import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p style={{ color: '#8e8e8e', fontSize: '16px' }}>Loading…</p>
            </div>
        );
    }

    return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
