import React, { useState } from 'react';
import './Profile.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBookmark, faUserTag, faCog, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    // 1. STATE: Keeps track of your photos so we can add new ones
    const [posts, setPosts] = useState([
        { id: 1, image: 'https://via.placeholder.com/300' },
        { id: 2, image: 'https://via.placeholder.com/300' },
        { id: 3, image: 'https://via.placeholder.com/300' },
        { id: 4, image: 'https://via.placeholder.com/300' },
        { id: 5, image: 'https://via.placeholder.com/300' },
        { id: 6, image: 'https://via.placeholder.com/300' },
    ]);

    // 2. FUNCTION: Handles the file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Creates a temporary URL for the uploaded image
            const newImageUrl = URL.createObjectURL(file);
            
            const newPost = { 
                id: Date.now(), // Unique ID based on current time
                image: newImageUrl 
            };

            // Adds the new photo to the beginning of the list
            setPosts([newPost, ...posts]); 
        }
    };

    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-home-btn" onClick={() => navigate('/home')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Feed
            </button>

            {/* Profile Header Card */}
            <div className="profile-header">
                <div className="profile-image-section">
                    <div className="avatar-wrapper">
                        <img 
                            src={require('../images/MyLove.jpeg')} 
                            alt="Profile" 
                            className="profile-main-img"
                            onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
                        />
                    </div>
                </div>

                <div className="profile-info-section">
                    <div className="profile-row-1">
                        <h2 className="profile-username">ronaldkipkemboi</h2>
                        <button className="edit-profile-btn">Edit Profile</button>
                        <FontAwesomeIcon icon={faCog} className="settings-icon" />
                    </div>

                    <div className="profile-row-2">
                        <span><strong>{posts.length}</strong> posts</span>
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
                        <a href="https://github.com/rony288" className="profile-link" target="_blank" rel="noreferrer">
                            github.com/rony288
                        </a>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
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

            {/* Photo Gallery Grid */}
            <div className="profile-gallery">
                
                {/* --- UPLOAD BUTTON (Always the first square) --- */}
                <div className="gallery-item upload-box">
                    <label htmlFor="file-upload" className="upload-label">
                        <div className="icon-circle">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <span>Add Photo</span>
                    </label>
                    <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        style={{ display: 'none' }} // Hides the default ugly file input
                    />
                </div>

                {/* Render All Photos */}
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
