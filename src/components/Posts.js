import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faTrash, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Posts.css';
import CreatePost from './CreatePost'; 

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeCommentBox, setActiveCommentBox] = useState(null);
    const [commentInput, setCommentInput] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const fetchPosts = async () => {
            try {
                const response = await fetch('/posts.json', { signal: controller.signal });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                
                const preparedData = data.map((post, postIndex) => {
                    const rawComments = Array.isArray(post.comments) ? post.comments : [];
                    return {
                        ...post,
                        comments: rawComments.map((c, i) => ({
                            ...c,
                            id: c.id || `init-${postIndex}-${i}` 
                        })), 
                        isLiked: false 
                    };
                });
                
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

    const handleLike = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
                return { ...post, likes: newLikes, isLiked: !post.isLiked };
            }
            return post;
        }));
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
                return { ...post, comments: [...post.comments, newComment] };
            }
            return post;
        }));
        setCommentInput("");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
            <h3>⚠️ Error Loading Feed</h3>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="posts-container">
            <CreatePost onPostCreate={handleNewPost} />

            {posts.map((post) => (
                <div className="post-card" key={post.id}>
                    <div className="post-header">
                        <div className="user-info">
                            <img 
                                className="user-avatar" 
                                src={post.user.avatar || require('../images/MyLove.jpeg')}
                                alt="Avatar"
                                onError={(e) => {e.target.src = require('../images/MyLove.jpeg')}}
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
                        {/* Like Button */}
                        <span 
                            onClick={() => handleLike(post.id)} 
                            className={`action-icon ${post.isLiked ? 'liked' : ''}`}
                        >
                            <FontAwesomeIcon icon={faHeart}/> {post.likes} Likes
                        </span>

                        {/* Comment Button */}
                        <span onClick={() => toggleCommentBox(post.id)} className="action-icon">
                            <FontAwesomeIcon icon={faComment}/> {post.comments.length} Comments
                        </span>
                    </div>

                    <div className="post-content">
                        <h5 className="post-description">{post.description}</h5>
                        <p className="post-created">{post.created}</p>

                        {/* Comments List */}
                        {post.comments.length > 0 && (
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

                        {/* Comment Input */}
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
            ))}
        </div>
    );
};

export default Posts;
