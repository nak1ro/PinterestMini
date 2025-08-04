import React from 'react';
import { Card } from 'react-bootstrap';

const BoardCard = ({ board }) => {
    return (
        <Card className="h-100 shadow-sm">
            {board.coverImageUrl && (
                <Card.Img
                    variant="top"
                    src={board.coverImageUrl}
                    style={{ height: '150px', objectFit: 'cover' }}
                />
            )}
            <Card.Body>
                <Card.Title>{board.name}</Card.Title>
                <Card.Text>{board.description || 'No description'}</Card.Text>
                <Card.Text className="text-muted small">{board.isPrivate ? 'Private' : 'Public'}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default BoardCard;
