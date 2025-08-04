import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { getMyBoards } from '../../../../services/boardService';
import BoardCard from '../BoardCard';

const BoardsTab = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);

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

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    return boards.length === 0
        ? <p className="text-center mt-4">You don't have any boards yet.</p>
        : (
            <div className="row">
                {boards.map(board => (
                    <div key={board.id} className="col-md-6 mb-4">
                        <BoardCard board={board} />
                    </div>
                ))}
            </div>
        );
};

export default BoardsTab;
