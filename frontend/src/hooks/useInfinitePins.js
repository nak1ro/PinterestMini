import { useState, useCallback, useEffect, useRef } from 'react';
import { getPublicPins } from '../services/pinService';
import { DEFAULT_PAGE_SIZE } from '../utils/apiConstants';

const extractPins = (response) => {
    if (Array.isArray(response?.data?.items)) return response.data.items;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
};

export default function useInfinitePins() {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const currentPageRef = useRef(1);
    const mountedRef = useRef(true);

    const loadPins = useCallback(async (page = 1, append = false) => {
        if (!mountedRef.current) return;

        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const response = await getPublicPins(page, DEFAULT_PAGE_SIZE);
            const newPins = extractPins(response);
            
            if (!mountedRef.current) return;

            if (append) {
                setPins(prev => [...prev, ...newPins]);
            } else {
                setPins(newPins);
            }

            // If we got fewer items than page size, we've reached the end
            setHasMore(newPins.length === DEFAULT_PAGE_SIZE);
            currentPageRef.current = page;
        } catch (err) {
            if (!mountedRef.current) return;
            setError(err);
        } finally {
            if (mountedRef.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && mountedRef.current) {
            loadPins(currentPageRef.current + 1, true);
        }
    }, [hasMore, loadingMore, loadPins]);

    useEffect(() => {
        mountedRef.current = true;
        loadPins(1, false);
        return () => {
            mountedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { pins, loading, loadingMore, error, hasMore, loadMore };
}

