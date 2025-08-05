import React from 'react';
import { Spinner, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'react-bootstrap-icons';
import PinGrid from '../../pin/PinGrid';

const PinsTab = ({ pins, loading, onlyMyPins, setOnlyMyPins }) => {
    const navigate = useNavigate();

    return (
        <div className="px-3 py-4">
            {/* Top controls: toggle + button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                    type="switch"
                    id="only-my-pins"
                    label="Show only my pins"
                    checked={onlyMyPins}
                    onChange={() => setOnlyMyPins(!onlyMyPins)}
                    className="fw-medium"
                    style={{
                        color: 'var(--pinterest-text)'
                    }}
                />

                <Button
                    variant="danger"
                    className="rounded-pill px-4 py-2 fw-semibold"
                    onClick={() => navigate('/create-pin')}
                    style={{
                        background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px) scale(1.02)';
                        e.target.style.boxShadow = '0 8px 25px rgba(230, 0, 35, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <Plus className="me-2" size={18} />
                    Create Pin
                </Button>
            </div>

            {/* Content: loading or grid */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-3">Loading pins...</p>
                </div>
            ) : pins.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                    <PinGrid pins={pins} />
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
