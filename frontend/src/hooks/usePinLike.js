import { useState, useEffect } from 'react';
import { likePin, unlikePin, isPinLiked, getLikeStatus } from '../services/pinService';

const usePinLike = (pinId) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const fetchLikeStatus = async () => {
        try {
            const [likedRes, countRes] = await Promise.all([
                isPinLiked(pinId),
                getLikeStatus(pinId)
            ]);
            setLiked(likedRes.isLiked);
            setLikeCount(countRes.count); // ✅ FIXED HERE
        } catch (err) {
            console.error('Error fetching like status', err);
        }
    };

    useEffect(() => {
        if (pinId) fetchLikeStatus();
    }, [pinId]);

    const toggleLike = async () => {
        try {
            if (liked) {
                await unlikePin(pinId);
            } else {
                await likePin(pinId);
            }
            await fetchLikeStatus(); // refresh from backend
        } catch (err) {
            console.error('Error toggling like', err);
        }
    };

    return { liked, likeCount, toggleLike };
};

export default usePinLike;
