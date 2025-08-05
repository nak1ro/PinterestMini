import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import { SearchProvider } from './context/SearchContext';

function App() {
    return (
        <AppProvider>
            <SearchProvider>
                <AppRoutes />
            </SearchProvider>
        </AppProvider>
    );
}

export default App;
