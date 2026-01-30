import React from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    // We will use your existing image for the grid to show how it looks
    // In a real app, this would come from your database
    const profilePosts = [
        { id: 1, img: require('../images/MyLove.jpeg') },
        { id: 2, img: "https://via.placeholder.com/300" },
        { id: 3, img: "https://via.placeholder.com/300/0000FF/808080" },
        { id: 4, img: "https://via.placeholder.com/300/FF0000/FFFFFF" },
        { id: 5, img: require('../images/MyLove.jpeg') },
        { id: 6, img: "https://via.placeholder.com/300/FFFF00/000000" },
    ];

    return (
        <div className="profile-container">
            {/* Header Section: Avatar & Info */}
            <header className="profile-header">
                <div className="profile-image-section">
                    <img 
                        src={require('../images/MyLove.jpeg')} 
                        alt="Profile" 
                        className="profile-main-img"
                    />
                </div>

                <div className="profile-info-section">
                    <div className="profile-row-1">
                        <h2 className="profile-username">ronaldkipkemboi</h2>
                        <button className="edit-profile-btn">Edit Profile</button>
                        <FontAwesomeIcon icon={faCog} className="settings-icon" />
                    </div>

                    <div className="profile-row-2">
                        <span><strong>{profilePosts.length}</strong> posts</span>
                        <span><strong>1.5k</strong> followers</span>
                        <span><strong>342</strong> following</span>
                    </div>

                    <div className="profile-row-3">
                        <h1 className="profile-real-name">Ronald Kipkemboi</h1>
                        <p className="profile-bio">
                            Software Engineer 🚀 <br />
                            Building <b>RonyGram</b> with React & ❤️ <br />
                            Capturing memories in code.
                        </p>
                        <a href="https://github.com/rony288" target="_blank" rel="noopener noreferrer" className="profile-link">
                            github.com/rony288
                        </a>
                    </div>
                </div>
            </header>

            {/* Divider */}
            <div className="profile-divider"></div>

            {/* Photo Grid */}
            <div className="profile-gallery">
                {profilePosts.map((post) => (
                    <div key={post.id} className="gallery-item">
                        <img src={post.img} alt="Post" className="gallery-image" />
                        <div className="gallery-overlay">
                            <span>❤️ 120</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
