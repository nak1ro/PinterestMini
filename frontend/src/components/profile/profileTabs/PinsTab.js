import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, SortDownAlt } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import PinGrid from '../../pin/PinGrid';
import PinGridSkeleton from '../../pin/PinGridSkeleton';
import BeautifulDropdown, { BeautifulDropdownItem } from '../../common/BeautifulDropdown';

const PinsTab = ({ pins, loading, onlyMyPins, setOnlyMyPins, onDelete }) => {
    const navigate = useNavigate();

    const [sortKey, setSortKey] = useState('recent');

    const sortedPins = useMemo(() => {
        const arr = Array.isArray(pins) ? [...pins] : [];
        if (sortKey === 'title') {
            arr.sort((a, b) => (a?.title || '').localeCompare(b?.title || ''));
        } else {
            // Most recent by createdAt (fallback to 0)
            arr.sort(
                (a, b) =>
                    new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
            );
        }
        return arr;
    }, [pins, sortKey]);

    return (
        <div className="px-3 py-4">
            <style>{`
                @media (min-width: 768px) {
                    .w-md-auto {
                        width: auto !important;
                    }
                }
            `}</style>
            {/* Top controls: toggle + sort + create button */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                {/* Left: Toggle */}
                <motion.div
                    className="d-flex fw-bold align-items-center px-3 py-2 rounded-3 fw-medium w-100 w-md-auto justify-content-center"
                    style={{
                        cursor: 'pointer',
                        background: onlyMyPins
                            ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)'
                            : '#f1f1f1',
                        color: onlyMyPins ? '#fff' : '#333',
                        border: 'none',
                        userSelect: 'none',
                        boxShadow: onlyMyPins ? '0 4px 12px rgba(230, 0, 35, 0.2)' : 'none',
                    }}
                    whileHover={{
                        scale: 1.03,
                        y: -1,
                        boxShadow: onlyMyPins
                            ? '0 6px 20px rgba(230, 0, 35, 0.3)'
                            : '0 3px 10px rgba(10, 10, 10, 0.25)',
                    }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    onClick={() => setOnlyMyPins(!onlyMyPins)}
                >
                    Created by you
                </motion.div>

                {/* Right: Sort + Create */}
                <div className="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-between justify-content-md-end">
                    <BeautifulDropdown
                        align="end"
                        variant="standard"
                        trigger={<><SortDownAlt className="me-2" /> Sort</>}
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

                    <Button
                        className="rounded-3 fw-bold px-4 py-2 fw-semibold d-flex align-items-center justify-content-center flex-grow-1 flex-md-grow-0"
                        onClick={() => navigate('/create-pin')}
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
                        Create Pin
                    </Button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ marginTop: '1rem' }}>
                    <PinGridSkeleton />
                </div>
            ) : sortedPins.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                    <PinGrid pins={sortedPins} onDelete={onDelete} />
                </div>
            ) : (
                <div className="text-center py-5">
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
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    <h4 className="text-muted fw-normal mt-3">No pins found</h4>
                    <p className="text-muted small">Try creating or saving a pin to see it here</p>
                </div>
            )}
        </div>
    );
};

export default PinsTab;
