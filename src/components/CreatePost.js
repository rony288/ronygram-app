import React, { useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CreatePost = ({ onPostCreate }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!caption && !image) return;

        const newPost = {
            id: Date.now(),
            user: {
                username: "Ronaldkipkemboi",
                avatar: require('../images/MyLove.jpeg')
            },
            image: preview || "https://via.placeholder.com/400",
            description: caption,
            likes: 0,
            comments: [], // <--- THIS LINE IS CRITICAL! DO NOT FORGET IT.
            created: "Just now"
        };

        onPostCreate(newPost);
        setCaption('');
        setImage(null);
        setPreview(null);
    };

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <img 
                        src={require('../images/MyLove.jpeg')} 
                        alt="Me" 
                        className="user-avatar-small"
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
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <FontAwesomeIcon icon={faImage} /> Photo
                    </label>
                    <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} 
                    />
                    
                    <button type="submit" className="post-btn" disabled={!caption && !image}>
                        Post <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
