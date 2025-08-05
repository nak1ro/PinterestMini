import React, { useEffect, useState } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMyBoards } from '../../../../services/boardService';
import BoardCard from '../BoardCard';
import { Plus } from 'react-bootstrap-icons'; // optional icon library

const BoardsTab = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const res = await getMyBoards();
            setBoards(res.data);
        } catch (err) {
            console.error('Failed to fetch boards', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const handleCreateBoard = () => {
        navigate('/create-board');
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Header with "+" button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">My Boards</h5>
                <Button variant="outline-primary" onClick={handleCreateBoard}>
                    <Plus size={20} className="me-1" />
                    Create
                </Button>
            </div>

            {/* Boards list */}
            {boards.length === 0 ? (
                <p className="text-center mt-4">You don't have any boards yet.</p>
            ) : (
                <div className="row">
                    {boards.map((board) => (
                        <div key={board.id} className="col-md-3 mb-4">
                            <BoardCard board={board} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoardsTab;
