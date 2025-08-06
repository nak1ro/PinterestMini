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
        const newComment = await postComment(pinId, content);
        setComments((prev) => [newComment, ...prev]);
    };

    return {
        comments,
        loading,
        addComment
    };
};

export default useComments;
