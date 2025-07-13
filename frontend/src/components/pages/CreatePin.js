import React, { useState, useEffect } from 'react';
import {
    Container, Form, Row, Col, FloatingLabel, Image,
    Button, Alert, ProgressBar, Spinner
} from "react-bootstrap";
import axios from 'axios';

const CreatePinPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [sending, setSending] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);
    const [error, setError] = useState(null);

    const [boards, setBoards] = useState([]);        // список доступных досок
    const [tags, setTags] = useState([]);            // список доступных тегов
    const [selectedBoards, setSelectedBoards] = useState([]); // выбранные доски
    const [selectedTags, setSelectedTags] = useState([]);     // выбранные теги

    const token = localStorage.getItem('token'); // JWT доступ

    useEffect(() => {
        const fetchBoardsAndTags = async () => {
            try {
                const [boardsRes, tagsRes] = await Promise.all([
                    axios.get('/api/board/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('/api/tag/', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setBoards(boardsRes.data); // массив объектов досок
                setTags(tagsRes.data);     // массив объектов тегов
            } catch (err) {
                setError('Ошибка загрузки досок или тегов');
            }
        };
        fetchBoardsAndTags();
    }, [token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSending(true);
        setUploadPct(0);

        try {
            const formData = new FormData();
            formData.append("Title", title);
            formData.append("AllowComments", allowComments.toString());
            if (description) formData.append("Description", description);
            if (selectedFile) formData.append("Image", selectedFile);

            // Добавим ID досок
            selectedBoards.forEach(id => formData.append("BoardIds", id));
            // Добавим ID тегов
            selectedTags.forEach(id => formData.append("TagIds", id));

            const res = await axios.post('/api/pin', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadPct(percent);
                }
            });

            console.log('Pin created:', res.data);
        } catch (err) {
            console.error(err);
            setError('Ошибка создания пина');
        } finally {
            setSending(false);
        }
    };

    const toggleItem = (id, list, setter) => {
        setter(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Create a New Pin</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={5}>
                        <Form.Group controlId="pin-image" className="mb-3">
                            <Form.Label>Pin image *</Form.Label>
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

                        <FloatingLabel
                            controlId="pin-description"
                            label="Description (optional)"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder=" "
                                style={{ height: "120px" }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>

                        <Form.Group className="mb-3">
                            <Form.Label>Assign to Boards</Form.Label>
                            {boards.map(board => (
                                <Form.Check
                                    key={board.id}
                                    type="checkbox"
                                    label={board.name}
                                    checked={selectedBoards.includes(board.id)}
                                    onChange={() => toggleItem(board.id, selectedBoards, setSelectedBoards)}
                                />
                            ))}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Assign Tags</Form.Label>
                            {tags.map(tag => (
                                <Form.Check
                                    key={tag.id}
                                    type="checkbox"
                                    label={tag.name}
                                    checked={selectedTags.includes(tag.id)}
                                    onChange={() => toggleItem(tag.id, selectedTags, setSelectedTags)}
                                />
                            ))}
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
                    <Button variant="danger" type="submit" disabled={sending}>
                        {sending && <Spinner size="sm" animation="border" className="me-2" />}
                        Create Pin
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreatePinPage;
