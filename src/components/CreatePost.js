import React, { useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CreatePost = ({ onPostCreate }) => {
    const [caption, setCaption] = useState('');
    const [imageFile, setImageFile] = useState(null); // Stores the raw file
    const [preview, setPreview] = useState(null); // Stores the Base64 string

    // 1. UPDATED IMAGE HANDLER
    // We use FileReader immediately so we have a permanent string to display and save
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            // Convert to Base64 String
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // This result is the permanent string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!caption && !preview) return;

        const newPost = {
            id: Date.now(),
            user: {
                username: "Ronaldkipkemboi", // You can make this dynamic later
                avatar: require('../images/MyLove.jpeg') // Ensure this path is correct
            },
            // 2. USE THE PERMANENT PREVIEW STRING
            image: preview || "https://via.placeholder.com/400", 
            description: caption,
            likes: 0,
            comments: [],
            created: "Just now"
        };

        onPostCreate(newPost);
        
        // Reset form
        setCaption('');
        setImageFile(null);
        setPreview(null);
    };

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    {/* User Avatar */}
                    <img 
                        src={require('../images/MyLove.jpeg')} 
                        alt="Me" 
                        className="user-avatar-small"
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
                    />
                    <textarea 
                        placeholder="What's on your mind?" 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>

                {/* Image Preview Area */}
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
