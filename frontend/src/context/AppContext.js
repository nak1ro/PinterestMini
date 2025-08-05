// context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [mail, setMail] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedMail = localStorage.getItem('mail');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setMail(storedMail);
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

    const defaultAvatar = '/assets/avatar-default.svg';

    return (
        <AppContext.Provider
            value={{
                user,
                userId: user?.id || null,
                token,
                mail,
                isAuthenticated: !!user,
                avatarUrl:
                    user?.profilePictureUrl && user.profilePictureUrl.trim() !== ''
                        ? user.profilePictureUrl
                        : defaultAvatar,
                login,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
