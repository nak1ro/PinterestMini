import React, { useState } from 'react';
import {
    Form, Row, Col, Alert, Spinner, ProgressBar
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Lock, Globe, Camera } from 'react-bootstrap-icons';
import { createBoard } from '../../services/boardService';

const CreateBoardPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError('');
        setUploadPct(0);

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (description) formData.append('description', description);
            formData.append('isPrivate', isPrivate);
            if (coverImage) formData.append('coverImage', coverImage);

            await createBoard(formData, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadPct(percent);
            });

            setName('');
            setDescription('');
            setIsPrivate(false);
            setCoverImage(null);
            setPreviewUrl('');
            setUploadPct(0);
        } catch (err) {
            console.error(err);
            setError('Failed to create board');
        } finally {
            setSending(false);
        }
    };

    return (
        <motion.div
            className="container-fluid py-5"
            style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container" style={{ maxWidth: '1200px' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="fw-bold mb-2" style={{ color: '#111', fontSize: '2rem' }}>
                        Create new board
                    </h1>
                    <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                        Organize your pins into collections
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-3 p-4 p-md-5 shadow-sm"
                    style={{ border: '1px solid #e0e0e0' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={5}>
                                <div className="mb-4">
                                    <label className="fw-semibold mb-3 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                                        Cover image (optional)
                                    </label>
                                    {!previewUrl ? (
                                        <motion.label
                                            htmlFor="board-cover-upload"
                                            className="d-block rounded-3 text-center p-5"
                                            style={{
                                                cursor: 'pointer',
                                                border: '2px dashed #ddd',
                                                backgroundColor: '#f8f8f8',
                                                transition: 'all 0.2s ease',
                                                minHeight: '300px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            whileHover={{ borderColor: '#e60023', backgroundColor: 'rgba(230, 0, 35, 0.03)' }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <input
                                                type="file"
                                                id="board-cover-upload"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="d-none"
                                            />
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Camera size={64} style={{ color: '#999', marginBottom: '16px' }} />
                                            </motion.div>
                                            <p className="mb-2 fw-medium" style={{ color: '#111', fontSize: '1rem' }}>
                                                Click to upload cover image
                                            </p>
                                            <p className="mb-0 text-muted small">
                                                Add a beautiful cover to your board
                                            </p>
                                        </motion.label>
                                    ) : (
                                        <motion.div
                                            className="position-relative rounded-3 overflow-hidden"
                                            style={{
                                                border: '1px solid #e0e0e0',
                                                backgroundColor: '#f8f8f8',
                                            }}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-100"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    maxHeight: '400px',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                }}
                                            />
                                            <motion.button
                                                type="button"
                                                className="position-absolute top-0 end-0 m-3 btn btn-sm p-0 border-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                                                onClick={() => {
                                                    setCoverImage(null);
                                                    setPreviewUrl('');
                                                }}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                }}
                                                whileHover={{ scale: 1.1, backgroundColor: '#f8f8f8' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#111' }}>
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>
                            </Col>

                            <Col md={7}>
                                <div className="mb-4">
                                    <label className="fw-semibold mb-2 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                                        Board name *
                                    </label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Give your board a name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="rounded-3"
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '14px 16px',
                                            fontSize: '0.95rem',
                                            backgroundColor: '#f8f8f8',
                                        }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="fw-semibold mb-2 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                                        Description (optional)
                                    </label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Describe what this board is about"
                                        style={{
                                            height: '100px',
                                            border: '1px solid #ddd',
                                            padding: '14px 16px',
                                            fontSize: '0.95rem',
                                            backgroundColor: '#f8f8f8',
                                            resize: 'vertical',
                                        }}
                                        className="rounded-3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <motion.div
                                    className="d-flex align-items-center justify-content-between p-4 rounded-3 mb-4"
                                    style={{
                                        cursor: 'pointer',
                                        background: isPrivate
                                            ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)'
                                            : '#f8f8f8',
                                        border: isPrivate ? 'none' : '1px solid #e0e0e0',
                                        color: isPrivate ? '#fff' : '#111',
                                    }}
                                    onClick={() => setIsPrivate(!isPrivate)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
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
                            </Col>
                        </Row>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-4"
                            >
                                <Alert variant="danger" className="rounded-3 border-0" style={{
                                    backgroundColor: '#fee',
                                    border: 'none',
                                    color: '#c33',
                                    padding: '12px 16px',
                                }}>
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                        
                        {sending && (
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-2">
                                    <span className="text-muted small me-2">Creating...</span>
                                    <span className="text-muted small">{uploadPct}%</span>
                                </div>
                                <ProgressBar
                                    now={uploadPct}
                                    animated
                                    className="rounded-3"
                                    style={{ height: '8px', backgroundColor: '#e0e0e0' }}
                                />
                            </div>
                        )}

                        <div className="mt-4 d-flex justify-content-end gap-3">
                            <motion.button
                                type="button"
                                className="btn fw-bold px-4 rounded-3"
                                onClick={() => window.history.back()}
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
                                type="submit"
                                className="btn fw-bold px-4 rounded-3 d-flex align-items-center justify-content-center"
                                disabled={sending}
                                style={{
                                    background: sending || !name
                                        ? '#ccc'
                                        : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    height: '48px',
                                    minWidth: '140px',
                                    boxShadow: sending || !name
                                        ? 'none'
                                        : '0 4px 12px rgba(230, 0, 35, 0.3)',
                                }}
                                whileHover={sending || !name ? {} : {
                                    scale: 1.02,
                                    boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)'
                                }}
                                whileTap={sending || !name ? {} : { scale: 0.98 }}
                            >
                                {sending ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-2" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create board'
                                )}
                            </motion.button>
                        </div>
                    </Form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CreateBoardPage;
