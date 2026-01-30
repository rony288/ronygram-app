import React, { useState } from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    // 1. State for "Edit Mode"
    const [isEditing, setIsEditing] = useState(false);

    // 2. State for User Data (so we can change it)
    const [user, setUser] = useState({
        username: "ronaldkipkemboi",
        realName: "Ronald Kipkemboi",
        bio: "Software Engineer 🚀\nBuilding RonyGram with React & ❤️\nCapturing memories in code.",
        link: "github.com/rony288",
        avatar: require('../images/MyLove.jpeg') 
    });

    // 3. State for Posts (Fixed broken links + added functionality)
    const [myPosts, setMyPosts] = useState([
        { id: 1, img: require('../images/MyLove.jpeg') },
        { id: 2, img: "https://picsum.photos/300/300?random=1" }, // Random reliable image
        { id: 3, img: "https://picsum.photos/300/300?random=2" },
        { id: 4, img: "https://picsum.photos/300/300?random=3" },
        { id: 5, img: require('../images/MyLove.jpeg') },
        { id: 6, img: "https://picsum.photos/300/300?random=4" },
    ]);

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle Avatar Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, avatar: URL.createObjectURL(file) });
        }
    };

    // Handle Deleting a Photo
    const handleDeletePost = (id) => {
        if (window.confirm("Delete this photo?")) {
            setMyPosts(myPosts.filter(post => post.id !== id));
        }
    };

    return (
        <div className="profile-container">
            {/* --- HEADER --- */}
            <header className="profile-header">
                <div className="profile-image-section">
                    <div className="avatar-wrapper">
                        <img 
                            src={user.avatar} 
                            alt="Profile" 
                            className="profile-main-img"
                        />
                        {/* Camera Icon shows only in Edit Mode */}
                        {isEditing && (
                            <label htmlFor="avatar-upload" className="avatar-edit-overlay">
                                <FontAwesomeIcon icon={faCamera} />
                                <input 
                                    id="avatar-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="profile-info-section">
                    <div className="profile-row-1">
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="username"
                                value={user.username} 
                                onChange={handleInputChange}
                                className="edit-input username-input"
                            />
                        ) : (
                            <h2 className="profile-username">{user.username}</h2>
                        )}

                        <button 
                            className={isEditing ? "save-profile-btn" : "edit-profile-btn"}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Save Profile" : "Edit Profile"}
                        </button>
                        
                        {!isEditing && <FontAwesomeIcon icon={faCog} className="settings-icon" />}
                    </div>

                    <div className="profile-row-2">
                        <span><strong>{myPosts.length}</strong> posts</span>
                        <span><strong>1.5k</strong> followers</span>
                        <span><strong>342</strong> following</span>
                    </div>

                    <div className="profile-row-3">
                        {isEditing ? (
                            <div className="edit-form">
                                <input 
                                    type="text" 
                                    name="realName"
                                    value={user.realName} 
                                    onChange={handleInputChange}
                                    className="edit-input bold-input"
                                    placeholder="Full Name"
                                />
                                <textarea 
                                    name="bio"
                                    value={user.bio} 
                                    onChange={handleInputChange}
                                    className="edit-input bio-input"
                                    rows="3"
                                    placeholder="Bio"
                                />
                                <input 
                                    type="text" 
                                    name="link"
                                    value={user.link} 
                                    onChange={handleInputChange}
                                    className="edit-input link-input"
                                    placeholder="Website"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="profile-real-name">{user.realName}</h1>
                                <p className="profile-bio" style={{ whiteSpace: "pre-line" }}>{user.bio}</p>
                                <a href={`https://${user.link}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                                    {user.link}
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="profile-divider"></div>

            {/* --- GRID --- */}
            <div className="profile-gallery">
                {myPosts.map((post) => (
                    <div key={post.id} className="gallery-item">
                        <img src={post.img} alt="Post" className="gallery-image" />
                        
                        {/* Show Trash Icon ONLY in Edit Mode */}
                        {isEditing ? (
                            <button 
                                className="delete-overlay-btn"
                                onClick={() => handleDeletePost(post.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        ) : (
                            <div className="gallery-overlay">
                                <span>❤️ {Math.floor(Math.random() * 200)}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
