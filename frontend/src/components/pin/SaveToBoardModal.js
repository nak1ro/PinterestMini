import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Spinner, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { motion } from 'framer-motion';
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

    return (
        <Modal 
            show={show} 
            onHide={onClose} 
            centered 
            backdrop="static"
            contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
            size="md"
        >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white d-flex flex-column"
                style={{ maxHeight: '80vh' }}
            >
                <Modal.Header className="border-0 pb-2">
                    <Modal.Title className="fw-bold">Add pin to boards</Modal.Title>
                </Modal.Header>

                <Modal.Body className="pt-0 flex-grow-1 overflow-hidden d-flex flex-column">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <Spinner animation="border" />
                        </div>
                    ) : error && !loading && boards.length === 0 ? (
                        <Alert variant="danger" className="mb-0">
                            {error}
                        </Alert>
                    ) : boards.length === 0 ? (
                        <div className="text-center py-5">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-muted mb-3"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
                            </svg>
                            <h5 className="fw-normal mb-2">No boards yet</h5>
                            <p className="text-muted small mb-3">Create a board to organize your pins</p>
                            <Button
                                variant="danger"
                                className="rounded-3 px-4"
                                onClick={handleCreateBoard}
                                style={{
                                    background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    border: 'none'
                                }}
                            >
                                Create board
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Search input */}
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Search boards..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '12px'
                                    }}
                                />
                            </InputGroup>

                            {/* Error message */}
                            {error && (
                                <Alert variant="danger" className="mb-3 py-2" dismissible onClose={() => setError(null)}>
                                    {error}
                                </Alert>
                            )}

                            {/* Boards list */}
                            <div 
                                className="flex-grow-1 overflow-auto"
                                style={{ maxHeight: '400px' }}
                            >
                                {filteredBoards.length === 0 ? (
                                    <div className="text-center text-muted py-4">
                                        No boards match "{searchQuery}"
                                    </div>
                                ) : (
                                    filteredBoards.map((board) => {
                                        const isSelected = selectedBoardIds.has(board.id);

                                        return (
                                            <div
                                                key={board.id}
                                                className={`p-3 mb-2 rounded-3 border ${
                                                    isSelected
                                                        ? 'border-danger border-2'
                                                        : 'border-secondary'
                                                }`}
                                                style={{
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    backgroundColor: isSelected ? '#fff5f5' : 'white'
                                                }}
                                                onClick={() => toggleBoardSelection(board.id)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded me-3 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                                                        style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            backgroundColor: board.coverImageUrl
                                                                ? 'transparent'
                                                                : '#e60023',
                                                            backgroundImage: board.coverImageUrl
                                                                ? `url(${board.coverImageUrl})`
                                                                : 'none',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}
                                                    >
                                                        {!board.coverImageUrl && (
                                                            <span style={{ fontSize: '1.2rem' }}>
                                                                {board.name?.charAt(0).toUpperCase() || 'B'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1 min-w-0">
                                                        <div className="fw-bold text-truncate">{board.name}</div>
                                                        {board.description && (
                                                            <div className="text-muted small text-truncate">
                                                                {board.description}
                                                            </div>
                                                        )}
                                                        {board.pinCount !== undefined && (
                                                            <div className="text-muted small">
                                                                {board.pinCount} pin{board.pinCount !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleBoardSelection(board.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="ms-3 flex-shrink-0"
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer className="border-0 pt-2" style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 10 }}>
                    <Button 
                        variant="secondary" 
                        onClick={onClose} 
                        disabled={saving}
                        className="rounded-3"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSave}
                        disabled={saving || boards.length === 0}
                        className="rounded-3"
                        style={{
                            background: saving || boards.length === 0 
                                ? '#ccc' 
                                : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                            border: 'none',
                            minWidth: '100px'
                        }}
                    >
                        {saving ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </Modal.Footer>
            </motion.div>
        </Modal>
    );
};

export default SaveToBoardModal;
