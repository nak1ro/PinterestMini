import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import './styles/index.css';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
