import { useState, useEffect } from 'react';
import { getComments, postComment } from '../services/commentService';

const useComments = (pinId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pinId) return;
        const fetchComments = async () => {
            try {
                const data = await getComments(pinId);
                setComments(data);
            } catch (err) {
                console.error('Failed to load comments', err);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [pinId]);

    const addComment = async (content) => {
        const c = await postComment(pinId, content);

        const normalized = {
            id: c.id,
            content: c.content,
            createdAt: c.createdAt,
            user: {
                username: c.username,
                profilePictureUrl: c.userAvatarUrl
            }
        };

        setComments((prev) => [normalized, ...prev]);
    };


    return {
        comments,
        loading,
        addComment
    };
};

export default useComments;
