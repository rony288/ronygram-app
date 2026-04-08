import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(username, password);
            } else {
                if (!email) {
                    setError('Email is required to register.');
                    setLoading(false);
                    return;
                }
                await register(username, email, password);
            }
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>RONY<span style={{ fontWeight: 400 }}>GRAM</span></h2>

                {/* Mode Toggle */}
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => { setMode('register'); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
                        </button>
                    </div>
                </form>

                {error && <p className="error-msg">{error}</p>}

                <p className="helper-text">
                    {mode === 'login'
                        ? "Don't have an account? Click \"Sign Up\" above."
                        : 'Already have an account? Click "Log In" above.'}
                </p>
            </div>
        </div>
    );
};

export default Login;

