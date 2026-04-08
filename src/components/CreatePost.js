import React, { useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const DEFAULT_AVATAR = 'https://via.placeholder.com/40';

const CreatePost = ({ onPostCreate }) => {
    const [caption, setCaption] = useState('');
    const [preview, setPreview] = useState(null);
    const { user } = useAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!caption && !preview) return;

        const newPost = {
            id: Date.now(),
            user: {
                username: user?.username || 'Anonymous',
                avatar: user?.avatar || DEFAULT_AVATAR
            },
            image: preview || 'https://via.placeholder.com/400',
            description: caption,
            likes: 0,
            comments: [],
            created: 'Just now'
        };

        onPostCreate(newPost);
        setCaption('');
        setPreview(null);
    };

    const avatarSrc = user?.avatar || DEFAULT_AVATAR;

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <img
                        src={avatarSrc}
                        alt="Me"
                        className="user-avatar-small"
                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                    <textarea
                        placeholder="What's on your mind?"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>

                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="Preview" />
                    </div>
                )}

                <div className="action-bar">
                    <label htmlFor="feed-upload" className="custom-file-upload">
                        <FontAwesomeIcon icon={faImage} /> Photo
                    </label>
                    <input
                        id="feed-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />

                    <button type="submit" className="post-btn" disabled={!caption && !preview}>
                        Post <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;

