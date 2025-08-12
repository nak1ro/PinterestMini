import React, { useState } from 'react';
import {
    Container, Form, Row, Col, FloatingLabel, Image,
    Button, Alert, Spinner, ProgressBar
} from 'react-bootstrap';
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

            // Reset form
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
        <Container className="py-4">
            <h2 className="mb-4">Create new board</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={5}>
                        <Form.Group controlId="board-image" className="mb-3">
                            <Form.Label>Cover image (optional)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        {previewUrl && (
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                thumbnail
                                className="w-100 mb-3"
                            />
                        )}
                    </Col>

                    <Col md={7}>
                        <FloatingLabel controlId="board-name" label="Board name *" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Board name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="board-description" label="Description (optional)" className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="Description"
                                style={{ height: '100px' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>

                        <Form.Check
                            type="switch"
                            id="privacy-switch"
                            label="Make board private"
                            checked={isPrivate}
                            onChange={() => setIsPrivate(!isPrivate)}
                            className="mb-3"
                        />
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}
                {sending && <ProgressBar now={uploadPct} animated className="mt-2" />}

                <div className="mt-4 d-flex justify-content-end">
                    <Button type="submit" variant="primary" disabled={sending}>
                        {sending && <Spinner size="sm" animation="border" className="me-2" />}
                        Create board
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreateBoardPage;
