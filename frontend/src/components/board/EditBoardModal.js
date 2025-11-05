// src/components/modals/EditBoardModal.jsx
import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Trash2, Lock, Globe, X } from 'react-bootstrap-icons';
import useBoardEditor from '../../hooks/useBoardEditor';

export default function EditBoardModal({ show, onClose, board, onUpdated, onDeleted }) {
    const {
        name, setName,
        description, setDescription,
        isPrivate, setIsPrivate,
        coverPreview,
        onPickCover,
        updateBoard,
        removeBoard,
        resetLocal,
        saving, deleting, error,
    } = useBoardEditor(board, { onUpdated, onDeleted });

    useEffect(() => {
        if (!show) resetLocal();
    }, [show, resetLocal]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) onPickCover(file);
    };

    const handleSave = async () => {
        try {
            await updateBoard();
            onClose();
        } catch {}
    };

    const handleDeleteBoard = async () => {
        if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) return;
        try {
            await removeBoard();
            onClose();
        } catch {}
    };

    if (!show) return null;

    return (
        <>
            <motion.div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 2000, backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <div 
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ zIndex: 2001, pointerEvents: 'none' }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white d-flex flex-column"
                    style={{
                        width: 'min(600px, 90vw)',
                        maxHeight: '90vh',
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        pointerEvents: 'auto',
                        overflow: 'hidden'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Cover Image Section */}
                    <div className="position-relative" style={{ height: '240px', backgroundColor: '#f8f8f8' }}>
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                                <svg
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ opacity: 0.4, marginBottom: '12px' }}
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                                <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>No cover image</span>
                            </div>
                        )}
                        <motion.label
                            htmlFor="cover-upload"
                            className="position-absolute bottom-0 end-0 m-3 d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                            style={{
                                cursor: (saving || deleting) ? 'not-allowed' : 'pointer',
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#fff',
                                opacity: (saving || deleting) ? 0.6 : 1,
                            }}
                            whileHover={(saving || deleting) ? {} : { scale: 1.1 }}
                            whileTap={(saving || deleting) ? {} : { scale: 0.95 }}
                        >
                            <Camera size={22} style={{ color: '#111' }} />
                        </motion.label>
                        <input
                            type="file"
                            id="cover-upload"
                            className="d-none"
                            onChange={handleImageChange}
                            accept="image/*"
                            disabled={saving || deleting}
                        />
                    </div>

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
                        <h4 className="mb-0 fw-bold" style={{ color: '#111', fontSize: '1.5rem' }}>
                            Edit board
                        </h4>
                        <motion.button
                            className="btn btn-sm p-0 border-0 bg-transparent"
                            onClick={onClose}
                            disabled={saving || deleting}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={18} />
                        </motion.button>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 400px)' }}>
                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="alert alert-danger rounded-3 mb-4"
                                    style={{
                                        backgroundColor: '#fee',
                                        border: 'none',
                                        color: '#c33',
                                        padding: '12px 16px',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <span className="me-2">⚠️</span>
                                    {error?.response?.data?.message || error.message || 'Failed to save changes.'}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Board Name */}
                        <div className="mb-4">
                            <label className="fw-semibold mb-2 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                                Board Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter board name"
                                className="form-control rounded-3"
                                disabled={saving || deleting}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '12px 16px',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#f8f8f8',
                                }}
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="fw-semibold mb-2 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add an optional description"
                                className="form-control rounded-3"
                                disabled={saving || deleting}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '12px 16px',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#f8f8f8',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        {/* Privacy Toggle */}
                        <motion.div
                            onClick={() => !saving && !deleting && setIsPrivate(!isPrivate)}
                            className="d-flex align-items-center justify-content-between p-4 rounded-3 mb-3"
                            style={{
                                cursor: (saving || deleting) ? 'not-allowed' : 'pointer',
                                background: isPrivate
                                    ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)'
                                    : '#f8f8f8',
                                border: isPrivate ? 'none' : '1px solid #e0e0e0',
                                color: isPrivate ? '#fff' : '#111',
                                opacity: (saving || deleting) ? 0.6 : 1,
                            }}
                            whileHover={(saving || deleting) ? {} : { scale: 1.01 }}
                            whileTap={(saving || deleting) ? {} : { scale: 0.99 }}
                        >
                            <div className="d-flex align-items-center">
                                {isPrivate ? (
                                    <Lock size={22} className="me-3" />
                                ) : (
                                    <Globe size={22} className="me-3" />
                                )}
                                <div>
                                    <div className="fw-bold" style={{ fontSize: '1rem' }}>
                                        {isPrivate ? 'Private Board' : 'Public Board'}
                                    </div>
                                    <div className="small" style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                                        {isPrivate ? 'Only you can see this board' : 'Anyone can see this board'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="border-top px-4 py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                        <motion.button
                            className="btn fw-semibold px-4 rounded-3 d-flex align-items-center"
                            onClick={handleDeleteBoard}
                            disabled={saving || deleting}
                            style={{
                                background: 'transparent',
                                border: '1px solid #dc3545',
                                color: '#dc3545',
                                height: '48px',
                                minWidth: '140px',
                                opacity: (saving || deleting) ? 0.6 : 1,
                            }}
                            whileHover={(saving || deleting) ? {} : {
                                backgroundColor: '#fee',
                                scale: 1.02
                            }}
                            whileTap={(saving || deleting) ? {} : { scale: 0.98 }}
                        >
                            {deleting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} className="me-2" />
                                    Delete Board
                                </>
                            )}
                        </motion.button>

                        <div className="d-flex gap-2">
                            <motion.button
                                className="btn fw-bold px-4 rounded-3"
                                onClick={onClose}
                                disabled={saving || deleting}
                                style={{
                                    background: '#efefef',
                                    border: 'none',
                                    color: '#111',
                                    height: '48px',
                                    minWidth: '100px',
                                }}
                                whileHover={{ scale: 1.02, background: '#e2e2e2' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                className="btn fw-bold px-4 rounded-3 d-flex align-items-center justify-content-center"
                                onClick={handleSave}
                                disabled={saving || deleting}
                                style={{
                                    background: (saving || deleting)
                                        ? '#ccc'
                                        : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    height: '48px',
                                    minWidth: '140px',
                                    boxShadow: (saving || deleting)
                                        ? 'none'
                                        : '0 4px 12px rgba(230, 0, 35, 0.3)',
                                }}
                                whileHover={(saving || deleting) ? {} : {
                                    scale: 1.02,
                                    boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)'
                                }}
                                whileTap={(saving || deleting) ? {} : { scale: 0.98 }}
                            >
                                {saving ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
