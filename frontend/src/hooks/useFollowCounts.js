import useAsync from './common/useAsync';
import { getFollowersCount, getFollowingCount } from '../services/followService';

export default function useFollowCounts(userId) {
    const { data, loading, error, execute } = useAsync(
        async () => {
            if (!userId) return { followersCount: 0, followingCount: 0 };
            const [followersRes, followingRes] = await Promise.all([
                getFollowersCount(userId),
                getFollowingCount(userId),
            ]);
            return {
                followersCount: (followersRes && followersRes.count) != null ? followersRes.count : (followersRes && followersRes.data && followersRes.data.count) || 0,
                followingCount: (followingRes && followingRes.count) != null ? followingRes.count : (followingRes && followingRes.data && followingRes.data.count) || 0,
            };
        },
        [userId],
        { immediate: Boolean(userId), initialData: { followersCount: 0, followingCount: 0 } }
    );

    return {
        followersCount: data.followersCount,
        followingCount: data.followingCount,
        loading,
        error,
        refetch: execute,
    };
}