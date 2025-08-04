import { useEffect, useState } from 'react';
import { getFollowersCount, getFollowingCount } from '../services/followService';

const useFollowCounts = (userId) => {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCounts = async () => {
        try {
            setLoading(true);
            const [followersRes, followingRes] = await Promise.all([
                getFollowersCount(userId),
                getFollowingCount(userId),
            ]);
            setFollowersCount(followersRes.count);
            setFollowingCount(followingRes.count);
        } catch (error) {
            console.error('Failed to fetch follow counts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchCounts();
    }, [userId]);

    return { followersCount, followingCount, loading };
};

export default useFollowCounts;
