import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { savePinToBoard } from '../../services/boardService';
import { getMyBoards } from '../../services/boardService';

const SaveToBoardModal = ({ show, onClose, pinId, onSaved }) => {
    const [boards, setBoards] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            setLoading(true);
            setError(null);
            setSelectedBoardId(null);
            getMyBoards()
                .then((res) => {
                    const boardsList = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
                    setBoards(boardsList);
                })
                .catch((err) => {
                    console.error('Failed to load boards:', err);
                    setError('Failed to load boards');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [show]);

    const handleSave = async () => {
        if (!selectedBoardId) {
            setError('Please select a board');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await savePinToBoard(selectedBoardId, pinId);
            if (onSaved) {
                onSaved(selectedBoardId);
            }
            onClose();
        } catch (err) {
            console.error('Failed to save pin to board:', err);
            setError(err.response?.data?.error || 'Failed to save pin to board');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onClose} 
            centered 
            backdrop="static"
            contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white"
            >
                <Modal.Header className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Save to board</Modal.Title>
                </Modal.Header>

                <Modal.Body className="pt-3">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center py-4">
                            <Spinner animation="border" />
                        </div>
                    ) : error && !loading ? (
                        <Alert variant="danger" className="mb-0">
                            {error}
                        </Alert>
                    ) : boards.length === 0 ? (
                        <div className="text-muted text-center py-4">
                            You have no boards. Create a board first to save pins.
                        </div>
                    ) : (
                        <>
                            <div className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {boards.map((board) => (
                                    <div
                                        key={board.id}
                                        className={`p-3 mb-2 rounded-3 border ${
                                            selectedBoardId === board.id
                                                ? 'border-danger border-2'
                                                : 'border-secondary'
                                        }`}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: selectedBoardId === board.id ? '#fff5f5' : 'white'
                                        }}
                                        onClick={() => setSelectedBoardId(board.id)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded me-3 d-flex align-items-center justify-content-center fw-bold text-white"
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
                                                        {board.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold">{board.name}</div>
                                                {board.description && (
                                                    <div className="text-muted small">
                                                        {board.description}
                                                    </div>
                                                )}
                                            </div>
                                            {selectedBoardId === board.id && (
                                                <div className="text-danger fw-bold">✓</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {error && (
                                <Alert variant="danger" className="mb-0 mt-3">
                                    {error}
                                </Alert>
                            )}
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSave}
                        disabled={saving || !selectedBoardId || boards.length === 0}
                        style={{
                            background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                            border: 'none'
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
