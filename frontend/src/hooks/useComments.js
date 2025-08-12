import createCrudHook from './common/createCrudHook';
import { getComments, postComment } from '../services/commentService';

function normalizePosted(c) {
    return {
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
            username: c.username,
            profilePictureUrl: c.userAvatarUrl,
        },
    };
}

export default function useComments(pinId) {
    const useCrud = createCrudHook({
        list: async () => getComments(pinId),
        create: async (content) => postComment(pinId, content),
        selectList: (r) => (Array.isArray(r && r.data) ? r.data : (Array.isArray(r) ? r : [])),
        selectItem: (r) => normalizePosted((r && r.data) != null ? r.data : r),
        key: 'id',
    });

    const { items, loading, error, createItem, refresh, setItems } = useCrud();

    const addComment = async (content) => {
        const newItem = await createItem(content);
        setItems((prev) => [newItem, ...prev]);
    };

    return {
        comments: items,
        loading,
        error,
        addComment,
        refetch: refresh,
    };
}