import React, { createContext, useContext, useState } from 'react';
import { fetchPinsByQuery } from '../services/pinService';

const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const searchPins = async (term) => {
        const query = term.trim();
        if (!query) {
            setSearchQuery('');
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        try {
            const result = await fetchPinsByQuery(query, 1, 20);
            const pins = result.data?.items || [];
            setSearchQuery(query);
            setSearchResults(pins);
        } catch (err) {
            console.error('❌ Search error:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const resetSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
        setHasSearched(false);
    };

    return (
        <SearchContext.Provider value={{
            searchResults,
            searchQuery,
            isSearching,
            hasSearched,
            setSearchResults,
            setSearchQuery,
            setIsSearching,
            setHasSearched,
            resetSearch,
        }}>
            {children}
        </SearchContext.Provider>
    );
};
