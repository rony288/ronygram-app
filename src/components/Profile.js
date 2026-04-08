import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBookmark, faUserTag, faCog, faPlus, faComment, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const Profile = () => {
    const navigate = useNavigate();
    const { user, token, updateUser } = useAuth();

    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('ronygram_profile_posts');
        return saved ? JSON.parse(saved) : [];
    });

    // Edit-profile modal state
    const [editOpen, setEditOpen] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editError, setEditError] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('ronygram_profile_posts', JSON.stringify(posts));
    }, [posts]);

    // Open the edit modal pre-filled with current values
    const openEdit = () => {
        setEditUsername(user?.username || '');
        setEditBio(user?.bio || '');
        setEditEmail(user?.email || '');
        setEditError('');
        setEditOpen(true);
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError('');
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: editUsername, bio: editBio, email: editEmail })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');
            updateUser(data);
            setEditOpen(false);
        } catch (err) {
            setEditError(err.message);
        } finally {
            setEditLoading(false);
        }
    };

    // Avatar upload
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const res = await fetch('/api/users/avatar', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            updateUser(data);
        } catch (err) {
            alert(err.message);
        }
    };

    // Post gallery upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const caption = window.prompt('Write a caption for your post:');
        if (caption === null) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPost = {
                id: Date.now(),
                image: reader.result,
                caption: caption || '',
                likes: 0,
                comments: 0
            };
            setPosts(prev => [newPost, ...prev]);
        };
        reader.readAsDataURL(file);
    };

    const avatarSrc = user?.avatar || DEFAULT_AVATAR;

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-image-section">
                    <div className="avatar-wrapper">
                        <img
                            src={avatarSrc}
                            alt="Profile"
                            className="profile-main-img"
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        {/* Camera overlay to change avatar */}
                        <label htmlFor="avatar-upload" className="avatar-upload-label" title="Change photo">
                            📷
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="profile-info-section">
                    <div className="profile-row-1">
                        <h2 className="profile-username">{user?.username || 'loading…'}</h2>
                        <button className="edit-profile-btn" onClick={openEdit}>Edit Profile</button>
                        <FontAwesomeIcon icon={faCog} className="settings-icon" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} />
                    </div>

                    <div className="profile-row-2">
                        <span><strong>{posts.length}</strong> posts</span>
                        <span><strong>—</strong> followers</span>
                        <span><strong>—</strong> following</span>
                    </div>

                    <div className="profile-row-3">
                        <h3 className="profile-real-name">{user?.username}</h3>
                        <p className="profile-bio">
                            {user?.bio || 'No bio yet. Click "Edit Profile" to add one.'}
                        </p>
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

            {/* Gallery */}
            <div className="profile-gallery">
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

                {posts.map((post) => (
                    <div key={post.id} className="gallery-item">
                        <img src={post.image} alt="Post" className="gallery-image" />
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

            {/* Edit Profile Modal */}
            {editOpen && (
                <div className="modal-backdrop" onClick={() => setEditOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Profile</h3>
                            <button className="modal-close-btn" onClick={() => setEditOpen(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={saveProfile}>
                            <div className="modal-field">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={editUsername}
                                    onChange={e => setEditUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={e => setEditEmail(e.target.value)}
                                />
                            </div>
                            <div className="modal-field">
                                <label>Bio</label>
                                <textarea
                                    value={editBio}
                                    onChange={e => setEditBio(e.target.value)}
                                    rows={3}
                                    placeholder="Tell people about yourself…"
                                />
                            </div>
                            {editError && <p className="modal-error">{editError}</p>}
                            <button type="submit" className="modal-save-btn" disabled={editLoading}>
                                {editLoading ? 'Saving…' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

