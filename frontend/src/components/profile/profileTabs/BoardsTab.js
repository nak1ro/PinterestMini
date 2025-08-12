// src/components/common/layout/profileTabs/BoardsTab.jsx
import React from 'react';
import { Spinner, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'react-bootstrap-icons';

import useBoards from '../../../hooks/useBoards';
import BoardCard from '../../board/BoardCard';

const BoardsTab = () => {
    const navigate = useNavigate();
    const { boards, loading, error, patchBoard, removeBoard } = useBoards();

    return (
        <div className="px-3 py-4">
            {/* "+" Button */}
            <div className="d-flex justify-content-end align-items-center mb-4">
                <Button
                    variant="danger"
                    className="rounded-3 fw-bold px-4 py-2 fw-semibold d-flex align-items-center justify-content-center"
                    onClick={() => navigate('/create-board')}
                    style={{
                        background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px) scale(1.02)';
                        e.target.style.boxShadow = '0 6px 20px rgba(230, 0, 35, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <Plus className="me-2 fw-bold" size={23} />
                    Create Board
                </Button>
            </div>

            {/* Loading / Error / Empty / List */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="text-muted mt-3 mb-0">Loading boards…</p>
                </div>
            ) : error ? (
                <div className="py-5">
                    <Alert variant="danger">
                        {error?.response?.data?.message || error.message || 'Failed to load boards.'}
                    </Alert>
                </div>
            ) : boards.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
                        </svg>
                    </div>
                    <h4 className="text-muted fw-normal mb-2">No boards yet</h4>
                    <p className="text-muted small">Create your first board to organize your pins</p>
                </div>
            ) : (
                <div className="row g-4">
                    {boards.map((board) => (
                        <div key={board.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <BoardCard
                                board={board}
                                onUpdated={(updated) => {
                                    // Update the board in the list immediately (name/desc/privacy/cover)
                                    patchBoard(updated);
                                }}
                                onDeleted={(deletedId) => {
                                    // Remove from list immediately
                                    removeBoard(deletedId);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoardsTab;
