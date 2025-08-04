import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchPinsByQuery } from '../services/pinService'; // путь поправь под себя


const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [mail, setMail] = useState(null);
    const [token, setToken] = useState(null);

    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const searchPins = async (term) => {
        const query = term.trim();
        if (!query) {
            setSearchQuery('');
            setSearchResults([]);
            return;
        }

        try {
            const result = await fetchPinsByQuery(query, 1, 20);


            const pins = result.data?.items || [];

            console.log('✅ Pins from server:', pins);

            setSearchQuery(query);
            setSearchResults(pins); // ✅ теперь это массив пинов
        } catch (err) {
            console.error('❌ Search error:', err);
            setSearchResults([]);
        }
    };




    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const login = (userData, userMail, jwtToken) => {
        setUser(userData);
        setMail(userMail);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('mail', userMail);
        localStorage.setItem('token', jwtToken);
    };

    const logout = () => {
        setUser(null);
        setMail(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('mail');
        localStorage.removeItem('token');
    };

    return (
        <AppContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                login,
                logout,
                searchPins,
                searchResults,
                searchQuery,
                isSearching
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
