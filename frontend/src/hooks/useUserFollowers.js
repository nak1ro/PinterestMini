import { useEffect, useState } from 'react';
import { getFollowers } from '../services/followService';

const useUserFollowers = (userId, enabled = true) => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFollowers = async () => {
        try {
            setLoading(true);
            const res = await getFollowers(userId);
            setFollowers(res);
        } catch (err) {
            setError(err);
            console.error('Failed to fetch followers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (enabled && userId) {
            fetchFollowers();
        }
    }, [enabled, userId]);

    return { followers, loading, error, refetch: fetchFollowers };
};

export default useUserFollowers;