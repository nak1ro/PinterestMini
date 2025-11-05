import { useState, useEffect } from 'react';
import { getComments, postComment, deleteComment } from '../services/commentService';

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
                id: c.userId || c.user?.id,
                username: c.username || c.user?.username,
                profilePictureUrl: c.userAvatarUrl || c.user?.profilePictureUrl
            }
        };

        setComments((prev) => [normalized, ...prev]);
    };

    const removeComment = async (commentId) => {
        try {
            await deleteComment(pinId, commentId);
            setComments((prev) => prev.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment', err);
            throw err;
        }
    };

    return {
        comments,
        loading,
        addComment,
        deleteComment: removeComment
    };
};

export default useComments;
