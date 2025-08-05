import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/common/layout/Header';
import SideBar from '../components/common/layout/SideBar';
import Home from '../components/pages/Home';
import Explore from '../components/pages/Explore';
import Profile from '../components/pages/Profile';
import PinDetail from '../components/pages/PinDetail';
import SearchBar from "../components/common/layout/SearchBar";
import CreatePin from '../components/pages/CreatePin';
import { useAppContext } from '../context/AppContext.js';
import ProfileDropdown from "../components/common/layout/ProfileDropdown";
import TestBoardTag from "../components/pages/TestBoardTag";
import TagPage from '../components/pages/Tag';
import CreateBoard from "../components/pages/CreateBoard";

const AppRoutes = () => {
    const { user } = useAppContext();
    const isAuthenticated = !!user;

    const AuthenticatedLayout = ({ children }) => (
        <>
            <SideBar />
            <div className="d-flex align-items-center px-3 py-2 ms-5">
                <SearchBar />
                <ProfileDropdown />
            </div>
            <main className="ms-5">{children}</main>
        </>
    );

    const UnauthenticatedLayout = ({ children }) => (
        <>
            <Header />
            <main>{children}</main>
        </>
    );

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout>
                                <Home />
                            </AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout>
                                <Home />
                            </UnauthenticatedLayout>
                        )
                    }
                />
                <Route
                    path="/explore"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout>
                                <Explore />
                            </AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout>
                                <Explore />
                            </UnauthenticatedLayout>
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout>
                                <Profile />
                            </AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout>
                                <Profile />
                            </UnauthenticatedLayout>
                        )
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout>
                                <Profile />
                            </AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout>
                                <Profile />
                            </UnauthenticatedLayout>
                        )
                    }
                />
                <Route
                    path="/pin/:id"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout>
                                <PinDetail />
                            </AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout>
                                <PinDetail />
                            </UnauthenticatedLayout>
                        )
                    }
                />
                <Route
                    path="/tag/:tagName"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout>
                                <TagPage />
                            </AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout>
                                <TagPage />
                            </UnauthenticatedLayout>
                        )
                    }
                />

                {isAuthenticated && (
                    <>
                        <Route path="/create-pin" element={<AuthenticatedLayout><CreatePin /></AuthenticatedLayout>} />
                        <Route path="/create-board" element={<AuthenticatedLayout><CreateBoard /></AuthenticatedLayout>} />
                        <Route path="/test" element={<AuthenticatedLayout><TestBoardTag /></AuthenticatedLayout>} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
