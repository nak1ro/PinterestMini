import useAsync from './common/useAsync';
import { getFollowing } from '../services/followService';

export default function useUserFollowing(userId, enabled = true) {
    const { data, loading, error, execute } = useAsync(
        async () => {
            if (!enabled || !userId) return [];
            const res = await getFollowing(userId);
            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [userId, enabled],
        { immediate: Boolean(enabled && userId), initialData: [] }
    );

    return { following: data, loading, error, refetch: execute };
}