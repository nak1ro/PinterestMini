import { useSearchContext } from '../context/SearchContext';
import { fetchPinsByQuery, fetchSavedPinsByQuery } from '../services/pinService';

const useSearchPins = (mode = 'all') => {
    const {
        setSearchResults,
        setSearchQuery,
        setIsSearching,
        setHasSearched,
        resetSearch,
    } = useSearchContext();

    const searchPins = async (term, page = 1, pageSize = 20) => {
        const query = term.trim();
        if (!query) return;

        setIsSearching(true);
        setHasSearched(true);

        try {
            const fetchFn = mode === 'saved' ? fetchSavedPinsByQuery : fetchPinsByQuery;
            const result = await fetchFn(query, page, pageSize);
            const pins = (result && result.data && result.data.items) || (result && result.data) || [];
            setSearchQuery(query);
            setSearchResults(pins);
        } catch (err) {
            console.error(`Search error (${mode}):`, err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return { searchPins, resetSearch };
};

export default useSearchPins;