// src/components/layout/SidebarLayout.js
import React from 'react';
import Sidebar from './Sidebar';
import Header from "./Header"; // your existing sidebar component

const SidebarLayout = ({ children }) => {
    return (
        <div className="d-flex">
            <Sidebar />

            <div className="flex-grow-1" style={{ marginLeft: '60px' }}>
                <Header />
                <main className="p-4" style={{ minHeight: '100vh' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default SidebarLayout;
