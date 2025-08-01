import React, { useState, useEffect } from 'react';
import {
    Container, Form, Row, Col, FloatingLabel, Image,
    Button, Alert, ProgressBar, Spinner, Card
} from "react-bootstrap";
import { createPin } from '../../services/pinService';
import { getMyBoards } from '../../services/boardService';

const CreatePinPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [boards, setBoards] = useState([]);
    const [selectedBoards, setSelectedBoards] = useState([]);
    const [tags, setTags] = useState([]); // now array of strings
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await getMyBoards();
            setBoards(res.data);
        } catch (err) {
            console.error(err);
            setError('Ошибка при загрузке досок');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const toggleItem = (id, list, setter) => {
        if (list.includes(id)) {
            setter(list.filter(i => i !== id));
        } else {
            setter([...list, id]);
        }
    };

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

            console.log('Pin created:', res.data);

            // сброс формы
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
            setError('Error occured');
        } finally {
            setSending(false);
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Create new pin</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={5}>
                        <Form.Group controlId="pin-image" className="mb-3">
                            <Form.Label>Image *</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>
                        {previewUrl && (
                            <Image src={previewUrl} alt="preview" thumbnail className="w-100 mb-3" />
                        )}
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
                                style={{ height: '120px' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>

                        <Form.Group className="mb-3">
                            <Form.Label>Choose boards (optional)</Form.Label>
                            {boards.length > 0 ? (
                                boards.map(board => (
                                    <Form.Check
                                        key={board.id}
                                        type="checkbox"
                                        label={board.name}
                                        checked={selectedBoards.includes(board.id)}
                                        onChange={() => toggleItem(board.id, selectedBoards, setSelectedBoards)}
                                    />
                                ))
                            ) : (
                                <div className="text-muted">You have no boards</div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tags</Form.Label>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="badge bg-secondary d-flex align-items-center"
                                        style={{ padding: '0.5em 0.75em' }}
                                    >
                            {tag}
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                                            className="ms-2 p-0 text-white"
                                            aria-label="Remove tag"
                                            style={{ fontSize: '1rem', lineHeight: 1 }}
                                        >
                    ×
                                        </Button>
                                    </span>
                                ))}
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Type and press Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const value = e.target.value.trim();
                                        if (value && !tags.includes(value)) {
                                            setTags([...tags, value]);
                                        }
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </Form.Group>



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
                {sending && <ProgressBar now={uploadPct} animated className="mt-2" />}

                <div className="mt-4 d-flex justify-content-end">
                    <Button variant="primary" type="submit" disabled={sending}>
                        {sending && <Spinner size="sm" animation="border" className="me-2" />}
                        Create pin
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreatePinPage;
