import React from 'react';
import Posts from './Posts';
import './App.css'; 

const Home = () => {
    return (
        <div className="home-container">
            {/* The Posts component handles the entire Feed + Create Post box */}
            <Posts />
        </div>
    );
};

export default Home;
