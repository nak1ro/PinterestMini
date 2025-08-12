import useAsync from './common/useAsync';
import { getFollowers } from '../services/followService';

export default function useUserFollowers(userId, enabled = true) {
    const { data, loading, error, execute } = useAsync(
        async () => {
            if (!enabled || !userId) return [];
            const res = await getFollowers(userId);
            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [userId, enabled],
        { immediate: Boolean(enabled && userId), initialData: [] }
    );

    return { followers: data, loading, error, refetch: execute };
}