import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from 'react-router-dom';
import useSavedPins from '../../hooks/useSavedPins';
import PinPreviewModal from './PinPreviewModal';
import SaveToBoardModal from './SaveToBoardModal';
import {useAppContext} from '../../context/AppContext';
import {deletePin} from '../../services/pinService';

const PinCard = ({pin, boardId, onRemoveFromBoard, onDelete}) => {
    const {savePin, unsavePin, savedPins, isPinSaved, refetch} = useSavedPins();
    const {userId} = useAppContext();
    const [saved, setSaved] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [checkedSavedStatus, setCheckedSavedStatus] = useState(false);
    const [showSaveToBoardModal, setShowSaveToBoardModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Check if current user is the owner
    const isOwner =
        (pin && pin.ownerId && pin.ownerId === userId) ||
        (pin && pin.owner && pin.owner.id === userId);

    // Check savedPins array first (optimistic check)
    useEffect(() => {
        if (savedPins && Array.isArray(savedPins)) {
            const isInSavedPins = savedPins.some(p => p.id === pin.id);
            setSaved(isInSavedPins);
        }
    }, [savedPins, pin.id]);

    // When hovering starts, check saved status via API
    useEffect(() => {
        if (isHovered && !checkedSavedStatus) {
            setCheckedSavedStatus(true);
            isPinSaved(pin.id)
                .then((isSaved) => {
                    setSaved(isSaved);
                })
                .catch(() => {
                    // Keep current saved state on error
                });
        }
    }, [isHovered, pin.id, isPinSaved, checkedSavedStatus]);

    // Reset checked flag when hover ends
    useEffect(() => {
        if (!isHovered) {
            setCheckedSavedStatus(false);
        }
    }, [isHovered]);

    const handleSaveClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (saved) {
            await unsavePin(pin.id);
            setSaved(false);
            await refetch();
        } else {
            await savePin(pin.id);
            setSaved(true);
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

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm('Are you sure you want to delete this pin? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePin(pin.id);
            // Close preview modal if open
            setShowPreview(false);
            // Call parent callback if provided
            if (onDelete) {
                onDelete(pin.id);
            }
        } catch (err) {
            console.error('Failed to delete pin:', err);
            alert('Failed to delete pin. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSavedToBoard = async (boardId) => {
        // Just save to board, don't save the pin separately
        await refetch(); // Refresh in case we need to update UI
    };

    const handlePinClick = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    return (<>
        <motion.div
            className="card mb-3 shadow-sm border-0 overflow-hidden position-relative"
            whileHover={{y: -5}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handlePinClick}
            style={{cursor: 'pointer'}}
        >
            <div className="position-relative w-100">
                <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="img-fluid w-100"
                    style={{display: 'block'}}
                />

                <AnimatePresence>
                    {isHovered && (<motion.div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between"
                        style={{backgroundColor: 'rgba(0,0,0,0.5)', color: 'white'}}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                    >

                        {/* Top Row */}
                        <div className="d-flex fw-bold justify-content-between align-items-center p-3 gap-2">
                            {/* Left side: Save button, Save to board button, Remove from board (if in board view), Delete (if owner) */}
                            <div className="d-flex gap-2 align-items-center">
                                <motion.button
                                    className={`btn btn-sm px-3 fw-bold rounded-3 d-flex align-items-center justify-content-center`}
                                    onClick={handleSaveClick}
                                    style={{
                                        fontSize: '0.9rem',
                                        border: 'none',
                                        height: '36px',
                                        minWidth: '70px',
                                        background: saved ? '#dddddd' : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                        color: saved ? '#333' : '#fff',
                                    }}
                                    whileHover={{scale: 1.04}}
                                    whileTap={{scale: 0.97}}
                                >
                                    {saved ? 'Saved' : 'Save'}
                                </motion.button>
                                
                                {/* Save to board button (hide if already in board view) */}
                                {!boardId && (
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
                                        whileHover={{scale: 1.04}}
                                        whileTap={{scale: 0.97}}
                                        title="Save to board"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
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
                                        whileHover={{scale: 1.04}}
                                        whileTap={{scale: 0.97}}
                                        title="Remove from board"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 13H5v-2h14v2z"/>
                                        </svg>
                                    </motion.button>
                                )}

                                {/* Delete button (only show if user is the owner) */}
                                {isOwner && (
                                    <motion.button
                                        className="btn btn-sm px-2 rounded-3 d-flex align-items-center justify-content-center"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        style={{
                                            fontSize: '0.9rem',
                                            border: '1px solid rgba(255,255,255,0.5)',
                                            height: '36px',
                                            width: '36px',
                                            background: 'rgba(220, 53, 69, 0.9)',
                                            color: '#fff',
                                            opacity: isDeleting ? 0.6 : 1,
                                        }}
                                        whileHover={{scale: 1.04}}
                                        whileTap={{scale: 0.97}}
                                        title="Delete pin"
                                    >
                                        {isDeleting ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="spinner-border spinner-border-sm">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                                                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                            </svg>
                                        )}
                                    </motion.button>
                                )}
                            </div>

                            {/* Owner link (right) */}
                            <motion.div
                                className="d-flex align-items-center rounded-3 px-2 py-1"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.3)', height: '36px', minWidth: '80px',
                                }}
                                whileHover={{scale: 1.04}}
                                whileTap={{scale: 0.97}}
                            >
                                <Link
                                    to={`/profile/${pin.owner?.username || pin.owner?.id}`}
                                    className="d-flex align-items-center text-white text-decoration-none w-100 h-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img
                                        src={pin.owner?.profilePictureUrl || '/assets/avatar-default.svg'}
                                        alt={pin.owner?.username || 'User'}
                                        className="rounded-circle me-2"
                                        style={{width: '26px', height: '26px', objectFit: 'cover'}}
                                        onError={(e) => {
                                            e.target.src = '/assets/avatar-default.svg';
                                        }}
                                    />
                                    <span className="small">
                                              {pin.owner?.username?.length > 8
                                                  ? `${pin.owner.username.slice(0, 8)}...`
                                                  : pin.owner?.username || 'Unknown'}
                                    </span>
                                </Link>
                            </motion.div>

                        </div>
                    </motion.div>)}
                </AnimatePresence>

            </div>
        </motion.div>

        <AnimatePresence>
            {showPreview && (<PinPreviewModal pin={pin} onClose={() => setShowPreview(false)} onDelete={onDelete}/>)}
        </AnimatePresence>

        <SaveToBoardModal
            show={showSaveToBoardModal}
            onClose={() => setShowSaveToBoardModal(false)}
            pinId={pin.id}
            onSaved={handleSavedToBoard}
        />
    </>);
};

export default PinCard;
