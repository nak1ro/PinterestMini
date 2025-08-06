import { useEffect, useState } from 'react';
import {
    isFollowingUser,
    followUser,
    unfollowUser,
    getFollowersCount,
    getFollowingCount,
} from '../services/followService';

const useFollowUser = (targetUserId, currentUserId) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchFollowStatus = async () => {
        try {
            setLoading(true);
            const [statusRes, followersRes, followingRes] = await Promise.all([
                isFollowingUser(targetUserId),
                getFollowersCount(targetUserId),
                getFollowingCount(targetUserId),
            ]);
            setIsFollowing(statusRes.isFollowing);
            setFollowersCount(followersRes.count);
            setFollowingCount(followingRes.count);
        } catch (err) {
            console.error('Failed to fetch follow status', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(targetUserId);
                setIsFollowing(false);
                setFollowersCount((prev) => Math.max(prev - 1, 0));
            } else {
                await followUser(targetUserId);
                setIsFollowing(true);
                setFollowersCount((prev) => prev + 1);
            }
        } catch (err) {
            console.error('Failed to toggle follow', err);
        }
    };

    useEffect(() => {
        if (targetUserId && currentUserId && targetUserId !== currentUserId) {
            fetchFollowStatus();
        }
    }, [targetUserId, currentUserId]);

    return {
        isFollowing,
        followersCount,
        followingCount,
        loading,
        toggleFollow,
    };
};

export default useFollowUser;
