import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {X} from 'react-bootstrap-icons';
import PinEditModal from './PinEditModal';
import SaveToBoardModal from './SaveToBoardModal';
import AuthModal from '../auth/AuthModal';

import useSavedPins from '../../hooks/useSavedPins';
import usePinLike from '../../hooks/usePinLike';
import useComments from '../../hooks/useComments';
import useIsMobile from '../../hooks/useIsMobile';
import {useAppContext} from '../../context/AppContext';
import {deletePin} from '../../services/pinService';

// -- Small animated icon button ------------------------------------------------
const ActionButton = ({icon, onClick, alt, animationKey}) => (
    <motion.button
        className="btn btn-sm d-flex align-items-center"
        onClick={onClick}
        whileHover={{scale: 1.05}}
        transition={{type: 'spring', stiffness: 300, damping: 20}}
        style={{
            outline: 'none',
            boxShadow: 'none',
            borderColor: 'transparent',
            background: 'transparent',
        }}
    >
        <motion.img
            key={animationKey}
            src={icon}
            alt={alt}
            style={{width: 26, height: 26}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
        />
    </motion.button>
);

// -- Comment input -------------------------------------------------------------
const CommentInput = ({newComment, setNewComment, onPost, isAuthenticated, onAuthRequired}) => (
    <div className="d-flex gap-2">
        <input
            type="text"
            className="form-control rounded-3"
            placeholder={isAuthenticated ? "Add a comment..." : "Log in to add a comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onClick={!isAuthenticated ? onAuthRequired : undefined}
            readOnly={!isAuthenticated}
            style={{
                cursor: !isAuthenticated ? 'pointer' : 'text',
                border: '1px solid #ddd',
                padding: '12px 16px',
                fontSize: '0.95rem',
                backgroundColor: isAuthenticated ? '#fff' : '#f8f8f8',
            }}
        />
        <motion.button 
            className="btn fw-bold px-4 rounded-3" 
            type="button" 
            onClick={isAuthenticated ? onPost : onAuthRequired}
            disabled={!isAuthenticated && !newComment.trim()}
            style={{
                background: isAuthenticated && newComment.trim()
                    ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)'
                    : '#efefef',
                color: isAuthenticated && newComment.trim() ? '#fff' : '#999',
                border: 'none',
                height: '48px',
                minWidth: '80px',
            }}
            whileHover={isAuthenticated && newComment.trim() ? {scale: 1.02} : {}}
            whileTap={isAuthenticated && newComment.trim() ? {scale: 0.98} : {}}
        >
            Post
        </motion.button>
    </div>
);

// -- Comment list --------------------------------------------------------------
const CommentList = ({comments, loading, currentUserId, onDeleteComment, onNavigateToProfile}) => {
    if (loading) return (
        <div className="text-center py-4">
            <p className="text-muted">Loading comments...</p>
        </div>
    );
    if (!comments || comments.length === 0) return (
        <div className="text-center py-4">
            <p className="text-muted">No comments yet. Be the first to comment!</p>
        </div>
    );

    return (
        <div className="d-flex flex-column gap-3">
            {comments.map((c) => {
                const avatar =
                    (c.user && c.user.profilePictureUrl) ||
                    c.userAvatarUrl ||
                    '/assets/avatar-default.svg';
                const name = (c.user && c.user.username) || c.username || 'User';
                const username = (c.user && c.user.username) || c.username;
                const commentUserId = c.user?.id || c.userId;
                const canDelete = currentUserId && commentUserId === currentUserId;

                const handleProfileClick = (e) => {
                    e.stopPropagation();
                    if (username && onNavigateToProfile) {
                        onNavigateToProfile(username);
                    }
                };

                return (
                    <div key={c.id} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{backgroundColor: '#fff'}}>
                        <motion.img
                            src={avatar}
                            alt={name}
                            className="rounded-circle"
                            style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                flexShrink: 0,
                                cursor: username ? 'pointer' : 'default',
                            }}
                            onClick={username ? handleProfileClick : undefined}
                            whileHover={username ? { scale: 1.05 } : {}}
                            whileTap={username ? { scale: 0.95 } : {}}
                            onError={(e) => {
                                e.currentTarget.src = '/assets/avatar-default.svg';
                            }}
                        />
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                                <div>
                                    <motion.span
                                        className="fw-semibold me-2"
                                        style={{
                                            color: '#111',
                                            fontSize: '0.95rem',
                                            cursor: username ? 'pointer' : 'default',
                                        }}
                                        onClick={username ? handleProfileClick : undefined}
                                        whileHover={username ? { opacity: 0.7 } : {}}
                                    >
                                        {name}
                                    </motion.span>
                                    <span className="text-muted" style={{fontSize: '0.85rem'}}>
                                        {new Date(c.createdAt).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric' 
                                        })}
                                    </span>
                                </div>
                                {canDelete && onDeleteComment && (
                                    <motion.button
                                        className="btn btn-sm p-0"
                                        onClick={() => onDeleteComment(c.id)}
                                        style={{
                                            fontSize: '0.75rem',
                                            color: '#dc3545',
                                            background: 'transparent',
                                            border: 'none',
                                            width: '24px',
                                            height: '24px',
                                        }}
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        title="Delete comment"
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </div>
                            <p className="mb-0" style={{color: '#333', fontSize: '0.95rem', lineHeight: '1.5'}}>{c.content}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// -- Pin preview modal (LEFT preview + RIGHT editor portal) --------------------
const PinPreviewModal = ({pin, onClose, onDelete}) => {
    // Hooks for saved / likes / comments
    const {savePin, unsavePin, savedPins, isPinSaved, refetch} = useSavedPins();
    const {liked, likeCount, toggleLike} = usePinLike(pin?.id);
    const {comments, loading: loadingComments, addComment, deleteComment} = useComments(pin?.id);
    const {user, userId} = useAppContext();
    const isAuthenticated = !!user;

    // Local state for new comment + editor flag
    const [newComment, setNewComment] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showSaveToBoardModal, setShowSaveToBoardModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalType, setAuthModalType] = useState('signin');
    const [showEnlargedImage, setShowEnlargedImage] = useState(false);
    const [showOwnerActions, setShowOwnerActions] = useState(false);

    // Local working copy so edits reflect immediately in the preview
    const [localPin, setLocalPin] = useState(pin);
    useEffect(() => setLocalPin(pin), [pin]);

    // Handle Escape key to close enlarged image
    useEffect(() => {
        if (!showEnlargedImage) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setShowEnlargedImage(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showEnlargedImage]);

    const commentRef = useRef(null);
    const ownerActionsRef = useRef(null);
    const lastCheckedPinId = useRef(null);
    const navigate = useNavigate();
    const isOwner =
        (localPin && localPin.ownerId && localPin.ownerId === userId) ||
        (localPin && localPin.owner && localPin.owner.id === userId);
    const isMobile = useIsMobile(768);

    const avatarUrl = localPin?.owner?.profilePictureUrl || '/assets/avatar-default.svg';
    const username = localPin?.owner?.username || 'Unknown';

    // Check savedPins array first (optimistic check)
    useEffect(() => {
        if (savedPins && Array.isArray(savedPins) && localPin?.id) {
            const isInSavedPins = savedPins.some(p => p.id === localPin.id);
            setSaved(isInSavedPins);
        }
    }, [savedPins, localPin?.id]);

    // When modal opens or pin changes, check saved status via API (only if authenticated)
    useEffect(() => {
        if (localPin?.id && lastCheckedPinId.current !== localPin.id && isAuthenticated) {
            lastCheckedPinId.current = localPin.id;
            isPinSaved(localPin.id)
                .then((isSaved) => {
                    setSaved(isSaved);
                })
                .catch(() => {
                    // Keep current saved state on error
                });
        }
    }, [localPin?.id, isPinSaved, isAuthenticated]);

    // -- Header actions ----------------------------------------------------------
    const handleShare = async (e) => {
        e.stopPropagation();
        const pinUrl = `${window.location.origin}/pin/${localPin.id}`;
        try {
            await navigator.clipboard.writeText(pinUrl);
            // Show temporary message
            const shareButton = e.currentTarget;
            const originalTitle = shareButton.getAttribute('title') || '';
            shareButton.setAttribute('title', 'Link copied!');
            setTimeout(() => {
                shareButton.setAttribute('title', originalTitle || 'Share');
            }, 2000);
            
            // Visual feedback - could also use a toast library here
            const tempAlert = document.createElement('div');
            tempAlert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
            tempAlert.style.zIndex = '9999';
            tempAlert.textContent = 'Link copied to clipboard!';
            document.body.appendChild(tempAlert);
            setTimeout(() => {
                tempAlert.remove();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
            alert('Failed to copy link. Please try again.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        try {
            await deleteComment(commentId);
        } catch (err) {
            console.error('Failed to delete comment:', err);
            alert('Failed to delete comment. Please try again.');
        }
    };

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOwnerActions(false);
        setShowEdit(true);
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOwnerActions(false);
        if (!window.confirm('Are you sure you want to delete this pin? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePin(localPin.id);
            // Close the modal
            onClose();
            // Notify parent component if callback provided
            if (onDelete) {
                onDelete(localPin.id);
            }
        } catch (err) {
            console.error('Failed to delete pin:', err);
            alert('Failed to delete pin. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // If not authenticated, open login modal
        if (!isAuthenticated) {
            setAuthModalType('signin');
            setShowAuthModal(true);
            return;
        }
        
        // Authenticated users can save/unsave
        if (saved) {
            await unsavePin(localPin.id);
            setSaved(false);
            await refetch();
        } else {
            await savePin(localPin.id);
            setSaved(true);
            await refetch();
        }
    };

    const handleSaveToBoardClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSaveToBoardModal(true);
    };

    const handleSavedToBoard = async (boardIds) => {
        // Refresh saved pins list in case we need to update UI
        await refetch();
    };

    // -- Comments ----------------------------------------------------------------
    const commentsEnabled = localPin?.allowComments !== false;

    const scrollToComments = () => {
        if (!commentsEnabled) return;
        commentRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const handlePostComment = async () => {
        // If not authenticated, open login modal
        if (!isAuthenticated) {
            setAuthModalType('signin');
            setShowAuthModal(true);
            return;
        }
        
        if (!commentsEnabled) return;

        // Authenticated users can post comments
        if (newComment.trim()) {
            await addComment(newComment);
            setNewComment('');
        }
    };

    const handleAuthRequired = () => {
        setAuthModalType('signin');
        setShowAuthModal(true);
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        
        // If not authenticated, open login modal
        if (!isAuthenticated) {
            setAuthModalType('signin');
            setShowAuthModal(true);
            return;
        }
        
        // Authenticated users can like/unlike
        toggleLike();
    };

    // -- Profile navigation ------------------------------------------------------
    const goToAuthorProfile = (e) => {
        e.stopPropagation();
        if (localPin.owner?.username) {
            navigate(`/profile/${localPin.owner.username}`);
        }
    };

    const goToUserProfile = (username) => {
        if (username) {
            navigate(`/profile/${username}`);
        }
    };

    // -- Apply edits from the editor modal --------------------------------------
    const handleApplyEdits = (updates) => {
        // Merge fields we allow to change right now (title, description, tags, allowComments)
        setLocalPin((prev) => {
            const next = {...prev};
            if (typeof updates.title === 'string') next.title = updates.title;
            if (typeof updates.description === 'string') next.description = updates.description;
            if (Array.isArray(updates.tags)) next.tags = updates.tags;
            if (typeof updates.allowComments === 'boolean') next.allowComments = updates.allowComments;
            return next;
        });
        setShowEdit(false);
    };

    useEffect(() => {
        if (!showOwnerActions) return;
        const handleClickOutside = (event) => {
            if (ownerActionsRef.current && !ownerActionsRef.current.contains(event.target)) {
                setShowOwnerActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showOwnerActions]);

    useEffect(() => {
        if (!isMobile) {
            setShowOwnerActions(false);
        }
    }, [isMobile]);

    if (!localPin) return null;

    return (
        <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.55)'}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose} // click outside closes
        >
            <motion.div
                className="bg-white overflow-hidden"
                style={{
                    maxWidth: '900px',
                    width: '95vw',
                    maxHeight: '95vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()} // prevent backdrop close when inside
                initial={{scale: 0.95, opacity: 0, y: 20}}
                animate={{scale: 1, opacity: 1, y: 0}}
                transition={{duration: 0.3, ease: 'easeOut'}}
            >
                <div className="overflow-auto" style={{flex: 1}}>
                    {/* HEADER */}
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{backgroundColor: '#fff'}}>
                        {/* -- Left: Action buttons */}
                        <div className="d-flex align-items-center gap-2">
                            <motion.button
                                className="btn d-flex align-items-center gap-2 rounded-3 px-4"
                                onClick={handleLikeClick}
                                style={{
                                    background: liked ? 'rgba(230, 0, 35, 0.1)' : 'transparent',
                                    border: 'none',
                                    color: liked ? '#e60023' : '#111',
                                    height: '48px',
                                }}
                                whileHover={{scale: 1.05, background: liked ? 'rgba(230, 0, 35, 0.15)' : 'rgba(0,0,0,0.05)'}}
                                whileTap={{scale: 0.95}}
                            >
                                <img
                                    src={liked ? '/assets/like_full.png' : '/assets/like.png'}
                                    alt={liked ? 'Unlike' : 'Like'}
                                    style={{width: 24, height: 24}}
                                />
                                <span className="fw-semibold" style={{fontSize: '0.95rem'}}>{likeCount}</span>
                            </motion.button>

                            {!isMobile && commentsEnabled && (
                                <motion.button
                                    className="btn d-flex align-items-center rounded-3 px-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        scrollToComments();
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#111',
                                        height: '48px',
                                        width: '48px',
                                    }}
                                    whileHover={{scale: 1.05, background: 'rgba(0,0,0,0.05)'}}
                                    whileTap={{scale: 0.95}}
                                >
                                    <img src="/assets/message.png" alt="comment" style={{width: 24, height: 24}} />
                                </motion.button>
                            )}

                            <motion.button
                                className="btn d-flex align-items-center rounded-3 px-3"
                                onClick={handleShare}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#111',
                                    height: '48px',
                                    width: '48px',
                                }}
                                whileHover={{scale: 1.05, background: 'rgba(0,0,0,0.05)'}}
                                whileTap={{scale: 0.95}}
                                title="Copy link"
                            >
                                <img src="/assets/share.png" alt="share" style={{width: 24, height: 24}} />
                            </motion.button>

                            {isOwner && (
                                <div className="position-relative" ref={ownerActionsRef}>
                                    <motion.button
                                        className="btn d-flex align-items-center rounded-3 px-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowOwnerActions((prev) => !prev);
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#111',
                                            height: '48px',
                                            width: '48px',
                                        }}
                                        whileHover={{scale: 1.05, background: 'rgba(0,0,0,0.05)'}}
                                        whileTap={{scale: 0.95}}
                                        title="More options"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="5" cy="12" r="2" />
                                            <circle cx="12" cy="12" r="2" />
                                            <circle cx="19" cy="12" r="2" />
                                        </svg>
                                    </motion.button>
                                    <AnimatePresence>
                                        {showOwnerActions && (
                                            <motion.div
                                                initial={{opacity: 0, y: -4}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -4}}
                                                transition={{duration: 0.15}}
                                                className="position-absolute"
                                                style={{
                                                    top: '110%',
                                                    right: isMobile ? 0 : -8,
                                                    minWidth: isMobile ? '180px' : '200px',
                                                    zIndex: 20,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-6px',
                                                        right: isMobile ? '18px' : '22px',
                                                        width: '12px',
                                                        height: '12px',
                                                        background: '#fff',
                                                        transform: 'rotate(45deg)',
                                                        boxShadow: '-1px -1px 3px rgba(15, 15, 15, 0.1)',
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        background: isMobile
                                                            ? 'linear-gradient(145deg, #ffffff 0%, #f6f6f6 100%)'
                                                            : '#fff',
                                                        borderRadius: '16px',
                                                        boxShadow: '0 16px 34px rgba(15, 15, 15, 0.18)',
                                                        overflow: 'hidden',
                                                        padding: '8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '6px',
                                                        border: isMobile ? 'none' : '1px solid rgba(0,0,0,0.08)',
                                                    }}
                                                >
                                                    <motion.button
                                                        type="button"
                                                        onClick={handleEditClick}
                                                        style={{
                                                            background: '#fff',
                                                            borderRadius: '12px',
                                                            border: '1px solid rgba(0,0,0,0.04)',
                                                            padding: '10px 12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            fontSize: '0.92rem',
                                                            color: '#111',
                                                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                                                        }}
                                                    >
                                                        <img src="/assets/edit-text.png" alt="Edit" style={{width: 20, height: 20}} />
                                                        <span className="fw-semibold" style={{letterSpacing: '0.01em'}}>Edit pin</span>
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={handleDeleteClick}
                                                        disabled={isDeleting}
                                                        style={{
                                                            background: '#fff',
                                                            borderRadius: '12px',
                                                            border: '1px solid rgba(220,53,69,0.2)',
                                                            padding: '10px 12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            fontSize: '0.92rem',
                                                            color: '#dc3545',
                                                            opacity: isDeleting ? 0.6 : 1,
                                                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                                                        }}
                                                    >
                                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                        <span className="fw-semibold" style={{letterSpacing: '0.01em'}}>Delete pin</span>
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* -- Right: Save button and Add to boards button */}
                        <div className="d-flex gap-2 align-items-center">
                            <motion.button
                                className="btn btn-sm fw-bold px-4 rounded-3 d-flex align-items-center justify-content-center"
                                onClick={handleSaveClick}
                                style={{
                                    fontSize: '0.95rem',
                                    border: 'none',
                                    height: '40px',
                                    minWidth: '100px',
                                    background: saved
                                        ? '#efefef'
                                        : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    color: saved ? '#111' : '#fff',
                                    boxShadow: saved ? 'none' : '0 2px 8px rgba(230, 0, 35, 0.3)',
                                }}
                                whileHover={{scale: 1.02, boxShadow: saved ? 'none' : '0 4px 12px rgba(230, 0, 35, 0.4)'}}
                                whileTap={{scale: 0.98}}
                            >
                                {saved ? 'Saved' : 'Save'}
                            </motion.button>
                            
                            {/* Add to boards button - only show if authenticated */}
                            {isAuthenticated && (
                                <motion.button
                                    className="btn btn-sm fw-bold px-4 rounded-3 d-flex align-items-center justify-content-center"
                                    onClick={handleSaveToBoardClick}
                                    style={{
                                        fontSize: '0.95rem',
                                        border: '1px solid #ddd',
                                        height: '40px',
                                        background: '#fff',
                                        color: '#111',
                                    }}
                                    whileHover={{scale: 1.02, background: '#f8f8f8'}}
                                    whileTap={{scale: 0.98}}
                                    title="Add to boards"
                                >
                                    {isMobile ? '+' : 'Add to boards'}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="position-relative d-flex justify-content-center align-items-center px-4 py-4" style={{backgroundColor: '#f8f8f8'}}>
                        <motion.img
                            src={localPin.imageUrl}
                            alt={localPin.title}
                            className="img-fluid"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '75vh',
                                width: 'auto',
                                objectFit: 'contain',
                                borderRadius: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowEnlargedImage(true)}
                            whileHover={{ opacity: 0.9 }}
                            whileTap={{ scale: 0.98 }}
                            onError={(e) => {
                                e.currentTarget.src = '/assets/image-fallback.jpg';
                            }}
                        />
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="px-4 py-4">
                        {/* OWNER */}
                        <motion.div 
                            className="d-flex align-items-center mb-4 pb-3 border-bottom" 
                            onClick={goToAuthorProfile}
                            style={{cursor: 'pointer'}}
                            whileHover={{opacity: 0.8}}
                        >
                            <img
                                src={avatarUrl}
                                alt={username}
                                className="rounded-circle me-3"
                                style={{width: '48px', height: '48px', objectFit: 'cover'}}
                                onError={(e) => {
                                    e.currentTarget.src = '/assets/avatar-default.svg';
                                }}
                            />
                            <div>
                                <h6 className="mb-0 fw-bold" style={{color: '#111'}}>{username}</h6>
                                <small className="text-muted">Pin creator</small>
                            </div>
                        </motion.div>

                        {/* TITLE + DESCRIPTION + TAGS */}
                        <div className="mb-4">
                            <h3 className="fw-bold mb-3" style={{fontSize: '1.75rem', color: '#111', lineHeight: '1.3'}}>
                                {localPin.title || 'Untitled Pin'}
                            </h3>
                            {localPin.description && (
                                <p className="mb-4" style={{color: '#555', fontSize: '1rem', lineHeight: '1.6'}}>
                                    {localPin.description}
                                </p>
                            )}

                            {Array.isArray(localPin.tags) && localPin.tags.length > 0 && (
                                <div className="d-flex flex-wrap gap-2">
                                    {localPin.tags.map((tag) => {
                                        const tagName = typeof tag === 'string' ? tag : tag.name;
                                        return (
                                            <Link
                                                to={`/tag/${encodeURIComponent(tagName)}`}
                                                key={typeof tag === 'string' ? tag : tag.id}
                                                className="badge rounded-pill px-3 py-2 text-decoration-none"
                                                style={{
                                                    background: '#efefef',
                                                    color: '#111',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = '#e2e2e2';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = '#efefef';
                                                }}
                                            >
                                                #{tagName}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COMMENTS */}
                    {commentsEnabled && (
                        <div
                            className="px-4 pb-4"
                            ref={commentRef}
                            style={{backgroundColor: '#fafafa', borderTop: '1px solid #eee'}}
                        >
                            <h5 className="fw-bold mb-3 pt-4" style={{color: '#111', fontSize: '1.25rem'}}>
                                Comments {comments.length > 0 && <span className="text-muted" style={{fontSize: '0.9rem', fontWeight: 'normal'}}>({comments.length})</span>}
                            </h5>
                            <div className="mb-4">
                                <CommentInput
                                    newComment={newComment}
                                    setNewComment={setNewComment}
                                    onPost={handlePostComment}
                                    isAuthenticated={isAuthenticated}
                                    onAuthRequired={handleAuthRequired}
                                />
                            </div>
                            <CommentList 
                                comments={comments} 
                                loading={loadingComments}
                                currentUserId={userId}
                                onDeleteComment={handleDeleteComment}
                                onNavigateToProfile={goToUserProfile}
                            />
                        </div>
                    )}
                </div>

                {isMobile && (
                    <div
                        className="px-3 pb-3 pt-2 border-top"
                        style={{
                            backgroundColor: '#fff',
                            boxShadow: '0 -6px 16px rgba(0,0,0,0.08)',
                        }}
                    >
                        <motion.button
                            type="button"
                            className="btn w-100 fw-bold rounded-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            style={{
                                height: '48px',
                                fontSize: '1rem',
                                background: '#efefef',
                                border: 'none',
                                color: '#111',
                            }}
                            whileHover={{scale: 1.02, backgroundColor: '#e2e2e2'}}
                            whileTap={{scale: 0.98}}
                        >
                            Close pin
                        </motion.button>
                    </div>
                )}
            </motion.div>

            {/* EDITOR MODAL (portal) */}
            <PinEditModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                pin={localPin}
                onApply={handleApplyEdits}
            />

            {/* SAVE TO BOARD MODAL */}
            <SaveToBoardModal
                show={showSaveToBoardModal}
                onClose={() => setShowSaveToBoardModal(false)}
                pinId={localPin?.id}
                onSaved={handleSavedToBoard}
            />

            {/* AUTH MODAL */}
            {showAuthModal && (
                <AuthModal
                    type={authModalType}
                    onClose={() => setShowAuthModal(false)}
                    onSwitchType={(type) => setAuthModalType(type)}
                />
            )}

            {/* ENLARGED IMAGE MODAL */}
            <AnimatePresence>
                {showEnlargedImage && (
                    <>
                        <motion.div
                            className="position-fixed top-0 start-0 w-100 h-100"
                            style={{ zIndex: 3000, backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEnlargedImage(false);
                            }}
                        />
                        <div 
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ zIndex: 3001, pointerEvents: 'none' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEnlargedImage(false);
                            }}
                        >
                            <motion.div
                                className="position-relative d-flex align-items-center justify-content-center"
                                style={{
                                    width: '100vw',
                                    height: '100vh',
                                    pointerEvents: 'auto',
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEnlargedImage(false);
                                }}
                            >
                                <img
                                    src={localPin?.imageUrl}
                                    alt={localPin?.title}
                                    style={{
                                        maxWidth: '98vw',
                                        maxHeight: '98vh',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onError={(e) => {
                                        e.currentTarget.src = '/assets/image-fallback.jpg';
                                    }}
                                />
                                <motion.button
                                    className="position-absolute top-0 end-0 m-3 btn btn-sm p-0 border-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEnlargedImage(false);
                                    }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                    }}
                                    whileHover={{ scale: 1.1, backgroundColor: '#f8f8f8' }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={20} style={{ color: '#111' }} />
                                </motion.button>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PinPreviewModal;
