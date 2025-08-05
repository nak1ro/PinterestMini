import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { getPinsCountForBoard } from '../../../services/boardService';

const BoardCard = ({ board }) => {
    const [pinCount, setPinCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPinCount = async () => {
            try {
                const res = await getPinsCountForBoard(board.id);
                setPinCount(res.data.count);
            } catch (err) {
                console.error('Failed to load pin count:', err);
                setPinCount(0);
            } finally {
                setLoading(false);
            }
        };
        fetchPinCount();
    }, [board.id]);

    const handleEdit = () => {
        navigate(`/edit-board/${board.id}`);
    };

    return (
        <Card className="h-100 shadow-sm">
            {board.coverImageUrl && (
                <Card.Img
                    variant="top"
                    src={board.coverImageUrl}
                    style={{ height: '180px', objectFit: 'cover' }}
                />
            )}
            <Card.Body className="d-flex flex-column">
                {/* Header: title + pencil icon */}
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <Card.Title className="fs-5 mb-0">{board.name}</Card.Title>
                    <Pencil
                        size={18}
                        role="button"
                        className="text-muted"
                        onClick={handleEdit}
                        title="Edit board"
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                {/* Pin count */}
                <Card.Text className="text-muted small mb-0">
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        `${pinCount} pin${pinCount === 1 ? '' : 's'}`
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default BoardCard;
