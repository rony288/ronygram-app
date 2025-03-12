import React, {useState} from 'react';
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
            if(!response.ok) {
                throw new Error('Failed to fetch users data');
            }
            const users = await response.json();
            const user = users.find(
                (user)=> user.username === username && 
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

        return (
            <div>
                <h2>Login</h2>
                <form class="login-form" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type ="text" id="username" value={username}
                        onChange={(e) =>setUsername(e.target.value)} required/>
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password}
                        onChange={(e)=> setPassword(e.target.value)} required/>
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error && <p style={{color:'red'}}>{error}</p>}
            </div>
        );     
};

export default Login;
