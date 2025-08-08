import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Camera, Trash2, Lock, Globe } from 'react-feather';

export default function EditBoardModal({ show, onClose }) {
    const [coverImage, setCoverImage] = useState(null);
    const [boardName, setBoardName] = useState('My Board');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteBoard = () => {
        if (window.confirm('Are you sure you want to delete this board?')) {
            alert('Board deleted (frontend only)');
            onClose();
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            size="lg"
            backdrop="static"
            contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
        >
            {/* Animated Modal Content */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white"
            >
                {/* Cover Image Section */}
                <div className="position-relative" style={{ height: '200px', backgroundColor: '#f1f1f1' }}>
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt="Cover"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100 text-muted fw-semibold">
                            No cover image
                        </div>
                    )}

                    <Form.Label
                        htmlFor="cover-upload"
                        className="position-absolute bottom-0 end-0 m-3 p-2 bg-white rounded-circle shadow-sm cursor-pointer"
                        style={{ cursor: 'pointer' }}
                    >
                        <Camera size={20} />
                    </Form.Label>
                    <Form.Control
                        type="file"
                        id="cover-upload"
                        className="d-none"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>

                {/* Form Fields */}
                <div className="p-4">
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Board Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                            placeholder="Enter board name"
                            className="rounded-3 shadow-sm"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add an optional description"
                            className="rounded-3 shadow-sm"
                        />
                    </Form.Group>

                    {/* Privacy Toggle */}
                    <div
                        onClick={() => setIsPrivate(!isPrivate)}
                        className="d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm mb-3"
                        style={{
                            cursor: 'pointer',
                            background: isPrivate
                                ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)'
                                : '#f8f9fa',
                            color: isPrivate ? '#fff' : '#333',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            {isPrivate ? <Lock size={20} className="me-2" /> : <Globe size={20} className="me-2" />}
                            <span className="fw-semibold">{isPrivate ? 'Private Board' : 'Public Board'}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button
                            variant="outline-danger"
                            className="d-flex align-items-center"
                            onClick={handleDeleteBoard}
                        >
                            <Trash2 size={18} className="me-2" />
                            Delete Board
                        </Button>

                        <div>
                            <Button
                                variant="secondary"
                                className="me-2 rounded-3"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                className="rounded-3 px-4 fw-semibold"
                                style={{
                                    background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    border: 'none'
                                }}
                                onClick={() => {
                                    alert('Board updated (frontend only)');
                                    onClose();
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Modal>
    );
}
