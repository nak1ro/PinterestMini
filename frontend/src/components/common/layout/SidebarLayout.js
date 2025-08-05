// src/components/layout/SidebarLayout.js
import React from 'react';
import Sidebar from './Sidebar'; // your existing sidebar component

const SidebarLayout = ({ children }) => {
    return (
        <div className="d-flex">
            <Sidebar />

            <main className="flex-grow-1 p-4" style={{ minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
};

export default SidebarLayout;
