import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } },
        });
        setLoading(false);
        if (authError) {
            setError(authError.message);
            return;
        }
        alert('Sign-up successful! Please check your email for a confirmation link.');
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>RONY<span style={{ fontWeight: 400 }}>GRAM</span></h2>
                <p className="helper-text">Create a new account</p>

                <form className="login-form" onSubmit={handleSignUp}>
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

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Please wait…' : 'Create Account'}
                        </button>
                    </div>
                </form>

                {error && <p className="error-msg">{error}</p>}

                <p className="helper-text">
                    Already have an account?{' '}
                    <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/')}
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
