import { useEffect, useState } from 'react';
import localPins from '../data/pins'; // ⬅️ local fallback

const usePins = () => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null); // No need for error now

    useEffect(() => {
        setLoading(true);

        // Simulate async fetch
        setTimeout(() => {
            setPins(localPins);
            setLoading(false);
        }, 300); // optional delay for realism
    }, []);

    return {
        pins,
        loading,
        error,
        refetch: () => setPins(localPins)
    };
};

export default usePins;
