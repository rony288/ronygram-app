import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import faTrash
import './Posts.css';
import CreatePost from './CreatePost'; 

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial posts
    useEffect(() => {
        const controller = new AbortController();
        const fetchPosts = async () => {
            try {
                const response = await fetch('/posts.json', { signal: controller.signal });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setPosts([...data].reverse());
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
        return () => controller.abort();
    }, []);

    // Handle creating a new post
    const handleNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    // --- NEW: Handle Deleting a Post ---
    const handleDelete = (id) => {
        // 1. Ask for confirmation
        const isConfirmed = window.confirm("Are you sure you want to delete this post?");
        
        // 2. If they say "OK", delete it
        if (isConfirmed) {
            const updatedPosts = posts.filter((post) => post.id !== id);
            setPosts(updatedPosts);
        }
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

                        {/* Delete Button */}
                        <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(post.id)}
                            title="Delete Post"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                    <div className="row">
                        <div className="col s12 m7">
                            <div className="card post-item">
                                <div className="card-image">
                                    <img className="post-image" src={post.image} alt="Post" />
                                </div>
                                <div className="card-comment-like">
                                    <FontAwesomeIcon icon={faComment}/> Comments
                                    <FontAwesomeIcon icon={faThumbsUp}/> {post.likes}
                                </div>
                                <div className="card-content">
                                    <h5 className="post-description">{post.description}</h5>
                                    <p className="post-created">{post.created}</p>
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
