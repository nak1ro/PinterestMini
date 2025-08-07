import { useEffect, useState } from 'react';
import { getFollowing } from '../services/followService';

const useUserFollowing = (userId, enabled = true) => {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            const res = await getFollowing(userId);
            setFollowing(res);
        } catch (err) {
            setError(err);
            console.error('Failed to fetch following:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (enabled && userId) {
            fetchFollowing();
        }
    }, [enabled, userId]);

    return { following, loading, error, refetch: fetchFollowing };
};

export default useUserFollowing;