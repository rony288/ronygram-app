import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faTrash, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Posts.css';
import CreatePost from './CreatePost'; 

const Posts = () => {
    // 1. INITIALIZE STATE FROM LOCAL STORAGE
    // We check if 'ronygram_posts' exists in the browser. 
    // If yes, we load it. If no, we start with an empty list [].
    const [posts, setPosts] = useState(() => {
        const savedPosts = localStorage.getItem('ronygram_posts');
        return savedPosts ? JSON.parse(savedPosts) : [];
    });

    const [activeCommentBox, setActiveCommentBox] = useState(null);
    const [commentInput, setCommentInput] = useState("");

    // 2. SAVE TO LOCAL STORAGE
    // Every time 'posts' changes (new post, like, or comment), we save it.
    useEffect(() => {
        localStorage.setItem('ronygram_posts', JSON.stringify(posts));
    }, [posts]);

    // --- Post Handlers ---

    const handleNewPost = (newPost) => {
        // Add new post to the top of the list
        setPosts([newPost, ...posts]);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter((post) => post.id !== id));
        }
    };

    const handleLike = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                // Toggle like logic
                const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
                return { ...post, likes: newLikes, isLiked: !post.isLiked };
            }
            return post;
        }));
    };

    // --- Comment Handlers ---

    const toggleCommentBox = (id) => {
        if (activeCommentBox === id) {
            setActiveCommentBox(null);
        } else {
            setActiveCommentBox(id);
            setCommentInput("");
        }
    };

    const submitComment = (id) => {
        if (!commentInput.trim()) return;

        setPosts(posts.map(post => {
            if (post.id === id) {
                const newComment = { 
                    id: Date.now(), 
                    user: "Me", 
                    text: commentInput 
                };
                // Ensure comments array exists before adding
                const currentComments = post.comments || [];
                return { ...post, comments: [...currentComments, newComment] };
            }
            return post;
        }));
        
        setCommentInput(""); // Clear input after submit
    };

    const handleDeleteComment = (postId, commentId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter(c => c.id !== commentId)
                };
            }
            return post;
        }));
    };

    return (
        <div className="posts-container">
            {/* Pass the handler to CreatePost so it can send data back here */}
            <CreatePost onPostCreate={handleNewPost} />

            {/* If no posts exist, show a friendly message */}
            {posts.length === 0 && (
                <div style={{ textAlign: 'center', color: '#8e8e8e', marginTop: '50px' }}>
                    <h3>No posts yet</h3>
                    <p>Be the first to share a photo!</p>
                </div>
            )}

            {posts.map((post) => (
                <div className="post-card" key={post.id}>
                    <div className="post-header">
                        <div className="user-info">
                            <img 
                                className="user-avatar" 
                                src={post.user.avatar || require('../images/MyLove.jpeg')}
                                alt="Avatar"
                                onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
                            />
                            <p className="username">{post.user.username}</p>
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                    <div className="post-image-container">
                        <img className="post-image" src={post.image} alt="Post" />
                    </div>
                    
                    <div className="post-actions">
                        <span 
                            onClick={() => handleLike(post.id)} 
                            className={`action-icon ${post.isLiked ? 'liked' : ''}`}
                        >
                            <FontAwesomeIcon icon={faHeart}/> {post.likes} Likes
                        </span>
                        <span onClick={() => toggleCommentBox(post.id)} className="action-icon">
                            <FontAwesomeIcon icon={faComment}/> {post.comments ? post.comments.length : 0} Comments
                        </span>
                    </div>

                    <div className="post-content">
                        {post.description && (
                            <h5 className="post-description">
                                <span style={{fontWeight: 'bold', marginRight: '8px'}}>{post.user.username}</span>
                                {post.description}
                            </h5>
                        )}
                        <p className="post-created">{post.created}</p>

                        {/* Comments Section */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="comments-section">
                                {post.comments.map((c) => (
                                    <div key={c.id} className="comment-row">
                                        <p className="comment-text">
                                            <strong>{c.user}: </strong> {c.text}
                                        </p>
                                        <button 
                                            className="comment-delete-btn"
                                            onClick={() => handleDeleteComment(post.id, c.id)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeCommentBox === post.id && (
                            <div className="comment-input-area">
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..."
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                                    autoFocus
                                />
                                <button onClick={() => submitComment(post.id)}>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
