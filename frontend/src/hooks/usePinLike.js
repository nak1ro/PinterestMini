import { useCallback, useMemo } from 'react';
import useAsync from './common/useAsync';
import { likePin, unlikePin, isPinLiked, getLikeStatus } from '../services/pinService';

export default function usePinLike(pinId) {
    const { data, loading, error, execute, setData } = useAsync(
        async () => {
            if (!pinId) return { liked: false, likeCount: 0 };
            const [likedRes, countRes] = await Promise.all([isPinLiked(pinId), getLikeStatus(pinId)]);
            return {
                liked: !!((likedRes && likedRes.isLiked) ?? (likedRes && likedRes.data && likedRes.data.isLiked)),
                likeCount: (countRes && countRes.count) != null ? countRes.count : (countRes && countRes.data && countRes.data.count) || 0,
            };
        },
        [pinId],
        { immediate: Boolean(pinId), initialData: { liked: false, likeCount: 0 } }
    );

    const toggleLike = useCallback(async () => {
        if (!pinId) return;
        try {
            if (data.liked) {
                setData((prev) => ({ ...prev, liked: false, likeCount: Math.max(prev.likeCount - 1, 0) }));
                await unlikePin(pinId);
            } else {
                setData((prev) => ({ ...prev, liked: true, likeCount: prev.likeCount + 1 }));
                await likePin(pinId);
            }
        } catch (err) {
            await execute();
        }
    }, [pinId, data.liked, setData, execute]);

    return useMemo(
        () => ({ liked: data.liked, likeCount: data.likeCount, loading, error, toggleLike, refetch: execute }),
        [data, loading, error, toggleLike, execute]
    );
}