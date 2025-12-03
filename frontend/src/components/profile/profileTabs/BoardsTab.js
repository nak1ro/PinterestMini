// src/components/common/layout/profileTabs/BoardsTab.jsx
import React, { useMemo, useState } from 'react';
import { Spinner, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, SortDownAlt } from 'react-bootstrap-icons';

import useBoards from '../../../hooks/useBoards';
import BoardCard from '../../board/BoardCard';
import BoardView from '../../board/BoardView';
import BeautifulDropdown, { BeautifulDropdownItem } from '../../common/BeautifulDropdown';

const BoardsTab = () => {
    const navigate = useNavigate();
    const { boards, loading, error, patchBoard, removeBoard, refetch } = useBoards();

    // Local view state: list vs board view
    const [openBoard, setOpenBoard] = useState(null);
    const [sortKey, setSortKey] = useState('name');

    const sortedBoards = useMemo(() => {
        const arr = [...boards];
        if (sortKey === 'name') {
            arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortKey === 'recent') {
            arr.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
                const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
                return dateB - dateA;
            });
        } else if (sortKey === 'created') {
            arr.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });
        }
        return arr;
    }, [boards, sortKey]);

    if (openBoard) {
        return (
            <div className="px-3 py-4">
                <BoardView
                    board={openBoard}
                    onBack={() => setOpenBoard(null)}
                    onBoardUpdated={(updated) => {
                        // Update the board in the list and openBoard state
                        patchBoard(updated);
                        setOpenBoard(updated);
                        refetch();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="px-3 py-4">
            <style>{`
                @media (min-width: 768px) {
                    .w-md-auto {
                        width: auto !important;
                    }
                }
            `}</style>
            {/* Top controls: sort + create button */}
            <div className="d-flex flex-row flex-md-row justify-content-between align-items-center mb-4 gap-3">
                {/* Left: Sort */}
                <div className="w-100 w-md-auto d-flex justify-content-start">
                    <BeautifulDropdown
                        align="start"
                        variant="standard"
                        trigger={<><SortDownAlt className="me-2" /> Sort</>}
                        onSelect={(val) => {
                            if (!val) return;
                            setSortKey(val);
                        }}
                    >
                        <BeautifulDropdownItem eventKey="name" active={sortKey === 'name'}>
                            Name (A–Z)
                        </BeautifulDropdownItem>
                        <BeautifulDropdownItem eventKey="recent" active={sortKey === 'recent'}>
                            Most recently updated
                        </BeautifulDropdownItem>
                        <BeautifulDropdownItem eventKey="created" active={sortKey === 'created'}>
                            Most recently created
                        </BeautifulDropdownItem>
                    </BeautifulDropdown>
                </div>

                {/* Right: Create */}
                <Button
                    variant="danger"
                    className="rounded-3 fw-bold px-4 py-2 fw-semibold d-flex align-items-center justify-content-center w-100 w-md-auto"
                    onClick={() => navigate('/create-board')}
                    style={{
                        background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 0, 35, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
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
            ) : sortedBoards.length === 0 ? (
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
                    {sortedBoards.map((board) => (
                        <div key={board.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <BoardCard
                                board={board}
                                onUpdated={async (updated) => {
                                    patchBoard(updated);
                                    if (openBoard && openBoard.id === updated.id) {
                                        setOpenBoard(updated);
                                    }
                                    refetch().catch(err => {
                                        console.error('Failed to refetch boards:', err);
                                    });
                                }}
                                onDeleted={(deletedId) => {
                                    removeBoard(deletedId);
                                    if (openBoard && openBoard.id === deletedId) {
                                        setOpenBoard(null);
                                    }
                                }}
                                onOpen={(b) => setOpenBoard(b)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoardsTab;
