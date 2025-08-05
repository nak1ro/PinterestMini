import React from 'react';
import { Spinner, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'react-bootstrap-icons'; // Optional icon library
import useCreatedPins from '../../../../hooks/useCreatedPins';
import useSavedPins from '../../../../hooks/useSavedPins';
import PinGrid from '../../pin/PinGrid';

const PinsTab = ({ pins, loading, onlyMyPins, setOnlyMyPins }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                    type="switch"
                    id="only-my-pins"
                    label="Show only my pins"
                    checked={onlyMyPins}
                    onChange={() => setOnlyMyPins(!onlyMyPins)}
                />
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate('/create-pin')}
                >
                    <Plus className="me-1" />
                    Create Pin
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <PinGrid pins={pins} />
            )}
        </>
    );
};

export default PinsTab;
