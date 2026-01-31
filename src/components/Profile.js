import React, { useState, useEffect } from 'react';
import './Profile.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBookmark, faUserTag, faCog, faArrowLeft, faPlus, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    // 1. INITIALIZE STATE FROM LOCAL STORAGE
    // Check if we have saved profile posts. If not, start empty.
    const [posts, setPosts] = useState(() => {
        const savedProfilePosts = localStorage.getItem('ronygram_profile_posts');
        return savedProfilePosts ? JSON.parse(savedProfilePosts) : [];
    });

    // 2. SAVE TO LOCAL STORAGE
    // Whenever 'posts' changes (you upload a new one), save it.
    useEffect(() => {
        localStorage.setItem('ronygram_profile_posts', JSON.stringify(posts));
    }, [posts]);

    // 3. UPLOAD FUNCTION
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Ask for a caption
            const caption = window.prompt("Write a caption for your post:");
            
            // If user clicked cancel, don't upload
            if (caption === null) return; 

            // Create a URL for the image
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPost = { 
                    id: Date.now(), 
                    image: reader.result, // We use FileReader to save the string locally
                    caption: caption || "", // Save the caption!
                    likes: 0,
                    comments: 0
                };
                // Add to the list
                setPosts([newPost, ...posts]); 
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-container">
            {/* Back Button */}
            <button className="back-home-btn" onClick={() => navigate('/home')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Feed
            </button>

            {/* Header */}
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

            {/* Tabs */}
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

            {/* Grid */}
            <div className="profile-gallery">
                
                {/* UPLOAD BOX */}
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
                        style={{ display: 'none' }} 
                    />
                </div>

                {/* POSTS */}
                {posts.map((post) => (
                    <div key={post.id} className="gallery-item">
                        <img src={post.image} alt="Post" className="gallery-image" />
                        
                        {/* THIS OVERLAY SHOWS THE CAPTION ON HOVER */}
                        <div className="gallery-overlay">
                            <div className="overlay-text">
                                {post.caption ? (
                                    <p className="caption-text">{post.caption}</p>
                                ) : (
                                    <div className="stats">
                                        <span><FontAwesomeIcon icon={faHeart} /> {post.likes}</span>
                                        <span><FontAwesomeIcon icon={faComment} /> {post.comments}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
