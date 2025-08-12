import { useCallback, useMemo } from 'react';
import useAsync from './useAsync';

export default function createCrudHook(cfg) {
    const {
        list,
        create,
        update,
        remove,
        selectList = (r) => (Array.isArray(r && r.data) ? r.data : (Array.isArray(r) ? r : [])),
        selectItem = (r) => ((r && r.data) != null ? r.data : r),
        key = 'id',
    } = cfg;

    return function useCrud(args) {
        const fetcher = useCallback(async () => {
            const res = await list(args);
            return selectList(res);
        }, [list, args]);

        const { data, loading, error, execute, setData } = useAsync(fetcher, [fetcher], {
            immediate: true,
            initialData: [],
        });

        const createItem = useCallback(async (payload) => {
            if (!create) throw new Error('create not configured');
            const res = await create(payload);
            const item = selectItem(res);
            setData((prev) => [item, ...prev]);
            return item;
        }, [create, selectItem, setData]);

        const updateItem = useCallback(async (id, payload) => {
            if (!update) throw new Error('update not configured');
            const res = await update(id, payload);
            const item = selectItem(res);
            setData((prev) => prev.map((x) => (x[key] === id ? item : x)));
            return item;
        }, [update, selectItem, setData, key]);

        const removeItem = useCallback(async (id) => {
            if (!remove) throw new Error('remove not configured');
            await remove(id);
            setData((prev) => prev.filter((x) => x[key] !== id));
        }, [remove, setData, key]);

        return useMemo(
            () => ({
                items: data,
                loading,
                error,
                refresh: execute,
                setItems: setData,
                createItem,
                updateItem,
                removeItem,
            }),
            [data, loading, error, execute, setData, createItem, updateItem, removeItem]
        );
    };
}
