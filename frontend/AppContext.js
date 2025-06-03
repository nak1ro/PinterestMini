import React, {createContext, useState, useContext} from 'react';
import pins from '../data/pins';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({children}) => {
    const [allPins, setAllPins] = useState(pins);
    const [savedPins, setSavedPins] = useState([]);
    const [searchResults, setSearchResults] = useState(pins);

    // Search functionality
    const searchPins = (searchTerm) => {
        // If a result is empty => show all pins
        if (!searchTerm.trim()) {
            setSearchResults(allPins);
            return;
        }

        // Filter pins based on the search term
        const filtered = allPins.filter(pin =>
            pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        setSearchResults(filtered);
    };

    // Save pin functionality
    const savePin = (pinId) => {
        //  Find the pin to save in the allPins array
        const pinToSave = allPins.find(pin => pin.id === pinId);
        //  If the pin is not already saved and exists, add it to the savedPins array
        if (pinToSave && !savedPins.some(pin => pin.id === pinId)) {
            setSavedPins([...savedPins, pinToSave]);
        }
    };

    // Unsave pin functionality
    const unsavePin = (pinId) => {
        // Keep the pins whose id is NOT equal to the pinId
        setSavedPins(savedPins.filter(pin => pin.id !== pinId));
    };

    // Check if a pin is saved
    const isPinSaved = (pinId) => {
        return savedPins.some(pin => pin.id === pinId);
    };

    return (
        <AppContext.Provider value={{
            allPins,
            savedPins,
            searchResults,
            searchPins,
            savePin,
            unsavePin,
            isPinSaved
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
