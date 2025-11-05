import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
    const [showSettings, setShowSettings] = useState(false);
    const { user } = useAppContext();
    const isAuthenticated = !!user;

    const toggleSettings = () => {
        setShowSettings((prev) => !prev);
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
            `}</style>

            <div
                className="d-flex flex-column align-items-center p-2 position-fixed top-0 start-0 h-100"
                style={{
                    width: '80px',
                    zIndex: 1000,
                    borderRight: '1px solid rgba(100, 100, 100, 0.3)',
                }}
            >
                <div className="d-grid gap-5">

                    <a href="/" className="text-white fs-3 text-decoration-none">
                        <div className="hover-container">
                            <img
                                src="/assets/Pinterest-logo.png"
                                width="35"
                                height="35"
                                alt="Pinterest"
                            />
                        </div>
                    </a>

                    <a href="/" className="nav-link text-white">
                        <div className="hover-container">
                            <img
                                src="/assets/home.png"
                                alt="Home"
                                width="35"
                                height="35"
                                className="rounded-3"
                            />
                        </div>
                    </a>

                    <a href="/explore" className="nav-link text-white">
                        <div className="hover-container">
                            <img
                                src="/assets/compass.png"
                                alt="Explore"
                                width="35"
                                height="35"
                                className="rounded-3"
                            />
                        </div>
                    </a>

                    {isAuthenticated && (
                        <a href="/create-pin" className="nav-link text-white">
                            <div className="hover-container">
                                <img
                                    src="/assets/add.png"
                                    alt="Add"
                                    width="35"
                                    height="35"
                                    className="rounded-3"
                                />
                            </div>
                        </a>
                    )}
                </div>

                {isAuthenticated && (
                    <div className="mt-auto position-relative">
                        <button
                            onClick={toggleSettings}
                            className="btn btn-link p-0 border-0"
                        >
                            <div className="hover-container">
                                <img
                                    src="/assets/more.png"
                                    alt="Settings"
                                    width="35"
                                    height="35"
                                    className="rounded-3"
                                />
                            </div>
                        </button>

                        {showSettings && (
                            <div
                                className="position-absolute bottom-0 start-100 bg-white text-dark rounded shadow p-2"
                                style={{ minWidth: '150px', zIndex: 1050 }}
                            >
                                <a href="/settings/profile" className="dropdown-item">
                                    Profile Settings
                                </a>
                                <hr className="my-1" />
                                <a href="/logout" className="dropdown-item text-danger">
                                    Log out
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;
