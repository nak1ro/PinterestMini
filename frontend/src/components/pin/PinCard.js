// components/pins/PinCard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PinPreviewModal from './PinPreviewModal';
import SaveToBoardModal from './SaveToBoardModal';
import AuthModal from '../auth/AuthModal';
import { useAppSelector } from '../../hooks/redux';
import { selectUserId, selectUser } from '../../store/slices/authSlice';

const PinCard = ({ pin, boardId, onRemoveFromBoard, onDelete, savedPinsState }) => {
    const { savePin, unsavePin, savedPins, refetch } = savedPinsState;
    useAppSelector(selectUserId);
    const user = useAppSelector(selectUser);
    const isAuthenticated = !!user;

    const [saved, setSaved] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showSaveToBoardModal, setShowSaveToBoardModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalType, setAuthModalType] = useState('signin');

    useEffect(() => {
        if (savedPins && Array.isArray(savedPins)) {
            const isInSavedPins = savedPins.some((p) => p.id === pin.id);
            setSaved(isInSavedPins);
        }
    }, [savedPins, pin.id]);

    const handleSaveClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            setAuthModalType('signin');
            setShowAuthModal(true);
            return;
        }

        if (saved) {
            await unsavePin(pin.id);
            setSaved(false); // optimistic
            await refetch(); // sync with server / shared state
        } else {
            await savePin(pin.id);
            setSaved(true); // optimistic
            await refetch();
        }
    };

    const handleSaveToBoardClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSaveToBoardModal(true);
    };

    const handleRemoveFromBoardClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (boardId && onRemoveFromBoard) {
            await onRemoveFromBoard(pin.id);
        }
    };
    const handleSavedToBoard = async () => {
        await refetch();
    };

    const handlePinClick = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    return (
        <>
            <motion.div
                className="card mb-3 shadow-sm border-0 overflow-hidden position-relative"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={handlePinClick}
                style={{ cursor: 'pointer' }}
            >
                <div className="position-relative w-100">
                    <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="img-fluid w-100"
                        style={{ display: 'block' }}
                    />

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between"
                                style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Top Row */}
                                <div className="d-flex fw-bold justify-content-between align-items-center p-3 gap-2">
                                    {/* Left side buttons */}
                                    <div className="d-flex gap-2 align-items-center">
                                        <motion.button
                                            className={`btn btn-sm px-3 fw-bold rounded-3 d-flex align-items-center justify-content-center`}
                                            onClick={handleSaveClick}
                                            style={{
                                                fontSize: '0.9rem',
                                                border: 'none',
                                                height: '36px',
                                                minWidth: '70px',
                                                background: saved
                                                    ? '#dddddd'
                                                    : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                                color: saved ? '#333' : '#fff',
                                            }}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {saved ? 'Saved' : 'Save'}
                                        </motion.button>

                                        {/* Add to boards button - only show if authenticated and not inside a board view */}
                                        {isAuthenticated && !boardId && (
                                            <motion.button
                                                className="btn btn-sm px-2 rounded-3 d-flex align-items-center justify-content-center"
                                                onClick={handleSaveToBoardClick}
                                                style={{
                                                    fontSize: '0.9rem',
                                                    border: '1px solid rgba(255,255,255,0.5)',
                                                    height: '36px',
                                                    width: '36px',
                                                    background: 'rgba(255,255,255,0.2)',
                                                    color: '#fff',
                                                }}
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                title="Add to board"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                                </svg>
                                            </motion.button>
                                        )}

                                        {/* Remove from board button (only show when viewing a board) */}
                                        {boardId && (
                                            <motion.button
                                                className="btn btn-sm px-2 rounded-3 d-flex align-items-center justify-content-center"
                                                onClick={handleRemoveFromBoardClick}
                                                style={{
                                                    fontSize: '0.9rem',
                                                    border: '1px solid rgba(255,255,255,0.5)',
                                                    height: '36px',
                                                    width: '36px',
                                                    background: 'rgba(220, 53, 69, 0.8)',
                                                    color: '#fff',
                                                }}
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                title="Remove from board"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19 13H5v-2h14v2z" />
                                                </svg>
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* Owner link (right) */}
                                    <motion.div
                                        className="d-flex align-items-center rounded-3 px-2 py-1"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                            height: '36px',
                                            minWidth: '80px',
                                        }}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Link
                                            to={`/profile/${pin.owner?.username || pin.owner?.id}`}
                                            className="d-flex align-items-center text-white text-decoration-none w-100 h-100"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                src={
                                                    pin.owner?.profilePictureUrl ||
                                                    `${process.env.PUBLIC_URL || ''}/assets/avatar-default.svg`
                                                }
                                                alt={pin.owner?.username || 'User'}
                                                className="rounded-circle me-2"
                                                style={{
                                                    width: '26px',
                                                    height: '26px',
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.target.src = `${
                                                        process.env.PUBLIC_URL || ''
                                                    }/assets/avatar-default.svg`;
                                                }}
                                            />
                                            <span className="small">
                                                {pin.owner?.username?.length > 6
                                                    ? `${pin.owner.username.slice(0, 6)}...`
                                                    : pin.owner?.username || 'Unknown'}
                                            </span>
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPreview && (
                    <PinPreviewModal
                        pin={pin}
                        onClose={() => setShowPreview(false)}
                        onDelete={onDelete}
                    />
                )}
            </AnimatePresence>

            <SaveToBoardModal
                show={showSaveToBoardModal}
                onClose={() => setShowSaveToBoardModal(false)}
                pinId={pin.id}
                onSaved={handleSavedToBoard}
            />

            {showAuthModal && (
                <AuthModal
                    type={authModalType}
                    onClose={() => setShowAuthModal(false)}
                    onSwitchType={(type) => setAuthModalType(type)}
                />
            )}
        </>
    );
};

export default PinCard;
