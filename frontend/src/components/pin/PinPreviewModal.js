import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import PinEditModal from './PinEditModal';
import SaveToBoardModal from './SaveToBoardModal';

import useSavedPins from '../../hooks/useSavedPins';
import usePinLike from '../../hooks/usePinLike';
import useComments from '../../hooks/useComments';
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
const CommentInput = ({newComment, setNewComment, onPost}) => (
    <div className="input-group mb-3">
        <input
            type="text"
            className="form-control"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="button" onClick={onPost}>
            Post
        </button>
    </div>
);

// -- Comment list --------------------------------------------------------------
const CommentList = ({comments, loading}) => {
    if (loading) return <p>Loading comments...</p>;
    if (!comments || comments.length === 0) return <p>No comments yet</p>;

    return (
        <ul className="list-unstyled">
            {comments.map((c) => {
                const avatar =
                    (c.user && c.user.profilePictureUrl) ||
                    c.userAvatarUrl ||
                    '/assets/avatar-default.svg';
                const name = (c.user && c.user.username) || c.username || 'User';
                return (
                    <li key={c.id} className="d-flex mb-3 align-items-start">
                        <img
                            src={avatar}
                            alt={name}
                            className="rounded-circle me-2"
                            style={{width: 32, height: 32, objectFit: 'cover'}}
                            onError={(e) => {
                                e.currentTarget.src = '/assets/avatar-default.svg';
                            }}
                        />
                        <div>
                            <div className="fw-semibold">{name}</div>
                            <div className="small text-muted">
                                {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                            <div>{c.content}</div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

// -- Pin preview modal (LEFT preview + RIGHT editor portal) --------------------
const PinPreviewModal = ({pin, onClose, onDelete}) => {
    // Hooks for saved / likes / comments
    const {savePin, unsavePin, savedPins, isPinSaved, refetch} = useSavedPins();
    const {liked, likeCount, toggleLike} = usePinLike(pin?.id);
    const {comments, loading: loadingComments, addComment} = useComments(pin?.id);

    // Local state for new comment + editor flag
    const [newComment, setNewComment] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showSaveToBoardModal, setShowSaveToBoardModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Local working copy so edits reflect immediately in the preview
    const [localPin, setLocalPin] = useState(pin);
    useEffect(() => setLocalPin(pin), [pin]);

    const commentRef = useRef(null);
    const lastCheckedPinId = useRef(null);
    const navigate = useNavigate();

    const {userId} = useAppContext();
    const isOwner =
        (localPin && localPin.ownerId && localPin.ownerId === userId) ||
        (localPin && localPin.owner && localPin.owner.id === userId);

    const avatarUrl = localPin?.owner?.profilePictureUrl || '/assets/avatar-default.svg';
    const username = localPin?.owner?.username || 'Unknown';

    // Check savedPins array first (optimistic check)
    useEffect(() => {
        if (savedPins && Array.isArray(savedPins) && localPin?.id) {
            const isInSavedPins = savedPins.some(p => p.id === localPin.id);
            setSaved(isInSavedPins);
        }
    }, [savedPins, localPin?.id]);

    // When modal opens or pin changes, check saved status via API
    useEffect(() => {
        if (localPin?.id && lastCheckedPinId.current !== localPin.id) {
            lastCheckedPinId.current = localPin.id;
            isPinSaved(localPin.id)
                .then((isSaved) => {
                    setSaved(isSaved);
                })
                .catch(() => {
                    // Keep current saved state on error
                });
        }
    }, [localPin?.id, isPinSaved]);

    // -- Header actions ----------------------------------------------------------
    const handleDownload = (e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = localPin.imageUrl;
        a.download = 'pin.jpg';
        a.click();
    };

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowEdit(true);
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

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
    const scrollToComments = () => {
        commentRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const handlePostComment = async () => {
        if (newComment.trim()) {
            await addComment(newComment);
            setNewComment('');
        }
    };

    // -- Profile navigation ------------------------------------------------------
    const goToAuthorProfile = (e) => {
        e.stopPropagation();
        if (localPin.owner?.username) {
            navigate(`/profile/${localPin.owner.username}`);
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

    if (!localPin) return null;

    return (
        <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
            style={{zIndex: 1050}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose} // click outside closes
        >
            <motion.div
                className="card shadow-lg overflow-hidden"
                style={{
                    maxWidth: '800px',
                    width: '100%',
                    height: 'calc(100vh - 30px)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()} // prevent backdrop close when inside
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.3}}
            >
                <div className="overflow-auto" style={{flex: 1}}>
                    {/* HEADER */}
                    <div className="card-header d-flex justify-content-between align-items-center p-3">
                        {/* -- Left: like / comments / share / edit / delete */}
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-flex align-items-center justify-content-start"
                                style={{width: 60}}
                            >
                                <ActionButton
                                    icon={liked ? '/assets/like_full.png' : '/assets/like.png'}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike();
                                    }}
                                    alt={liked ? 'Unlike' : 'Like'}
                                    animationKey={liked ? 'liked' : 'unliked'}
                                />
                                <span className="fw-semibold ms-1">{likeCount}</span>
                            </div>

                            <ActionButton
                                icon="/assets/message.png"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    scrollToComments();
                                }}
                                alt="comment"
                                animationKey="message"
                            />

                            <ActionButton
                                icon="/assets/share.png"
                                onClick={handleDownload}
                                alt="share"
                                animationKey="share"
                            />

                            {isOwner && (
                                <>
                                    <ActionButton
                                        icon="/assets/edit-text.png"
                                        onClick={handleEditClick}
                                        alt="edit"
                                        animationKey="edit"
                                    />
                                    <motion.button
                                        className="btn btn-sm d-flex align-items-center"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        style={{
                                            outline: 'none',
                                            boxShadow: 'none',
                                            borderColor: 'transparent',
                                            background: 'transparent',
                                            opacity: isDeleting ? 0.6 : 1,
                                        }}
                                        whileHover={{scale: 1.05}}
                                        transition={{type: 'spring', stiffness: 300, damping: 20}}
                                        title="Delete pin"
                                    >
                                        {isDeleting ? (
                                            <motion.div
                                                style={{width: 26, height: 26}}
                                                animate={{rotate: 360}}
                                                transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
                                            >
                                                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                </svg>
                                            </motion.div>
                                        ) : (
                                            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                            </svg>
                                        )}
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {/* -- Right: Save button and Add to boards button */}
                        <div className="d-flex gap-2 align-items-center">
                            <motion.button
                                className="btn btn-sm fw-bold px-3 rounded-3 d-flex align-items-center justify-content-center"
                                onClick={handleSaveClick}
                                style={{
                                    fontSize: '1rem',
                                    border: saved ? 'solid 1px' : 'none',
                                    height: '36px',
                                    minWidth: '90px',
                                    background: saved
                                        ? '#dddddd'
                                        : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    color: saved ? '#333' : '#fff',
                                }}
                                whileHover={{scale: 1.04}}
                                whileTap={{scale: 0.97}}
                            >
                                {saved ? 'Saved' : 'Save'}
                            </motion.button>
                            
                            {/* Add to boards button */}
                            <motion.button
                                className="btn btn-sm fw-bold px-3 rounded-3 d-flex align-items-center justify-content-center"
                                onClick={handleSaveToBoardClick}
                                style={{
                                    fontSize: '1rem',
                                    border: 'solid 1px #ddd',
                                    height: '36px',
                                    background: '#fff',
                                    color: '#333',
                                }}
                                whileHover={{scale: 1.04}}
                                whileTap={{scale: 0.97}}
                                title="Add to boards"
                            >
                                Add to boards
                            </motion.button>
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="position-relative d-flex justify-content-center mb-3 mt-3 align-items-center px-3">
                        <img
                            src={localPin.imageUrl}
                            alt={localPin.title}
                            className="img-fluid rounded-3"
                            style={{maxWidth: '100%', height: '565px', objectFit: 'contain'}}
                            onError={(e) => {
                                e.currentTarget.src = '/assets/image-fallback.jpg';
                            }}
                        />
                    </div>

                    {/* TITLE + DESCRIPTION + TAGS */}
                    <div className="card-body pt-0">
                        <h4 className="fw-bold mb-2" style={{fontSize: '1.6rem'}}>
                            {localPin.title || 'Untitled Pin'}
                        </h4>
                        <p className="mb-3" style={{color: '#555', fontSize: '0.95rem'}}>
                            {localPin.description || ''}
                        </p>

                        {Array.isArray(localPin.tags) && localPin.tags.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {localPin.tags.map((tag) => (
                                    <Link
                                        to={`/tag/${encodeURIComponent(tag.name)}`}
                                        key={tag.id}
                                        className="badge bg-secondary d-flex align-items-center text-decoration-none"
                                        style={{padding: '0.5em 0.75em'}}
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* OWNER */}
                    <div className="card-footer bg-transparent border-top-0 mb-2 px-3 py-2">
                        <div className="d-flex align-items-center" onClick={goToAuthorProfile}
                             style={{cursor: 'pointer'}}>
                            <img
                                src={avatarUrl}
                                alt={username}
                                className="rounded-circle me-2"
                                style={{width: '40px', height: '40px', objectFit: 'cover'}}
                                onError={(e) => {
                                    e.currentTarget.src = '/assets/avatar-default.svg';
                                }}
                            />
                            <h6 className="mb-0">{username}</h6>
                        </div>
                    </div>

                    {/* COMMENTS */}
                    <div
                        className="card-footer pb-3 mt-2"
                        ref={commentRef}
                        style={{backgroundColor: 'transparent'}}
                    >
                        <p className="mb-2 fw-bold">Comments</p>
                        <CommentInput
                            newComment={newComment}
                            setNewComment={setNewComment}
                            onPost={handlePostComment}
                        />
                        <CommentList comments={comments} loading={loadingComments}/>
                    </div>
                </div>
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
        </motion.div>
    );
};

export default PinPreviewModal;
