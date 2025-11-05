import React, {useState, useEffect, useCallback} from 'react';
import {Container, Form, Row, Col, FloatingLabel, Image, Button, Alert, ProgressBar, Spinner} from 'react-bootstrap';
import {createPin} from '../../services/pinService';
import {getMyBoards} from '../../services/boardService';
import {useDropzone} from 'react-dropzone';
import {motion, AnimatePresence} from 'framer-motion';
import PinTagsControl from '../common/PinTagsControl';

const TagInput = ({tags, setTags}) => {
    const handleTagInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value && !tags.includes(value)) {
                setTags([...tags, value]);
            }
            e.target.value = '';
        }
    };

    return (
        <>
            <PinTagsControl
                value={tags}
                onChange={setTags}
                mode="string"
                label="Tags"
                placeholder="Type and press Enter"
                maxTags={15}
                allowDuplicates={false}
            />
        </>
    );
};

const BoardSelector = ({boards, selectedBoards, setSelectedBoards}) => {
    const toggleBoardSelection = (boardId) => {
        setSelectedBoards((prevBoards) =>
            prevBoards.includes(boardId)
                ? prevBoards.filter((id) => id !== boardId)
                : [...prevBoards, boardId]
        );
    };

    return (
        <div className="mb-4">
            <label className="fw-semibold mb-3 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                Choose boards (optional)
            </label>
            {boards.length > 0 ? (
                <div
                    className="d-flex flex-column gap-2"
                    style={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        willChange: 'scroll-position',
                        transform: 'translateZ(0)'
                    }}
                >
                    {boards.map((board) => {
                        const isSelected = selectedBoards.includes(board.id);
                        return (
                            <motion.div
                                key={board.id}
                                className="d-flex align-items-center p-3 rounded-3"
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'rgba(230, 0, 35, 0.08)' : '#f8f8f8',
                                    border: isSelected
                                        ? '2px solid #e60023'
                                        : '1px solid #e0e0e0',
                                    transition: 'all 0.2s ease',
                                    willChange: 'transform, background-color, border-color',
                                }}
                                onClick={() => toggleBoardSelection(board.id)}
                                whileHover={{
                                    backgroundColor: isSelected ? 'rgba(230, 0, 35, 0.12)' : '#efefef',
                                }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                            >
                                <div
                                    className="rounded-3 me-3 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0 overflow-hidden"
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
                                        backgroundPosition: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {!board.coverImageUrl && (
                                        <span style={{ fontSize: '1.25rem' }}>
                                            {board.name?.charAt(0).toUpperCase() || 'B'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-semibold text-truncate" style={{ color: '#111', fontSize: '0.95rem' }}>
                                        {board.name}
                                    </div>
                                    {board.description && (
                                        <div className="text-muted small text-truncate" style={{ fontSize: '0.85rem' }}>
                                            {board.description}
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
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-4 rounded-3" style={{ backgroundColor: '#f8f8f8', border: '1px solid #e0e0e0' }}>
                    <p className="text-muted mb-0 small">You have no boards yet</p>
                </div>
            )}
        </div>
    );
};

const PinImageInput = ({selectedFile, setSelectedFile, previewUrl, setPreviewUrl}) => {
    const handleFile = useCallback((file) => {
        if (
            !file ||
            (selectedFile &&
                file.name === selectedFile.name &&
                file.size === selectedFile.size &&
                file.lastModified === selectedFile.lastModified)
        ) {
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    }, [selectedFile, setSelectedFile, setPreviewUrl]);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        handleFile(file);
    }, [handleFile]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: false
    });

    useEffect(() => {
        const handleGlobalPaste = (e) => {
            const active = document.activeElement;
            const isInputFocused = active &&
                (
                    active.tagName === 'INPUT' ||
                    active.tagName === 'TEXTAREA' ||
                    active.isContentEditable
                );

            if (isInputFocused) return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        handleFile(file);
                        e.preventDefault();
                        break;
                    }
                }
            }
        };

        window.addEventListener('paste', handleGlobalPaste);
        return () => window.removeEventListener('paste', handleGlobalPaste);
    }, [handleFile]);

    return (
        <div className="mb-4">
            <label className="fw-semibold mb-3 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                Image *
            </label>

            {!previewUrl ? (
                <motion.div
                    {...getRootProps()}
                    className="rounded-3 text-center p-5"
                    style={{
                        cursor: 'pointer',
                        border: `2px dashed ${isDragActive ? '#e60023' : '#ddd'}`,
                        backgroundColor: isDragActive ? 'rgba(230, 0, 35, 0.05)' : '#f8f8f8',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    whileHover={{ borderColor: '#e60023', backgroundColor: 'rgba(230, 0, 35, 0.03)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    <input {...getInputProps()} />
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: isDragActive ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isDragActive ? '#e60023' : '#999'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginBottom: '16px' }}
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </motion.div>
                    {isDragActive ? (
                        <p className="mb-0 fw-semibold" style={{ color: '#e60023', fontSize: '1rem' }}>
                            Drop the image here...
                        </p>
                    ) : (
                        <div>
                            <p className="mb-2 fw-medium" style={{ color: '#111', fontSize: '1rem' }}>
                                Drag & drop image here, or click to browse
                            </p>
                            <p className="mb-0 text-muted small">
                                You can also paste with <strong>Ctrl+V</strong>
                            </p>
                        </div>
                    )}
                </motion.div>
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
                        alt="preview"
                        className="w-100"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '500px',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                    <motion.button
                        type="button"
                        className="position-absolute top-0 end-0 m-3 btn btn-sm p-0 border-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
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
    );
};

const CreatePinPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [boards, setBoards] = useState([]);
    const [selectedBoards, setSelectedBoards] = useState([]);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await getMyBoards();
                setBoards(res.data);
            } catch (err) {
                console.error(err);
                setError('Ошибка при загрузке досок');
            }
        };

        fetchBoards();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError('');
        setUploadPct(0);

        try {
            const formData = new FormData();
            formData.append("title", title);
            if (description) formData.append("description", description);
            formData.append("allowComments", allowComments);
            if (selectedFile) formData.append("image", selectedFile);
            if (selectedBoards.length > 0) {
                selectedBoards.forEach(id => formData.append("boardIds", id));
            }
            if (tags.length > 0) {
                tags.forEach(tag => formData.append("tagNames", tag));
            }

            const res = await createPin(formData, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadPct(percent);
            });

            setSuccessMessage('Pin was successfully created!');

            // Reset form
            setTitle('');
            setDescription('');
            setAllowComments(true);
            setSelectedFile(null);
            setPreviewUrl('');
            setSelectedBoards([]);
            setTags([]);
            setUploadPct(0);
        } catch (err) {
            console.error(err);
            setError('Error occurred');
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
                        Create new pin
                    </h1>
                    <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                        Share your ideas and inspiration with the world
                    </p>
                </motion.div>

                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            key="success-alert"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4"
                        >
                            <Alert
                                variant="success"
                                onClose={() => setSuccessMessage('')}
                                dismissible
                                className="rounded-3 border-0"
                                style={{
                                    backgroundColor: '#d4edda',
                                    border: 'none',
                                    color: '#155724',
                                    padding: '16px 20px',
                                }}
                            >
                                {successMessage}
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                                <PinImageInput
                                    selectedFile={selectedFile}
                                    setSelectedFile={setSelectedFile}
                                    previewUrl={previewUrl}
                                    setPreviewUrl={setPreviewUrl}
                                />
                            </Col>

                            <Col md={7}>
                                <div className="mb-4">
                                    <label className="fw-semibold mb-2 d-block" style={{ color: '#111', fontSize: '0.95rem' }}>
                                        Title *
                                    </label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Give your pin a title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
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
                                        placeholder="Tell everyone what your pin is about"
                                        style={{
                                            height: '120px',
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

                                <BoardSelector
                                    boards={boards}
                                    selectedBoards={selectedBoards}
                                    setSelectedBoards={setSelectedBoards}
                                />

                                <div className="mb-4">
                                    <TagInput
                                        tags={tags}
                                        setTags={setTags}
                                    />
                                </div>

                                <motion.div
                                    className="d-flex align-items-center p-3 rounded-3 mb-4"
                                    style={{
                                        backgroundColor: '#f8f8f8',
                                        border: '1px solid #e0e0e0',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setAllowComments(!allowComments)}
                                    whileHover={{ backgroundColor: '#efefef' }}
                                >
                                    <Form.Check
                                        type="switch"
                                        id="comments-switch"
                                        checked={allowComments}
                                        onChange={() => setAllowComments(!allowComments)}
                                        style={{ marginRight: '12px' }}
                                    />
                                    <label htmlFor="comments-switch" className="mb-0 fw-medium" style={{ color: '#111', cursor: 'pointer' }}>
                                        Allow comments
                                    </label>
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
                                    <span className="text-muted small me-2">Uploading...</span>
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
                                    background: sending || !title || !selectedFile
                                        ? '#ccc'
                                        : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    height: '48px',
                                    minWidth: '140px',
                                    boxShadow: sending || !title || !selectedFile
                                        ? 'none'
                                        : '0 4px 12px rgba(230, 0, 35, 0.3)',
                                }}
                                whileHover={sending || !title || !selectedFile ? {} : {
                                    scale: 1.02,
                                    boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)'
                                }}
                                whileTap={sending || !title || !selectedFile ? {} : { scale: 0.98 }}
                            >
                                {sending ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-2" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create pin'
                                )}
                            </motion.button>
                        </div>
                    </Form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CreatePinPage;
