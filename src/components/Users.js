import React from 'react';
import './Users.css';

const Users = () => {
    return (
        <div className="image-icons-container">
            <div className="image-icon"><img src={require('../images/Kimurgor.jpeg')} alt="Icon 1"/></div>
            <div className="image-icon"><img src={require('../images/PB.jpg')} alt="Icon 2"/></div>
            <div className="image-icon"><img src={require('../images/VB.jpg')} alt="Icon 3"/></div>
            <div className="image-icon"><img src={require('../images/Radical Roots.jpg')} alt="Icon 4"/></div>
            <div className="image-icon"><img src={require('../images/Door.jpeg')} alt="Icon 5"/></div>
            <div className="image-icon"><img src={require('../images/Moo.jpg')} alt="Icon 6"/></div>
            <div className="image-icon"><img src={require('../images/Blue.jpg')} alt="Icon 7"/></div>
            <div className="image-icon"><img src={require('../images/ML.jpeg')} alt="Icon 8"/></div>
        </div>
    );
};

export default Users;
