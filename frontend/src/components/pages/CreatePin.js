import React, { useState } from 'react';
import {
    Container, Form, Row, Col, FloatingLabel, Image,
    Button, Alert, ProgressBar, Spinner
} from "react-bootstrap";

const CreatePinPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [board, setBoard] = useState('');
    const [tags, setTags] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [sending, setSending] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Creating pin:', {
            title,
            description,
            allowComments,
            board,
            tags,
            selectedFile,
        });
        // Твой код для отправки данных на backend здесь
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
                                style={{ height: "90px" }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>

                        <Form.Check
                            type="switch"
                            id="comments-switch"
                            label="Allow comments"
                            checked={allowComments}
                            onChange={() => setAllowComments(!allowComments)}
                            className="mb-3"
                        />

                        <FloatingLabel
                            controlId="pin-board"
                            label="Assign to a board (optional)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Board name"
                                value={board}
                                onChange={(e) => setBoard(e.target.value)}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="pin-tags"
                            label="Assign tags (optional)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="e.g. art, design, UI"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </FloatingLabel>
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
