import { useEffect, useState } from 'react';
import { getCreatedPins } from '../services/pinService'; // 👈

const useCreatedPins = () => {
    const [createdPins, setCreatedPins] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCreatedPins = async () => {
        setLoading(true);
        try {
            const data = await getCreatedPins(); // ✅ без username
            setCreatedPins(data);
        } catch (error) {
            console.error('Error fetching created pins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreatedPins();
    }, []);

    return {
        createdPins,
        loading,
        refetch: fetchCreatedPins,
    };
};

export default useCreatedPins;
