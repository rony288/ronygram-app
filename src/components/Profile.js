import React from 'react';
import './Profile.css'; // Ensure this matches your CSS file name
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBookmark, faUserTag, faCog, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    // Placeholder data for the gallery
    const posts = [
        { id: 1, image: 'https://via.placeholder.com/300' },
        { id: 2, image: 'https://via.placeholder.com/300' },
        { id: 3, image: 'https://via.placeholder.com/300' },
        { id: 4, image: 'https://via.placeholder.com/300' },
        { id: 5, image: 'https://via.placeholder.com/300' },
        { id: 6, image: 'https://via.placeholder.com/300' },
    ];

    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-home-btn" onClick={() => navigate('/home')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Feed
            </button>

            {/* Profile Header Card */}
            <div className="profile-header">
                {/* Image Section */}
                <div className="profile-image-section">
                    <div className="avatar-wrapper">
                        <img 
                            src={require('../images/MyLove.jpeg')} 
                            alt="Profile" 
                            className="profile-main-img"
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="profile-info-section">
                    <div className="profile-row-1">
                        <h2 className="profile-username">ronaldkipkemboi</h2>
                        <button className="edit-profile-btn">Edit Profile</button>
                        <FontAwesomeIcon icon={faCog} className="settings-icon" />
                    </div>

                    <div className="profile-row-2">
                        <span><strong>6</strong> posts</span>
                        <span><strong>1.5k</strong> followers</span>
                        <span><strong>342</strong> following</span>
                    </div>

                    <div className="profile-row-3">
                        <h3 className="profile-real-name">Ronald Kipkemboi</h3>
                        <p className="profile-bio">
                            Software Engineer 🚀<br />
                            Building RonyGram with React & ❤️<br />
                            Capturing memories in code.
                        </p>
                        <a href="https://github.com/rony288" className="profile-link">github.com/rony288</a>
                    </div>
                </div>
            </div>

            {/* --- NEW: INSTAGRAM TABS --- */}
            <div className="profile-tabs">
                <div className="tab-item active">
                    <FontAwesomeIcon icon={faTh} />
                    <span>POSTS</span>
                </div>
                <div className="tab-item">
                    <FontAwesomeIcon icon={faBookmark} />
                    <span>SAVED</span>
                </div>
                <div className="tab-item">
                    <FontAwesomeIcon icon={faUserTag} />
                    <span>TAGGED</span>
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="profile-gallery">
                {posts.map((post) => (
                    <div key={post.id} className="gallery-item">
                        <img src={post.image} alt="Post" className="gallery-image" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
