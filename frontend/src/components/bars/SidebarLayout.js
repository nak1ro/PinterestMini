// src/components/layout/SidebarLayout.js
import React from 'react';
import Sidebar from './SideBar';
import BottomNav from './BottomNav';
import Header from "../common/Header";

const SidebarLayout = ({ children }) => {
    return (
        <>
            <style>{`
                .main-content-wrapper {
                    margin-left: 80px;
                }

                .main-content {
                    padding: 1rem;
                    min-height: 100vh;
                }

                @media (max-width: 768px) {
                    .main-content-wrapper {
                        margin-left: 0 !important;
                    }

                    .main-content {
                        padding: 0.75rem;
                        padding-bottom: 90px; /* Space for bottom nav */
                    }
                }
            `}</style>

            <div className="d-flex">
                <Sidebar />

                <div className="main-content-wrapper flex-grow-1">
                    <Header />
                    <main className="main-content">
                        {children}
                    </main>
                </div>

                <BottomNav />
            </div>
        </>
    );
};

export default SidebarLayout;
