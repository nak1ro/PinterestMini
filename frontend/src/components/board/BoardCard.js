// src/components/common/layout/boards/BoardCard.jsx
import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Lock } from 'react-bootstrap-icons';
import { getPinsCountForBoard } from '../../services/boardService';
import EditBoardModal from './EditBoardModal';

const BoardCard = ({ board, onUpdated, onDeleted, onOpen }) => {
    const [pinCount, setPinCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        let mounted = true;
        const fetchPinCount = async () => {
            try {
                const res = await getPinsCountForBoard(board.id);
                if (mounted) setPinCount(res.data.count);
            } catch (err) {
                console.error('Failed to load pin count:', err);
                if (mounted) setPinCount(0);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchPinCount();
        return () => {
            mounted = false;
        };
    }, [board.id]);

    const initials = (name) =>
        name?.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'B';

    const stringToHsl = (str) => {
        let h = 0;
        for (let i = 0; i < (str || '').length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
        return `hsl(${h}, 65%, 55%)`;
    };

    const hasCover = Boolean(board.coverImageUrl && board.coverImageUrl.trim() !== '');

    const handleOpen = () => {
        if (typeof onOpen === 'function') onOpen(board);
    };

    return (
        <>
            <Card
                className="h-100 border-0 shadow-sm"
                style={{
                    transition: 'transform 140ms ease, box-shadow 140ms ease',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hovered ? '0 0.5rem 1.25rem rgba(0,0,0,.12)' : '0 .125rem .5rem rgba(0,0,0,.08)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={handleOpen}
            >
                {/* Cover */}
                <div className="position-relative" style={{ height: 180, background: '#f8f9fa' }}>
                    {hasCover ? (
                        <Card.Img
                            variant="top"
                            src={board.coverImageUrl}
                            alt={board.name}
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                                background: `linear-gradient(135deg, ${stringToHsl(board.name)} 0%, rgba(255,255,255,.15) 100%)`,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '2rem',
                                letterSpacing: '.04em',
                            }}
                        >
                            {initials(board.name)}
                        </div>
                    )}

                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.0) 40%, rgba(0,0,0,.25) 100%)', pointerEvents: 'none' }}
                    />

                    {/* Edit */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowEditModal(true);
                        }}
                        className="btn btn-light border-0 position-absolute justify-content-center align-items-center"
                        style={{
                            top: 10,
                            right: 10,
                            borderRadius: '12px',
                            padding: '6px 10px',
                            boxShadow: '0 .25rem .75rem rgba(0,0,0,.12)',
                            minWidth: '60px',
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateY(0)' : 'translateY(-4px)',
                            transition: 'opacity 140ms ease, transform 140ms ease',
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Edit
                    </button>

                    {typeof board.isPrivate === 'boolean' && board.isPrivate && (
                        <span
                            className="position-absolute d-inline-flex align-items-center gap-1 text-white small px-2 py-1"
                            style={{ left: 10, bottom: 10, background: 'rgba(0,0,0,.45)', borderRadius: '10px', backdropFilter: 'blur(2px)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
              <Lock size={14} /> Private
            </span>
                    )}
                </div>

                {/* Body */}
                <Card.Body className="d-flex flex-column">
                    <Card.Title
                        className="mb-1 text-truncate"
                        title={board.name}
                        style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2 }}
                    >
                        {board.name}
                    </Card.Title>
                    <div className="d-flex align-items-center text-muted small">
                        {loading ? (
                            <span className="d-inline-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                <span>Loading pins…</span>
              </span>
                        ) : (
                            <span className="me-2">
                {pinCount} pin{pinCount === 1 ? '' : 's'}
              </span>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* Modal */}
            <EditBoardModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                board={board}
                onUpdated={(updated) => {
                    onUpdated && onUpdated(updated);
                }}
                onDeleted={(deletedId) => {
                    onDeleted && onDeleted(deletedId);
                }}
            />
        </>
    );
};

export default BoardCard;
