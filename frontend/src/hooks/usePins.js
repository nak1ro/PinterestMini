import { useEffect, useState } from 'react';
import {getPublicPins} from '../services/pinService';

const usePins = () => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPins = async () => {
            try {
                const response = await getPublicPins();
                setPins(response.data.items || []); // <- paginated: { items, totalCount, ... }
            } catch (error) {
                console.error('Failed to fetch pins:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPins();
    }, []);

    return { pins, loading };
};

export default usePins;