import React, { useState } from 'react';
import './Explore.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Explore = () => {
    const [activeTab, setActiveTab] = useState('For You');

    // Dummy categories
    const categories = ['For You', 'Trending', 'Art', 'Travel', 'Tech', 'Nature', 'Music'];

    // Dummy "People to Follow"
    const suggestedUsers = [
        { id: 1, name: 'sarah_j', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 2, name: 'mike_t', img: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { id: 3, name: 'jess_art', img: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
        { id: 4, name: 'dev_guy', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 5, name: 'traveler', img: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
    ];

    // Dummy Explore Grid Images (Random Unsplash IDs)
    const exploreImages = [
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400',
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400',
    ];

    return (
        <div className="explore-container">
            {/* Search Bar */}
            <div className="search-section">
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="text" placeholder="Search users, tags..." />
                </div>
            </div>

            {/* Filter Tabs */}
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

            {/* Suggested Users */}
            <div className="suggested-section">
                <h4>People You May Know</h4>
                <div className="suggested-row">
                    {suggestedUsers.map((user) => (
                        <div key={user.id} className="suggested-card">
                            <img src={user.img} alt={user.name} />
                            <p>{user.name}</p>
                            <button className="follow-btn">Follow</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="explore-grid">
                {exploreImages.map((img, index) => (
                    <div key={index} className="grid-item">
                        <img src={img} alt="Explore" />
                        <div className="grid-overlay">
                            <FontAwesomeIcon icon={faUserPlus} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
