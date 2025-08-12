// src/components/common/layout/board/BoardView.jsx
import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { ArrowLeft, Grid3x3GapFill, SortDownAlt } from 'react-bootstrap-icons';
import useBoardPins from '../../hooks/useBoardPins';

const BoardView = ({ board, onBack }) => {
    const [sortKey, setSortKey] = useState('recent'); // 'recent' | 'title'
    const { pins, loading, error, refresh } = useBoardPins(board?.id);

    const sortedPins = useMemo(() => {
        const arr = [...pins];
        if (sortKey === 'title') {
            arr.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            // 'recent' -> newest first by createdAt
            arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return arr;
    }, [pins, sortKey]);

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="light"
                        className="rounded-pill px-3 py-2 shadow-sm"
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
                    >
                        <ArrowLeft size={16} className="me-2" />
                        Back to Boards
                    </Button>

                    <h2 className="fw-bold mb-0" style={{ color: '#111' }}>
                        {board?.name || 'Board'}
                    </h2>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="outline-secondary" className="rounded-pill">
                            <SortDownAlt className="me-2" /> Sort
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item active={sortKey === 'recent'} onClick={() => setSortKey('recent')}>
                                Most recent
                            </Dropdown.Item>
                            <Dropdown.Item active={sortKey === 'title'} onClick={() => setSortKey('title')}>
                                Title (A–Z)
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <span className="text-muted small d-none d-md-inline-flex align-items-center">
            <Grid3x3GapFill size={16} className="me-1" />
                        {sortedPins.length} pin{sortedPins.length === 1 ? '' : 's'}
          </span>
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
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

            {/* Pins Grid */}
            {!loading && !error && sortedPins.length > 0 && (
                <div className="row" style={{ columnGap: '1rem' }}>
                    {/* 4 masonry-style columns */}
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        {sortedPins.filter((_, i) => i % 4 === 0).map(renderPin)}
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        {sortedPins.filter((_, i) => i % 4 === 1).map(renderPin)}
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        {sortedPins.filter((_, i) => i % 4 === 2).map(renderPin)}
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-none d-lg-block">
                        {sortedPins.filter((_, i) => i % 4 === 3).map(renderPin)}
                    </div>
                </div>
            )}
        </div>
    );
};

function renderPin(pin) {
    return (
        <div key={pin.id} className="mb-4">
            <div
                className="rounded-4 shadow-sm overflow-hidden"
                style={{
                    backgroundColor: '#f8f9fa',
                    transition: 'transform .15s ease, box-shadow .15s ease',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0.75rem 1.5rem rgba(0,0,0,.12)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 .125rem .5rem rgba(0,0,0,.08)';
                }}
            >
                {/* Natural aspect ratio; image height adjusts automatically */}
                <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                    }}
                />
            </div>
            <div className="mt-2 px-1">
                <div className="text-truncate fw-semibold" title={pin.title} style={{ color: '#111' }}>
                    {pin.title}
                </div>
            </div>
        </div>
    );
}

export default BoardView;
