import React from 'react';
import './Navigation.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faUser, faGear, faComment, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const DEFAULT_AVATAR = 'https://via.placeholder.com/45';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = React.useState(false);

    const toggleDropdown = () => setDropdownVisible(v => !v);
    const closeDropdown = () => setDropdownVisible(false);

    const handleLogout = () => {
        closeDropdown();
        logout();
        navigate('/');
    };

    const avatarSrc = user?.avatar || DEFAULT_AVATAR;

    return (
        <nav className="navbar-spider">
            <div className="navbar-brand-spider">
                <span id="nav-title"><b>RONY</b>GRAM</span>
            </div>
            <div className="navbar-toggle">
                <span>{user?.username}</span>
                <img
                    className="img-nav"
                    src={avatarSrc}
                    alt="User"
                    onClick={toggleDropdown}
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                />

                <div className={dropdownVisible ? 'dropdown-menu show' : 'dropdown-menu'}>
                    <Link to="/home" onClick={closeDropdown}>
                        <FontAwesomeIcon icon={faHouse} style={{ marginRight: '5px' }} /> Home
                    </Link>
                    <Link to="/explore" onClick={closeDropdown}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: '5px' }} /> Explore
                    </Link>
                    <Link to="/profile" onClick={closeDropdown}>
                        <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> Profile
                    </Link>
                    <Link to="/settings" onClick={closeDropdown}>
                        <FontAwesomeIcon icon={faGear} style={{ marginRight: '5px' }} /> Settings
                    </Link>
                    <Link to="/chat" onClick={closeDropdown}>
                        <FontAwesomeIcon icon={faComment} style={{ marginRight: '5px' }} /> Chat
                    </Link>
                    <button className="nav-logout-btn" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px' }} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;

