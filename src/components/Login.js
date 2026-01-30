import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/users.json');
            if (!response.ok) {
                throw new Error('Failed to fetch users data');
            }
            const users = await response.json();
            const user = users.find(
                (user) => user.username === username &&
                          user.password === password
            );

            if (user) {
                alert('Login successful!');
                navigate("/home");
            } else {
                setError('Login Failed.');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('There was an error with the login process.');
        }
    };

    const handleGuestLogin = () => {
        navigate("/home");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="button-group">
                        <button type="submit" className="login-btn">
                            Login
                        </button>
                        <button 
                            type="button" 
                            onClick={handleGuestLogin}
                            className="guest-btn"
                        >
                            Guest Mode
                        </button>
                    </div>
                </form>

                {error && <p className="error-msg">{error}</p>}

                <p className="helper-text">
                    (Demo? Click "Guest Mode" to skip)
                </p>
            </div>
        </div>
    );
};

export default Login;
