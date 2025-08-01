import { useState } from 'react';
import { fetchPinsByQuery } from '../services/pinService';

const useSearchPins = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalPages: 0,
        totalCount: 0,
    });

    const searchPins = async (term, page = 1, pageSize = 20) => {
        const query = term.trim();
        if (!query) {
            setSearchResults([]);
            setPagination(prev => ({ ...prev, page: 1, totalPages: 0, totalCount: 0 }));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchPinsByQuery(query, page, pageSize);
            setSearchResults(result.data);
            setPagination({
                page: result.page,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
                totalCount: result.totalCount,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetSearch = () => {
        setSearchResults([]);
        setPagination({
            page: 1,
            pageSize: 20,
            totalPages: 0,
            totalCount: 0,
        });
        setError(null);
    };

    return {
        searchResults,
        searchPins,
        resetSearch,
        loading,
        error,
        pagination,
    };
};

export default useSearchPins;
