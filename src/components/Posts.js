import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Controller to cancel the fetch if the component unmounts
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts.json', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postsData = await response.json();
        
        if (Array.isArray(postsData)) {
          // 2. Safe Reverse: Use spread syntax [...] to avoid mutating original data
          setPosts([...postsData].reverse()); 
        } else {
          throw new Error('Posts data is not an array');
        }
      } catch (error) {
        // Ignore errors caused by cancelling the fetch
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    // Cleanup function
    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div className="post-form" key={post.id}>
          <div className="user">
            <span>
              {/* 3. Dynamic Avatar with Fallback */}
              <img 
                className="user" 
                src={post.user.avatar || require('../images/MyLove.jpeg')}
                alt="User Avatar"
                // Safety: If the dynamic URL breaks, revert to the local image
                onError={(e) => { e.target.onerror = null; e.target.src = require('../images/MyLove.jpeg'); }}
              />
            </span>
            <p className="username">{post.user.username}</p>
          </div>
          <div className="row">
            <div className="col s12 m7">
              <div className="card post-item">
                <div className="card-image">
                  <img className="post-image" src={post.image} alt={post.description} />
                </div>
                <div className="card-comment-like">
                  <FontAwesomeIcon id="comment" icon={faComment} /> Comments
                  <FontAwesomeIcon id="like" icon={faThumbsUp} /> {post.likes}
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
