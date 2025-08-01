import React from 'react';
import { useParams } from 'react-router-dom';
import { usePinsByTag } from '../../hooks/useTags';
import PinGrid from '../common/pin/PinGrid';

const TagPage = () => {
    const { tagName } = useParams();
    const { pins, loading, error } = usePinsByTag(tagName);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center text-danger mt-5">Tag not found or error loading pins.</div>;

    return (
        <div className="container py-4">
            <h1 className="text-center fw-bold mb-4" style={{ fontSize: '2rem' }}>
                Pins tagged with “{tagName}”
            </h1>
            {pins.length === 0
                ? <div className="text-center mt-5">No pins with this tag yet.</div>
                : <PinGrid pins={pins} />}
        </div>
    );
};

export default TagPage;
