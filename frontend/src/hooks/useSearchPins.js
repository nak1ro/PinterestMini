import { useAppDispatch } from './redux';
import {
    setSearchResults,
    setSearchQuery,
    setIsSearching,
    setHasSearched,
    resetSearch,
} from '../store/slices/searchSlice';
import { fetchPinsByQuery, fetchSavedPinsByQuery } from '../services/pinService';

const useSearchPins = (mode = 'all') => {
    const dispatch = useAppDispatch();

    const searchPins = async (term, page = 1, pageSize = 20) => {
        const query = term.trim();
        if (!query) return;

        dispatch(setIsSearching(true));
        dispatch(setHasSearched(true));

        try {
            const fetchFn = mode === 'saved' ? fetchSavedPinsByQuery : fetchPinsByQuery;
            const result = await fetchFn(query, page, pageSize);
            const pins = (result && result.data && result.data.items) || (result && result.data) || [];
            dispatch(setSearchQuery(query));
            dispatch(setSearchResults(pins));
        } catch (err) {
            console.error(`Search error (${mode}):`, err);
            dispatch(setSearchResults([]));
        } finally {
            dispatch(setIsSearching(false));
        }
    };

    return {
        searchPins,
        resetSearch: () => dispatch(resetSearch())
    };
};

export default useSearchPins;