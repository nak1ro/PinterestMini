import React, {useMemo, useState} from 'react';
import {Button, Alert, Spinner} from 'react-bootstrap';
import {ArrowLeft, Grid3x3GapFill, SortDownAlt} from 'react-bootstrap-icons';
import useBoardPins from '../../hooks/useBoardPins';
import PinGrid from '../pin/PinGrid';
import {removePinFromBoard} from '../../services/boardService';
import BeautifulDropdown, {BeautifulDropdownItem} from '../common/BeautifulDropdown';

const BoardView = ({board, onBack}) => {
    const [sortKey, setSortKey] = useState('recent'); // 'recent' | 'title'
    const {pins, loading, error, refresh, setPins} = useBoardPins(board?.id);

    const sortedPins = useMemo(() => {
        const arr = [...pins];
        if (sortKey === 'title') {
            arr.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return arr;
    }, [pins, sortKey]);

    const handleRemoveFromBoard = async (pinId) => {
        if (!board?.id) return;
        
        try {
            await removePinFromBoard(board.id, pinId);
            setPins((prevPins) => prevPins.filter(p => p.id !== pinId));
            await refresh();
        } catch (err) {
            console.error('Failed to remove pin from board:', err);
            alert('Failed to remove pin from board. Please try again.');
            await refresh();
        }
    };

    return (
        <div className="container-fluid">
            {/* Title */}
            <h2 className="fw-bold mb-3" style={{color: '#111'}}>
                {board?.name || 'Board'}
            </h2>

            {/* Header row */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                {/* Left: Back button */}
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="light"
                        className="rounded-3 px-3 py-2 shadow-sm"
                        onClick={onBack}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #ccc',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        aria-label="Back to Boards"
                    >
                        <ArrowLeft size={16} className="me-2"/>
                        Back to Boards
                    </Button>
                </div>

                {/* Right: Controls */}
                <div className="d-flex align-items-center gap-2">
                    <BeautifulDropdown
                        align="end"
                        variant="standard"
                        trigger={<><SortDownAlt className="me-2"/> Sort</>}
                        onSelect={(val) => {
                            if (!val) return;
                            setSortKey(val);
                        }}
                    >
                        <BeautifulDropdownItem eventKey="recent" active={sortKey === 'recent'}>
                            Most recent
                        </BeautifulDropdownItem>
                        <BeautifulDropdownItem eventKey="title" active={sortKey === 'title'}>
                            Title (A–Z)
                        </BeautifulDropdownItem>
                    </BeautifulDropdown>

                    <span className="text-muted small d-none d-md-inline-flex align-items-center">
            <Grid3x3GapFill size={16} className="me-1"/>
                        {sortedPins.length} pin{sortedPins.length === 1 ? '' : 's'}
          </span>
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border"/>
                    <p className="text-muted mt-3 mb-0">Loading pins…</p>
                </div>
            )}

            {!loading && error && (
                <div className="py-4">
                    <Alert variant="danger" className="mb-3">
                        {error?.response?.data?.message || error.message || 'Failed to load pins for this board.'}
                    </Alert>
                    <Button variant="outline-secondary" onClick={refresh} className="rounded-pill">
                        Try again
                    </Button>
                </div>
            )}

            {!loading && !error && sortedPins.length === 0 && (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
                        </svg>
                    </div>
                    <h5 className="text-muted fw-normal mb-2">No pins in this board yet</h5>
                    <p className="text-muted small mb-0">Add some pins to see them here.</p>
                </div>
            )}

            {/* Pins: reuse your Masonry PinGrid */}
            {!loading && !error && sortedPins.length > 0 && (
                <PinGrid 
                    pins={sortedPins}
                    boardId={board?.id}
                    onRemoveFromBoard={handleRemoveFromBoard}
                />
            )}
        </div>
    );
};

export default BoardView;
