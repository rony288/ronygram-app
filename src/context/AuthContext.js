import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on initial mount
    useEffect(() => {
        const savedToken = localStorage.getItem('ronygram_token');
        const savedUser = localStorage.getItem('ronygram_user');
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('ronygram_token');
                localStorage.removeItem('ronygram_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('ronygram_token', data.token);
        localStorage.setItem('ronygram_user', JSON.stringify(data.user));
        return data.user;
    };

    const register = async (username, email, password) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('ronygram_token', data.token);
        localStorage.setItem('ronygram_user', JSON.stringify(data.user));
        return data.user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('ronygram_token');
        localStorage.removeItem('ronygram_user');
    };

    // Update the cached user object (e.g. after profile edit or avatar upload)
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('ronygram_user', JSON.stringify(updatedUser));
    };

    // Convenience helper: returns the Authorization header value for fetch calls
    const authHeader = () => ({ Authorization: `Bearer ${token}` });

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, authHeader }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};
