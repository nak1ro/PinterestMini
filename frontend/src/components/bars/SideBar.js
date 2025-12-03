import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { selectUser } from '../../store/slices/authSlice';
import { logout as logoutAction } from '../../store/slices/authSlice';
import BeautifulDropdown, { BeautifulDropdownItem } from '../common/BeautifulDropdown';

const Sidebar = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = !!user;

    const handleMenuSelect = (eventKey) => {
        if (eventKey === 'profile-settings') {
            navigate('/settings/profile');
        }

        if (eventKey === 'logout') {
            dispatch(logoutAction());
            navigate('/');
        }
    };

    return (
        <>
            <style>{`
                .hover-container {
                    padding: 10px;
                    border-radius: 12px;
                    transition: background-color 0.3s ease;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .hover-container:hover {
                    background-color: rgba(185, 185, 185, 0.2);
                }

                .sidebar-more-toggle::after {
                    display: none !important;
                }

                .sidebar-dropdown-divider {
                    margin: 8px 0;
                    border-top: 1px solid #e0e0e0;
                }

                /* Hide sidebar on mobile */
                @media (max-width: 768px) {
                    .desktop-sidebar {
                        display: none !important;
                    }
                }
            `}</style>

            <div
                className="desktop-sidebar d-flex flex-column align-items-center p-2 position-fixed top-0 start-0 h-100"
                style={{
                    width: '80px',
                    zIndex: 1000,
                    borderRight: '1px solid rgba(100, 100, 100, 0.3)',
                }}
            >
                <div className="d-grid gap-5">

                    <div
                        className="text-white fs-3 text-decoration-none"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                        title="Pinterest Home"
                    >
                        <div className="hover-container">
                            <img
                                src={`${process.env.PUBLIC_URL || ''}/assets/Pinterest-logo.png`}
                                width="35"
                                height="35"
                                alt="Pinterest"
                            />
                        </div>
                    </div>

                    <div
                        className="nav-link text-white"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                        title="Home"
                    >
                        <div className="hover-container">
                            <img
                                src={`${process.env.PUBLIC_URL || ''}/assets/home.png`}
                                alt="Home"
                                width="35"
                                height="35"
                                className="rounded-3"
                            />
                        </div>
                    </div>

                    <div
                        className="nav-link text-white"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/explore')}
                        title="Explore"
                    >
                        <div className="hover-container">
                            <img
                                src={`${process.env.PUBLIC_URL || ''}/assets/compass.png`}
                                alt="Explore"
                                width="35"
                                height="35"
                                className="rounded-3"
                            />
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div
                            className="nav-link text-white"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/create-pin')}
                            title="Create Pin"
                        >
                            <div className="hover-container">
                                <img
                                    src={`${process.env.PUBLIC_URL || ''}/assets/add.png`}
                                    alt="Add"
                                    width="35"
                                    height="35"
                                    className="rounded-3"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {isAuthenticated && (
                    <div className="mt-auto position-relative">
                        <BeautifulDropdown
                            trigger={(
                                <div className="hover-container" title="More options">
                                    <img
                                        src={`${process.env.PUBLIC_URL || ''}/assets/more.png`}
                                        alt="Settings"
                                        width="35"
                                        height="35"
                                        className="rounded-3"
                                    />
                                </div>
                            )}
                            variant="transparent"
                            align="start"
                            drop="end"
                            onSelect={handleMenuSelect}
                            className="p-0 sidebar-more-toggle"
                            toggleStyle={{
                                border: 'none',
                                boxShadow: 'none',
                                backgroundColor: 'transparent',
                                padding: 0,
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            style={{ position: 'static' }}
                        >
                            <BeautifulDropdownItem eventKey="profile-settings">
                                Profile Settings
                            </BeautifulDropdownItem>
                            <div className="sidebar-dropdown-divider" />
                            <BeautifulDropdownItem
                                eventKey="logout"
                                className="text-danger"
                                style={{ color: '#d32f2f', fontWeight: 500 }}
                            >
                                Log out
                            </BeautifulDropdownItem>
                        </BeautifulDropdown>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;
