import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import useSavedPins from '../../../hooks/useSavedPins';

const PinPreviewModal = ({ pin, onClose }) => {
    const { savePin, unsavePin, isPinSaved } = useSavedPins();
    const saved = isPinSaved(pin.id);
    const commentRef = useRef(null);

    if (!pin) return null;

    const avatarUrl = pin.owner?.profilePictureUrl || '/assets/avatar-default.svg';
    const username = pin.owner?.username || 'Unknown';

    const handleSave = () => saved ? unsavePin(pin.id) : savePin(pin.id);
    const handleDownload = (e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = pin.imageUrl;
        a.download = 'pin.jpg';
        a.click();
    };

    const scrollToComments = () => {
        if (commentRef.current) {
            commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
            style={{ zIndex: 1050 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="card shadow-lg overflow-hidden"
                style={{
                    maxWidth: '800px',
                    width: '100%',
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Scrollable content */}
                <div className="overflow-auto" style={{ flex: 1 }}>
                    {/* Header with actions */}
                    <div className="card-header d-flex justify-content-between align-items-center p-3">
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-sm d-flex align-items-center gap-1"
                                onClick={() => console.log('Liked')}
                            >
                                <img src="/assets/like.png" alt="like" style={{ width: 26, height: 26 }} />
                                <span className="fw-semibold">15</span>
                            </button>

                            <button
                                className="btn btn-sm d-flex align-items-center"
                                onClick={scrollToComments}
                            >
                                <img src="/assets/message.png" alt="comment" style={{ width: 26, height: 26 }} />
                            </button>

                            <button
                                className="btn btn-sm d-flex align-items-center"
                            >
                                <img src="/assets/share.png" alt="share" style={{ width: 26, height: 26 }} />
                            </button>
                        </div>

                        <button
                            className={`btn btn-sm px-3 rounded-3 ${saved ? 'btn-light border' : 'btn-danger'}`}
                            style={{
                                fontSize: '1rem'
                            }}
                            onClick={handleSave}
                        >
                            {saved ? 'Saved' : 'Save'}
                        </button>
                    </div>

                    {/* Image section */}
                    <div className="position-relative d-flex justify-content-center mb-3 mt-3 align-items-center px-3">
                        <img
                            src={pin.imageUrl}
                            alt={pin.title}
                            className="img-fluid rounded-3"
                            style={{
                                maxWidth: '100%',
                                height: '525px',
                                objectFit: 'contain',
                            }}
                            onError={(e) => {
                                e.target.src = '/assets/image-fallback.jpg';
                            }}
                        />
                    </div>

                    {/* Title + Description */}
                    <div className="card-body pt-0">
                        <h5 className="card-title fw-bold mb-2">{pin.title || 'Untitled Pin'}</h5>
                        <p className="card-text small mb-2">
                            {pin.description || 'No description provided.'}
                        </p>

                        {/* Tags */}
                        <div className="mb-2 d-flex flex-wrap gap-2">
                            {(pin.tag || []).map((tag) => (
                                <span key={tag} className="badge bg-secondary">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="card-footer bg-transparent border-top-0 px-3 py-2">
                        <div className="d-flex align-items-center">
                            <img
                                src={avatarUrl}
                                alt={username}
                                className="rounded-circle me-2"
                                style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/assets/avatar-default.svg'; }}
                            />
                            <h6 className="mb-0">{username}</h6>
                        </div>
                    </div>

                    {/* Comments section */}
                    <div className="card-footer bg-light mb-4 mt-2" ref={commentRef}>
                        <p className="mb-2 fw-bold">No comments yet</p>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Add a comment to start the conversation"
                                disabled
                            />
                            <button className="btn btn-outline-secondary" type="button" disabled>
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PinPreviewModal;
