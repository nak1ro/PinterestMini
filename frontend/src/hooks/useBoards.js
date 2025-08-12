import { getMyBoards, changeBoardInfo, deleteBoard } from '../services/boardService';
import createCrudHook from './common/createCrudHook';

const useBoardsBase = createCrudHook({
    list: async () => getMyBoards(),
    update: async (id, formData) => changeBoardInfo(id, formData),
    remove: async (id) => deleteBoard(id),
    selectList: (r) => (Array.isArray(r && r.data) ? r.data : (Array.isArray(r) ? r : [])),
    selectItem: (r) => ((r && r.data) != null ? r.data : r),
    key: 'id',
});

export default function useBoards() {
    const { items, loading, error, refresh, setItems, updateItem, removeItem } = useBoardsBase();

    const boards = items;

    const patchBoard = (updated) => {
        setItems((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
    };

    const removeBoardLocal = (id) => {
        setItems((prev) => prev.filter((b) => b.id !== id));
    };

    return {
        boards,
        loading,
        error,
        refetch: refresh,
        patchBoard,
        removeBoard: removeBoardLocal,
        updateItem,
        removeItem,
    };
}
