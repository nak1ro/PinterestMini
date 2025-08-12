import {useCallback, useEffect, useRef, useState} from 'react';

export default function useAsync(asyncFn, deps = [], options = {}) {
    const {immediate = true, initialData = undefined} = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(Boolean(immediate));
    const [error, setError] = useState(null);

    const mountedRef = useRef(true);
    const controllerRef = useRef(null);

    const execute = useCallback(async () => {
        if (!mountedRef.current) return;

        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            if (!mountedRef.current) return;
            setData(result);
        } catch (err) {
            if (!mountedRef.current) return;
            if (err && (err.name === 'CanceledError' || err.name === 'AbortError')) return;
            setError(err);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, deps);

    useEffect(() => {
        mountedRef.current = true;
        if (immediate) execute();
        return () => {
            mountedRef.current = false;
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, [execute, immediate]);

    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setLoading(false);
    }, [initialData]);

    return {data, loading, error, execute, setData, reset};
}
