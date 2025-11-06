import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Person, Gear, BoxArrowRight } from "react-bootstrap-icons";
import { useAppContext } from '../../context/AppContext';

const ProfileDropdown = () => {
    const { avatarUrl, logout, user } = useAppContext();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/');
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        navigate('/profile');
    };

    const handleSettingsClick = () => {
        setIsOpen(false);
        navigate('/settings/profile');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    return (
        <div className="ms-3 position-relative" ref={dropdownRef}>
            <motion.button
                ref={buttonRef}
                className="btn p-0 border-0 bg-transparent"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    zIndex: 1001
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img
                    src={avatarUrl}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                        objectFit: 'cover',
                        width: '40px',
                        height: '40px',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease'
                    }}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="position-fixed top-0 start-0 w-100 h-100"
                            style={{ zIndex: 1000 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            className="position-absolute end-0"
                            style={{
                                zIndex: 1001,
                                marginTop: '8px',
                                minWidth: '220px'
                            }}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            <div
                                className="bg-white rounded-3"
                                style={{
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* User Info Header */}
                                {user && (
                                    <div className="px-4 py-3 border-bottom" style={{ backgroundColor: '#fafafa' }}>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={avatarUrl}
                                                alt={user.username}
                                                className="rounded-circle me-3"
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    objectFit: 'cover',
                                                    border: '2px solid #fff',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <div className="flex-grow-1 min-w-0">
                                                <div className="fw-bold text-truncate" style={{ color: '#111', fontSize: '0.95rem' }}>
                                                    {user.username}
                                                </div>
                                                {user.email && (
                                                    <div className="text-muted text-truncate small" style={{ fontSize: '0.8rem' }}>
                                                        {user.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Menu Items */}
                                <div className="py-2">
                                    <motion.button
                                        className="w-100 btn text-start border-0 bg-transparent d-flex align-items-center px-4 py-3"
                                        onClick={handleProfileClick}
                                        style={{
                                            color: '#111',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        whileHover={{ backgroundColor: '#f1f1f1' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Person className="me-3" size={20} style={{ color: '#666' }} />
                                        <span className="fw-medium">My Profile</span>
                                    </motion.button>

                                    <motion.button
                                        className="w-100 btn text-start border-0 bg-transparent d-flex align-items-center px-4 py-3"
                                        onClick={handleSettingsClick}
                                        style={{
                                            color: '#111',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        whileHover={{ backgroundColor: '#f1f1f1' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Gear className="me-3" size={20} style={{ color: '#666' }} />
                                        <span className="fw-medium">Settings</span>
                                    </motion.button>

                                    <hr className="my-2" style={{ borderColor: '#e0e0e0', margin: '4px 0' }} />

                                    <motion.button
                                        className="w-100 btn text-start border-0 bg-transparent d-flex align-items-center px-4 py-3"
                                        onClick={handleLogout}
                                        style={{
                                            color: '#e60023',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        whileHover={{ backgroundColor: '#fee' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <BoxArrowRight className="me-3" size={20} />
                                        <span className="fw-medium">Log out</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
