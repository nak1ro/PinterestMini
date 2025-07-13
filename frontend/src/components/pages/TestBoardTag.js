import React, { useState, useEffect } from 'react';
import {
    Container, Form, Row, Col, FloatingLabel,
    Button, Alert, Spinner, Card, ListGroup, Image
} from "react-bootstrap";

import {
    createBoard,
    getMyBoards
} from '../../services/boardService';

import {
    createTag,
    getAllTags
} from '../../services/tagService';

const TestBoardTagPage = () => {
    const [boardName, setBoardName] = useState('');
    const [boardDescription, setBoardDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [boards, setBoards] = useState([]);

    const [tagName, setTagName] = useState('');
    const [tags, setTags] = useState([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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


    const handleBoardSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append("name", boardName);
            if (boardDescription) formData.append("description",boardDescription);
            formData.append("isPrivate", isPrivate);
            if (coverImage) formData.append("coverImage" , coverImage);
            console.log(formData);
            await createBoard(formData);
            setBoardName('');
            setBoardDescription('');
            setCoverImage(null);
            setIsPrivate(false);
            fetchBoards();
        } catch (err) {
            console.error(err);
            setError('Ошибка при создании доски');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container className="py-4">
            <h2 className="mb-4">🧪 Test Board & Tag Creation</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col md={6}>
                    <h4>📌 Create Board</h4>
                    <Form onSubmit={handleBoardSubmit}>
                        <FloatingLabel label="Board Name" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Description (optional)" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={boardDescription}
                                onChange={(e) => setBoardDescription(e.target.value)}
                            />
                        </FloatingLabel>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Private Board"
                                checked={isPrivate}
                                onChange={() => setIsPrivate(!isPrivate)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cover Image (optional)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Create Board'}
                        </Button>
                    </Form>
                </Col>

                <Col md={6}>
                    <h4>🏷️ Create Tag</h4>
                    <Form>
                        <FloatingLabel label="Tag Name" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <Button type="submit" variant="secondary" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Create Tag'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <hr className="my-4" />
            <Row>
                <Col md={6}>
                    <h5>📋 Your Boards</h5>
                    {boards.map(board => (
                        <Card key={board.id} className="mb-2">
                            <Card.Body>
                                <Card.Title>{board.name}</Card.Title>
                                <Card.Text>{board.description || 'No description'}</Card.Text>
                                <Card.Text><strong>Private:</strong> {board.isPrivate ? 'Yes' : 'No'}</Card.Text>
                                {board.coverImageUrl && (
                                    <Image src={board.coverImageUrl} thumbnail style={{ maxHeight: '100px' }} />
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </Col>

                <Col md={6}>
                    <h5>🏷️ All Tags</h5>
                    <ListGroup>
                        {tags.map(tag => (
                            <ListGroup.Item key={tag.id}>{tag.name}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default TestBoardTagPage;
