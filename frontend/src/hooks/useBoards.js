import { useCallback, useEffect, useState } from 'react';
import { getMyBoards } from '../services/boardService';

export default function useBoards() {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMyBoards();
            // backend might return { data: [...] } or just [...]
            setBoards(res.data ?? res);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const patchBoard = useCallback((updated) => {
        setBoards((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
    }, []);

    const removeBoard = useCallback((id) => {
        setBoards((prev) => prev.filter((b) => b.id !== id));
    }, []);

    return { boards, loading, error, refetch, patchBoard, removeBoard };
}
