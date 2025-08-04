import React, { useState } from 'react';
import { Spinner, Form } from 'react-bootstrap';
import useCreatedPins from '../../../../hooks/useCreatedPins';
import useSavedPins from '../../../../hooks/useSavedPins';
import PinGrid from '../../pin/PinGrid';

const PinsTab = () => {
    const [onlyMyPins, setOnlyMyPins] = useState(false);
    const { createdPins, loading: loadingCreated } = useCreatedPins();
    const { savedPins, loading: loadingSaved } = useSavedPins();

    const isLoading = (onlyMyPins && loadingCreated) || (!onlyMyPins && (loadingCreated || loadingSaved));
    const pinsToShow = onlyMyPins ? createdPins : [...createdPins, ...savedPins];

    return (
        <>
            <Form.Check
                type="switch"
                id="only-my-pins"
                label="Show only my pins"
                checked={onlyMyPins}
                onChange={() => setOnlyMyPins(!onlyMyPins)}
                className="mb-3"
            />

            {isLoading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
                <PinGrid pins={pinsToShow} />
            )}
        </>
    );
};

export default PinsTab;
