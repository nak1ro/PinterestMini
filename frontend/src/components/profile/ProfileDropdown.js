import { Link } from "react-router-dom";
import React from "react";
import { useAppContext } from '../../context/AppContext';

const ProfileDropdown = () => {
    const { avatarUrl, logout } = useAppContext();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dropdown ms-3">
            <button
                className="btn dropdown-toggle p-0 border-0 bg-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <img
                    src={avatarUrl}
                    alt="Profile"
                    width="40"
                    height="40"
                    className="rounded-circle"
                    style={{
                        objectFit: 'cover',
                        width: '40px',
                        height: '40px'
                    }}
                />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings/profile">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                    <button className="dropdown-item" onClick={handleLogout}>Log out</button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileDropdown;
