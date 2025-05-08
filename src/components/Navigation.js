import React, {useState, useEffect} from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faUser, faGear, faComment, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; 

const Navigation = ({username}) => {
    const [dropdownVisible, setDropdownVisible] = React.useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleDropdownClose = () => {
        setDropdownVisible(false);
    };

    return (
        <nav className="navbar-spider">
            <div className="navbar-brand-spider">
                <span id="nav-title"><b>RONY </b> ANGELLEEN</span>
            </div>
            <div className="navbar-toggle">
                <span>{username}</span>
                <img className="img-nav" 
                src={require('../images/MyLove.jpeg')} 
                alt="User"
                onClick={toggleDropdown}/>
                
            <div className={dropdownVisible ? 'dropdown-menu show' : 'dropdown-menu'}>
                <Link to="/home" onClick={handleDropdownClose}>
                    <FontAwesomeIcon icon={faHouse} style={{ marginRight: '5px'}} />  Home</Link>
                <Link to="/explore" onClick={handleDropdownClose}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: '5px'}}/> Explore</Link>
                <Link to="/profile" onClick={handleDropdownClose}>
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px'}}/>Profile</Link>
                <Link to="/settings" onClick={handleDropdownClose}>
                    <FontAwesomeIcon icon={faGear} style={{ marginRight: '5px'}}/>Settings</Link>
                <Link to="/chat" onClick={handleDropdownClose}>
                    <FontAwesomeIcon icon={faComment} style={{ marginRight: '5px'}}/>Chat</Link>
                <Link to="/" onClick={handleDropdownClose}>
                    <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px'}}/>Logout</Link>
                </div>
                </div>
                </nav>

    );
};



export default Navigation;
