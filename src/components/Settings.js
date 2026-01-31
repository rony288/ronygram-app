import React from 'react';
import './Settings.css'; // We will create this next
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();

    const handleReset = () => {
        if (window.confirm("Are you sure? This will delete all posts and profile photos.")) {
            // 1. Clear Local Storage
            localStorage.removeItem('ronygram_posts');
            localStorage.removeItem('ronygram_profile_posts');
            
            // 2. Refresh the page to apply changes
            window.location.reload();
        }
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            
            <div className="settings-section">
                <h3>Storage & Data</h3>
                <p>If your images are going white or broken, try resetting the data.</p>
                <button className="danger-btn" onClick={handleReset}>
                    Reset All Data
                </button>
            </div>

            <div className="settings-section">
                <h3>Account</h3>
                <button className="logout-btn" onClick={() => navigate('/')}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Settings;
