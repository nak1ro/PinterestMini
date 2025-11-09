import React, { useState, useEffect, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMyBoards } from '../../services/boardService';
import { getPinBoards, setPinBoards } from '../../services/pinService';

const SaveToBoardModal = ({ show, onClose, pinId, onSaved }) => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);
    const [currentBoardIds, setCurrentBoardIds] = useState([]); // Boards that currently have this pin
    const [selectedBoardIds, setSelectedBoardIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Load boards and current board memberships when modal opens
    useEffect(() => {
        if (show && pinId) {
            setLoading(true);
            setError(null);
            setSearchQuery('');
            setSelectedBoardIds(new Set());

            Promise.all([
                getMyBoards(),
                getPinBoards(pinId).catch(() => ({ boards: [] })) // Fallback if endpoint doesn't exist yet
            ])
                .then(([boardsRes, pinBoardsRes]) => {
                    const boardsList = Array.isArray(boardsRes.data) ? boardsRes.data : (Array.isArray(boardsRes) ? boardsRes : []);
                    setBoards(boardsList);

                    // Extract board IDs from the pin's boards response
                    const boards = pinBoardsRes?.boards || pinBoardsRes?.data?.boards || pinBoardsRes || [];
                    const boardIds = Array.isArray(boards) 
                        ? boards.map(b => typeof b === 'string' || typeof b === 'number' ? b : b.id).filter(Boolean)
                        : [];
                    setCurrentBoardIds(boardIds);
                    setSelectedBoardIds(new Set(boardIds)); // Initialize with current boards selected
                })
                .catch((err) => {
                    console.error('Failed to load boards:', err);
                    setError('Failed to load boards. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [show, pinId]);

    // Filter boards based on search query
    const filteredBoards = useMemo(() => {
        if (!searchQuery.trim()) return boards;
        const query = searchQuery.toLowerCase();
        return boards.filter(board => 
            board.name?.toLowerCase().includes(query) ||
            board.description?.toLowerCase().includes(query)
        );
    }, [boards, searchQuery]);

    const toggleBoardSelection = (boardId) => {
        setSelectedBoardIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(boardId)) {
                newSet.delete(boardId);
            } else {
                newSet.add(boardId);
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const boardIdsArray = Array.from(selectedBoardIds);
            await setPinBoards(pinId, boardIdsArray);
            
            if (onSaved) {
                onSaved(boardIdsArray);
            }
            
            // Show success toast (you might want to use a toast library here)
            // For now, we'll just close the modal
            onClose();
        } catch (err) {
            console.error('Failed to save pin to boards:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Couldn\'t save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateBoard = () => {
        onClose();
        navigate('/create-board');
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
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div 
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ zIndex: 2001, pointerEvents: 'none' }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <motion.div
                    className="bg-white d-flex flex-column"
                    style={{
                        width: 'min(520px, 90vw)',
                        maxHeight: '85vh',
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        pointerEvents: 'auto',
                    }}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
                        <h4 className="mb-0 fw-bold" style={{ color: '#111', fontSize: '1.5rem' }}>
                            Save to board
                        </h4>
                        <motion.button
                            className="btn btn-sm p-0 border-0 bg-transparent"
                            onClick={onClose}
                            disabled={saving}
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
                            ✕
                        </motion.button>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-3 flex-grow-1 overflow-hidden d-flex flex-column">
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <Spinner animation="border" />
                                <span className="ms-3 text-muted">Loading boards...</span>
                            </div>
                        ) : error && !loading && boards.length === 0 ? (
                            <div className="alert alert-danger rounded-3 mb-0" role="alert" style={{
                                backgroundColor: '#fee',
                                border: 'none',
                                color: '#c33',
                                padding: '12px 16px'
                            }}>
                                <span className="me-2">⚠️</span>
                                {error}
                            </div>
                        ) : boards.length === 0 ? (
                            <div className="text-center py-5">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <svg
                                        width="80"
                                        height="80"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-muted mb-4"
                                        style={{ opacity: 0.5 }}
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="3" y1="9" x2="21" y2="9"></line>
                                        <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
                                    </svg>
                                    <h5 className="fw-bold mb-2" style={{ color: '#111' }}>No boards yet</h5>
                                    <p className="text-muted mb-4">Create a board to organize your pins</p>
                                    <motion.button
                                        className="btn fw-bold px-4 rounded-3"
                                        onClick={handleCreateBoard}
                                        style={{
                                            background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                            border: 'none',
                                            color: '#fff',
                                            height: '48px',
                                            minWidth: '150px',
                                            boxShadow: '0 4px 12px rgba(230, 0, 35, 0.3)'
                                        }}
                                        whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Create board
                                    </motion.button>
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {/* Search input */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Search boards..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '12px 16px',
                                            fontSize: '0.95rem',
                                            backgroundColor: '#f8f8f8',
                                        }}
                                    />
                                </div>

                                {/* Error message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="alert alert-danger rounded-3 mb-3"
                                            style={{
                                                backgroundColor: '#fee',
                                                border: 'none',
                                                color: '#c33',
                                                padding: '12px 16px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <span className="me-2">⚠️</span>
                                            {error}
                                            <button
                                                type="button"
                                                className="btn-close ms-auto"
                                                onClick={() => setError(null)}
                                                style={{ fontSize: '0.75rem' }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Boards list */}
                                <div 
                                    className="flex-grow-1"
                                    style={{ 
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        WebkitOverflowScrolling: 'touch',
                                        willChange: 'scroll-position',
                                        transform: 'translateZ(0)'
                                    }}
                                >
                                    {filteredBoards.length === 0 ? (
                                        <div className="text-center text-muted py-5">
                                            <p className="mb-0">No boards match "{searchQuery}"</p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2">
                                            {filteredBoards.map((board) => {
                                                const isSelected = selectedBoardIds.has(board.id);

                                                return (
                                                    <motion.div
                                                        key={board.id}
                                                        className="rounded-3 p-3"
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: isSelected ? 'rgba(230, 0, 35, 0.08)' : '#fff',
                                                            border: isSelected 
                                                                ? '2px solid #e60023' 
                                                                : '1px solid #e0e0e0',
                                                            transition: 'all 0.2s ease',
                                                            willChange: 'transform, background-color, border-color',
                                                        }}
                                                        onClick={() => toggleBoardSelection(board.id)}
                                                        whileHover={{ 
                                                            scale: 1.01,
                                                            backgroundColor: isSelected ? 'rgba(230, 0, 35, 0.12)' : '#f8f8f8',
                                                            borderColor: isSelected ? '#e60023' : '#ccc'
                                                        }}
                                                        whileTap={{ scale: 0.99 }}
                                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="rounded-3 me-3 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0 overflow-hidden"
                                                                style={{
                                                                    width: '56px',
                                                                    height: '56px',
                                                                    backgroundColor: board.coverImageUrl
                                                                        ? 'transparent'
                                                                        : '#e60023',
                                                                    backgroundImage: board.coverImageUrl
                                                                        ? `url(${board.coverImageUrl})`
                                                                        : 'none',
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                }}
                                                            >
                                                                {!board.coverImageUrl && (
                                                                    <span style={{ fontSize: '1.5rem' }}>
                                                                        {board.name?.charAt(0).toUpperCase() || 'B'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow-1 min-w-0">
                                                                <div className="fw-bold text-truncate mb-1" style={{ color: '#111', fontSize: '1rem' }}>
                                                                    {board.name}
                                                                </div>
                                                                {board.description && (
                                                                    <div className="text-muted small text-truncate mb-1" style={{ fontSize: '0.875rem' }}>
                                                                        {board.description}
                                                                    </div>
                                                                )}
                                                                {board.pinCount !== undefined && (
                                                                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                                        {board.pinCount} pin{board.pinCount !== 1 ? 's' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-shrink-0 ms-3">
                                                                <div
                                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        border: isSelected ? '2px solid #e60023' : '2px solid #ddd',
                                                                        backgroundColor: isSelected ? '#e60023' : 'transparent',
                                                                        transition: 'all 0.2s ease',
                                                                    }}
                                                                >
                                                                    {isSelected && (
                                                                        <motion.span
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                                                                        >
                                                                            ✓
                                                                        </motion.span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-top px-4 py-3 d-flex justify-content-end gap-2" style={{ backgroundColor: '#fff' }}>
                        <motion.button
                            className="btn fw-bold px-4 rounded-3"
                            onClick={onClose}
                            disabled={saving}
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
                            disabled={saving || boards.length === 0}
                            style={{
                                background: saving || boards.length === 0
                                    ? '#ccc'
                                    : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                border: 'none',
                                color: '#fff',
                                height: '48px',
                                minWidth: '120px',
                                boxShadow: saving || boards.length === 0
                                    ? 'none'
                                    : '0 4px 12px rgba(230, 0, 35, 0.3)',
                            }}
                            whileHover={saving || boards.length === 0 ? {} : {
                                scale: 1.02,
                                boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)'
                            }}
                            whileTap={saving || boards.length === 0 ? {} : { scale: 0.98 }}
                        >
                            {saving ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default SaveToBoardModal;
