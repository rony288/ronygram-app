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

    // New function to handle guest access
    const handleGuestLogin = () => {
        navigate("/home");
    };

    return (
        <div>
            <h2>Login</h2>
            {/* Fixed: Use className instead of class in React */}
            <form className="login-form" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit">Login</button>
                    
                    {/* New Guest Button */}
                    <button 
                        type="button" 
                        onClick={handleGuestLogin}
                        style={{ backgroundColor: '#6c757d' }} // Optional: Grey color to distinguish it
                    >
                        View as Guest
                    </button>
                </div>
            </form>

            {/* Optional: Show credentials helper text */}
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                (Demo? Click "View as Guest" to skip login)
            </p>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
