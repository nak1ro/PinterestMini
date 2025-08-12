// src/components/modals/EditBoardModal.jsx
import React, { useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Camera, Trash2, Lock, Globe } from 'react-feather';
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
        if (!window.confirm('Are you sure you want to delete this board?')) return;
        try {
            await removeBoard();
            onClose();
        } catch {}
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg" backdrop="static" contentClassName="border-0 shadow-lg rounded-4 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white">
                <div className="position-relative" style={{ height: '200px', backgroundColor: '#f1f1f1' }}>
                    {coverPreview ? (
                        <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100 text-muted fw-semibold">No cover image</div>
                    )}
                    <Form.Label htmlFor="cover-upload" className="position-absolute bottom-0 end-0 m-3 p-2 bg-white rounded-circle shadow-sm" style={{ cursor: 'pointer' }}>
                        <Camera size={20} />
                    </Form.Label>
                    <Form.Control type="file" id="cover-upload" className="d-none" onChange={handleImageChange} accept="image/*" disabled={saving || deleting} />
                </div>

                <div className="p-4">
                    {error && <div className="alert alert-danger">{error?.response?.data?.message || error.message || 'Failed to save changes.'}</div>}

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Board Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter board name" className="rounded-3 shadow-sm" disabled={saving || deleting} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add an optional description" className="rounded-3 shadow-sm" disabled={saving || deleting} />
                    </Form.Group>

                    <div
                        onClick={() => !saving && !deleting && setIsPrivate(!isPrivate)}
                        className="d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm mb-3"
                        style={{ cursor: saving || deleting ? 'not-allowed' : 'pointer', background: isPrivate ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)' : '#f8f9fa', color: isPrivate ? '#fff' : '#333' }}
                    >
                        <div className="d-flex align-items-center">
                            {isPrivate ? <Lock size={20} className="me-2" /> : <Globe size={20} className="me-2" />}
                            <span className="fw-semibold">{isPrivate ? 'Private Board' : 'Public Board'}</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant="outline-danger" className="d-flex align-items-center" onClick={handleDeleteBoard} disabled={saving || deleting}>
                            {deleting ? (<><Spinner animation="border" size="sm" className="me-2" /> Deleting…</>) : (<><Trash2 size={18} className="me-2" /> Delete Board</>)}
                        </Button>

                        <div>
                            <Button variant="secondary" className="me-2 rounded-3" onClick={onClose} disabled={saving || deleting}>Cancel</Button>
                            <Button variant="danger" className="rounded-3 px-4 fw-semibold" style={{ background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)', border: 'none' }} onClick={handleSave} disabled={saving || deleting}>
                                {saving ? (<><Spinner animation="border" size="sm" className="me-2" /> Saving…</>) : ('Save Changes')}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Modal>
    );
}
