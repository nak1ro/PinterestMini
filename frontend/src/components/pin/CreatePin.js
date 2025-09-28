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
        <Form.Group className="mb-3">
            <Form.Label>Choose boards (optional)</Form.Label>
            {boards.length > 0 ? (
                boards.map((board) => (
                    <Form.Check
                        key={board.id}
                        type="checkbox"
                        label={board.name}
                        checked={selectedBoards.includes(board.id)}
                        onChange={() => toggleBoardSelection(board.id)}
                    />
                ))
            ) : (
                <div className="text-muted">You have no boards</div>
            )}
        </Form.Group>
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
        <Form.Group controlId="pin-image" className="mb-3">
            <Form.Label>Image *</Form.Label>

            <div
                {...getRootProps()}
                className={`border p-4 rounded text-center mb-3 ${isDragActive ? 'bg-light' : ''}`}
                style={{
                    cursor: 'pointer',
                    borderStyle: 'dashed',
                    borderColor: isDragActive ? '#0d6efd' : '#ced4da',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-primary">Drop the image here...</p>
                ) : (
                    <p className="text-muted mb-0">
                        Drag & drop image here, click to browse, or <strong>paste with Ctrl+V</strong>
                    </p>
                )}
            </div>

            {previewUrl && (
                <Image
                    src={previewUrl}
                    alt="preview"
                    thumbnail
                    className="w-100"
                    style={{maxWidth: '100%', height: '400px', objectFit: 'contain'}}
                />
            )}
        </Form.Group>
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
            console.log('Pin created:', res.data);

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
        <Container className="py-4">
            <h2 className="mb-4">Create new pin</h2>

            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        key="success-alert"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.4}}
                    >
                        <Alert
                            variant="success"
                            onClose={() => setSuccessMessage('')}
                            dismissible
                        >
                            {successMessage}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>


            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={5}>
                        <PinImageInput
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            previewUrl={previewUrl}
                            setPreviewUrl={setPreviewUrl}
                        />
                    </Col>

                    <Col md={7}>
                        <FloatingLabel controlId="pin-title" label="Title *" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="pin-description" label="Description (optional)" className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder=" "
                                style={{height: '120px'}}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>

                        <BoardSelector
                            boards={boards}
                            selectedBoards={selectedBoards}
                            setSelectedBoards={setSelectedBoards}
                        />

                        <TagInput
                            tags={tags}
                            setTags={setTags}
                        />

                        <Form.Check
                            type="switch"
                            id="comments-switch"
                            label="Allow comments"
                            checked={allowComments}
                            onChange={() => setAllowComments(!allowComments)}
                            className="mb-3"
                        />
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}
                {sending && <ProgressBar now={uploadPct} animated className="mt-2"/>}

                <div className="mt-4 d-flex justify-content-end">
                    <Button variant="primary" type="submit" disabled={sending}>
                        {sending && <Spinner size="sm" animation="border" className="me-2"/>}
                        Create pin
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreatePinPage;
