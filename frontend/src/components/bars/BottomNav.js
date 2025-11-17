import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { selectUser } from '../../store/slices/authSlice';

const BottomNav = () => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = !!user;

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                .bottom-nav {
                    display: none;
                }

                @media (max-width: 768px) {
                    .bottom-nav {
                        display: flex;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: white;
                        border-top: 1px solid rgba(0, 0, 0, 0.1);
                        padding: 12px 0 max(12px, env(safe-area-inset-bottom));
                        z-index: 1000;
                        justify-content: space-around;
                        align-items: center;
                        height: 70px;
                        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
                    }

                    .bottom-nav-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 10px 12px;
                        text-decoration: none;
                        color: #767676;
                        transition: all 0.2s ease;
                        border-radius: 12px;
                        min-width: 60px;
                        gap: 4px;
                    }

                    .bottom-nav-item.active {
                        color: #111;
                        background-color: rgba(0, 0, 0, 0.05);
                    }

                    .bottom-nav-item:active {
                        transform: scale(0.95);
                    }

                    .bottom-nav-icon {
                        width: 24px;
                        height: 24px;
                        object-fit: contain;
                        opacity: 0.7;
                    }

                    .bottom-nav-item.active .bottom-nav-icon {
                        opacity: 1;
                    }

                    .bottom-nav-label {
                        font-size: 10px;
                        font-weight: 500;
                        margin-top: 2px;
                    }
                }
            `}</style>

            <nav className="bottom-nav">
                <a
                    href="/"
                    className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}
                >
                    <img src="/assets/home.png" alt="Home" className="bottom-nav-icon" />
                    <span className="bottom-nav-label">Home</span>
                </a>

                <a
                    href="/explore"
                    className={`bottom-nav-item ${isActive('/explore') ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/explore');
                    }}
                >
                    <img src="/assets/compass.png" alt="Explore" className="bottom-nav-icon" />
                    <span className="bottom-nav-label">Explore</span>
                </a>

                {isAuthenticated && (
                    <a
                        href="/create-pin"
                        className={`bottom-nav-item ${isActive('/create-pin') ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/create-pin');
                        }}
                    >
                        <img src="/assets/add.png" alt="Create" className="bottom-nav-icon" />
                        <span className="bottom-nav-label">Create</span>
                    </a>
                )}

                {isAuthenticated && (
                    <a
                        href="/profile"
                        className={`bottom-nav-item ${isActive('/profile') || isActive('/settings/profile') ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/profile');
                        }}
                    >
                        <img src="/assets/avatar-default.svg" alt="Profile" className="bottom-nav-icon" />
                        <span className="bottom-nav-label">Profile</span>
                    </a>
                )}
            </nav>
        </>
    );
};

export default BottomNav;

