import React, { useState } from 'react';
import './Explore.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

const Explore = () => {
    const [activeTab, setActiveTab] = useState('For You');

    const categories = ['For You', 'Nature', 'Travel', 'Tech', 'Art', 'Food', 'Music', 'Style', 'Cars'];

    const suggestedUsers = [
        { id: 1, name: 'sarah_j', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
        { id: 2, name: 'mike_t', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
        { id: 3, name: 'jess_art', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
        { id: 4, name: 'dev_guy', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
        { id: 5, name: 'traveler', img: 'https://images.unsplash.com/photo-1521119989659-a83eee488058?w=150' },
    ];

    const exploreImages = [
        { id: 1, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500', likes: 120, comments: 45 },
        { id: 2, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500', likes: 89, comments: 12 },
        { id: 3, src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=500', likes: 230, comments: 67 },
        { id: 4, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500', likes: 45, comments: 8 },
        { id: 5, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500', likes: 156, comments: 34 },
        { id: 6, src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500', likes: 312, comments: 90 },
        { id: 7, src: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500', likes: 67, comments: 2 },
        { id: 8, src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500', likes: 88, comments: 19 },
        { id: 9, src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500', likes: 99, comments: 22 },
        { id: 10, src: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=500', likes: 143, comments: 41 },
        { id: 11, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500', likes: 201, comments: 55 },
        { id: 12, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', likes: 178, comments: 33 },
    ];

    return (
        <div className="explore-container">
            <div className="search-section">
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="text" placeholder="Search for users, tags, or places..." />
                </div>
            </div>

            <div className="filter-tabs">
                {categories.map((cat) => (
                    <button 
                        key={cat} 
                        className={`filter-pill ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="suggested-section">
                <h4>People You May Know</h4>
                <div className="suggested-row">
                    {suggestedUsers.map((user) => (
                        <div key={user.id} className="suggested-card">
                            <img src={user.img} alt={user.name} />
                            <p className="suggested-name">{user.name}</p>
                            <button className="follow-btn">Follow</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="explore-grid">
                {exploreImages.map((post) => (
                    <div key={post.id} className="grid-item">
                        <img src={post.src} alt="Explore" />
                        <div className="grid-overlay">
                            <div className="overlay-stat">
                                <FontAwesomeIcon icon={faHeart} /> {post.likes}
                            </div>
                            <div className="overlay-stat">
                                <FontAwesomeIcon icon={faComment} /> {post.comments}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
