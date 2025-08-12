import {useCallback, useMemo} from 'react';
import useAsync from './common/useAsync';
import {
    isFollowingUser,
    followUser,
    unfollowUser,
    getFollowersCount,
    getFollowingCount,
} from '../services/followService';

export default function useFollowUser(targetUserId, currentUserId) {
    const enabled = Boolean(targetUserId && currentUserId && targetUserId !== currentUserId);

    const {data, loading, error, execute, setData} = useAsync(
        async () => {
            if (!enabled) {
                return {isFollowing: false, followersCount: 0, followingCount: 0};
            }
            const [statusRes, followersRes, followingRes] = await Promise.all([
                isFollowingUser(targetUserId),
                getFollowersCount(targetUserId),
                getFollowingCount(targetUserId),
            ]);

            return {
                isFollowing: !!((statusRes && statusRes.isFollowing) ?? (statusRes && statusRes.data && statusRes.data.isFollowing)),
                followersCount: (followersRes && followersRes.count) != null ? followersRes.count : (followersRes && followersRes.data && followersRes.data.count) || 0,
                followingCount: (followingRes && followingRes.count) != null ? followingRes.count : (followingRes && followingRes.data && followingRes.data.count) || 0,
            };
        },
        [targetUserId, currentUserId, enabled],
        {immediate: enabled, initialData: {isFollowing: false, followersCount: 0, followingCount: 0}}
    );

    const toggleFollow = useCallback(async () => {
        if (!enabled) return;
        try {
            if (data.isFollowing) {
                setData((prev) => ({
                    ...prev,
                    isFollowing: false,
                    followersCount: Math.max(prev.followersCount - 1, 0)
                }));
                await unfollowUser(targetUserId);
            } else {
                setData((prev) => ({...prev, isFollowing: true, followersCount: prev.followersCount + 1}));
                await followUser(targetUserId);
            }
        } catch (err) {
            await execute();
        }
    }, [enabled, data.isFollowing, setData, execute, targetUserId]);

    return useMemo(() => ({
        isFollowing: data.isFollowing,
        followersCount: data.followersCount,
        followingCount: data.followingCount,
        loading,
        error,
        toggleFollow,
        refetch: execute,
    }), [data, loading, error, toggleFollow, execute]);
}