import React from 'react';
import './Users.css';

const Users = () => {
    return (
        <div className="image-icons-container">
            <div className="image-icon"><img src={require('../images/DB26-4D2C-8B15-90A2A288C461.jpeg')} alt="Icon 1"/></div>
            <div className="image-icon"><img src={require('../images/2.jpg')} alt="Icon 2"/></div>
            <div className="image-icon"><img src={require('../images/3.jpg')} alt="Icon 3"/></div>
            <div className="image-icon"><img src={require('../images/4.jpg')} alt="Icon 4"/></div>
            <div className="image-icon"><img src={require('../images/5.jpg')} alt="Icon 5"/></div>
            <div className="image-icon"><img src={require('../images/6.jpg')} alt="Icon 6"/></div>
            <div className="image-icon"><img src={require('../images/7.jpg')} alt="Icon 7"/></div>
            <div className="image-icon"><img src={require('../images/8.jpg')} alt="Icon 8"/></div>
        </div>
    );
};

export default Users;
