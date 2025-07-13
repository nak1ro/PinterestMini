import { useState } from 'react';

const useSearchPins = (allPins = []) => {
    const [searchResults, setSearchResults] = useState(allPins);

    const searchPins = (term) => {
        const query = term.trim().toLowerCase();

        if (!query) {
            setSearchResults(allPins);
            return;
        }

        const filtered = allPins.filter(pin =>
            pin.title.toLowerCase().includes(query) ||
            pin.description.toLowerCase().includes(query) ||
            (Array.isArray(pin.tags) &&
                pin.tags.some(tag => tag.toLowerCase().includes(query)))
        );

        setSearchResults(filtered);
    };

    const resetSearch = () => setSearchResults(allPins);

    return { searchResults, searchPins, resetSearch };
};

export default useSearchPins;
