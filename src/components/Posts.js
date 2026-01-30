import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './Posts.css';
import CreatePost from './CreatePost'; 

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to track which post has its comment box open
    const [activeCommentBox, setActiveCommentBox] = useState(null);
    const [commentInput, setCommentInput] = useState("");

    // Fetch initial posts
    useEffect(() => {
        const controller = new AbortController();
        const fetchPosts = async () => {
            try {
                const response = await fetch('/posts.json', { signal: controller.signal });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                
                // Add "isLiked" and empty "comments" array to each post so we can change them later
                const preparedData = data.map(post => ({
                    ...post,
                    comments: [], 
                    isLiked: false 
                }));
                
                setPosts([...preparedData].reverse());
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
        return () => controller.abort();
    }, []);

    const handleNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter((post) => post.id !== id));
        }
    };

    // --- NEW: Handle Like Click ---
    const handleLike = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                // If it is already liked, subtract 1. If not, add 1.
                const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
                return { ...post, likes: newLikes, isLiked: !post.isLiked };
            }
            return post;
        }));
    };

    // --- NEW: Toggle Comment Box ---
    const toggleCommentBox = (id) => {
        if (activeCommentBox === id) {
            setActiveCommentBox(null); // Close it if it's already open
        } else {
            setActiveCommentBox(id); // Open this specific one
            setCommentInput(""); // Clear the text
        }
    };

    // --- NEW: Submit a Comment ---
    const submitComment = (id) => {
        if (!commentInput.trim()) return; // Don't allow empty comments

        setPosts(posts.map(post => {
            if (post.id === id) {
                const newComment = { user: "Me", text: commentInput };
                return { ...post, comments: [...post.comments, newComment] };
            }
            return post;
        }));
        
        setCommentInput(""); // Clear input after posting
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="posts-container">
            <CreatePost onPostCreate={handleNewPost} />

            {posts.map((post) => (
                <div className="post-form" key={post.id}>
                    <div className="user">
                        <div className="user-info">
                            <span>
                                <img 
                                    className="user" 
                                    src={post.user.avatar || require('../images/MyLove.jpeg')}
                                    alt="Avatar"
                                    onError={(e) => {e.target.src = require('../images/MyLove.jpeg')}}
                                />
                            </span>
                            <p className="username">{post.user.username}</p>
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                    <div className="row">
                        <div className="col s12 m7">
                            <div className="card post-item">
                                <div className="card-image">
                                    <img className="post-image" src={post.image} alt="Post" />
                                </div>
                                
                                {/* INTERACTION BUTTONS */}
                                <div className="card-comment-like">
                                    <span onClick={() => toggleCommentBox(post.id)} className="action-icon">
                                        <FontAwesomeIcon icon={faComment}/> {post.comments.length} Comments
                                    </span>
                                    
                                    <span 
                                        onClick={() => handleLike(post.id)} 
                                        className={`action-icon ${post.isLiked ? 'liked' : ''}`}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp}/> {post.likes} Likes
                                    </span>
                                </div>

                                <div className="card-content">
                                    <h5 className="post-description">{post.description}</h5>
                                    <p className="post-created">{post.created}</p>

                                    {/* SHOW COMMENTS */}
                                    {post.comments.length > 0 && (
                                        <div className="comments-section">
                                            {post.comments.map((c, index) => (
                                                <p key={index} className="comment-text">
                                                    <strong>{c.user}: </strong> {c.text}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {/* COMMENT INPUT BOX */}
                                    {activeCommentBox === post.id && (
                                        <div className="comment-input-area">
                                            <input 
                                                type="text" 
                                                placeholder="Add a comment..."
                                                value={commentInput}
                                                onChange={(e) => setCommentInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                                            />
                                            <button onClick={() => submitComment(post.id)}>
                                                <FontAwesomeIcon icon={faPaperPlane} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
