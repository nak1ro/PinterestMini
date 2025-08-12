import { useCallback, useMemo } from 'react';
import { getPinsOfBoard } from '../services/boardService';
import useAsync from './common/useAsync';

export default function useBoardPins(boardId) {
    const fetcher = useCallback(async () => {
        if (!boardId) return [];
        const res = await getPinsOfBoard(boardId);
        if (Array.isArray(res && res.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
    }, [boardId]);

    const { data, loading, error, execute, setData } = useAsync(fetcher, [fetcher], {
        immediate: Boolean(boardId),
        initialData: [],
    });

    return useMemo(() => ({
        pins: data,
        loading,
        error,
        refresh: execute,
        setPins: setData,
    }), [data, loading, error, execute, setData]);
}
