import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Explore from './components/Explore';
import Chat from './components/Chat';
import './App.css';

// Layout wraps every protected page with the top Navigation bar
const ProtectedLayout = ({ children }) => (
    <>
        <Navigation />
        {children}
    </>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public route */}
                        <Route path="/" element={<Login />} />

                        {/* Protected routes */}
                        <Route path="/home" element={
                            <PrivateRoute>
                                <ProtectedLayout><Home /></ProtectedLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <ProtectedLayout><Profile /></ProtectedLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/settings" element={
                            <PrivateRoute>
                                <ProtectedLayout><Settings /></ProtectedLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/explore" element={
                            <PrivateRoute>
                                <ProtectedLayout><Explore /></ProtectedLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/chat" element={
                            <PrivateRoute>
                                <ProtectedLayout><Chat /></ProtectedLayout>
                            </PrivateRoute>
                        } />
                        <Route path="/chat/:userId" element={
                            <PrivateRoute>
                                <ProtectedLayout><Chat /></ProtectedLayout>
                            </PrivateRoute>
                        } />

                        {/* Legacy capitalised paths — redirect to lowercase */}
                        <Route path="/Home" element={<Navigate to="/home" replace />} />
                        <Route path="/Profile" element={<Navigate to="/profile" replace />} />
                        <Route path="/Settings" element={<Navigate to="/settings" replace />} />
                        <Route path="/Explore" element={<Navigate to="/explore" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

