import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useParams} from 'react-router-dom';
import Header from '../components/common/layout/Header';
import SideBar from '../components/common/layout/SideBar';
import Home from '../components/pages/Home';
import Explore from '../components/pages/Explore';
import Profile from '../components/pages/Profile';
import PinDetail from '../components/pages/PinDetail';
import SearchBar from '../components/common/layout/SearchBar';
import CreatePin from '../components/pages/CreatePin';
import {useAppContext} from '../context/AppContext';
import ProfileDropdown from '../components/common/layout/ProfileDropdown';
import TestBoardTag from '../components/pages/TestBoardTag';
import TagPage from '../components/pages/Tag';
import CreateBoard from '../components/pages/CreateBoard';
import OtherUserProfile from '../components/pages/OtherUserProfile';
import useUserProfile from "../hooks/useUserProfile";

const AuthenticatedLayout = ({children}) => (
    <div className="d-flex">
        <SideBar/>
        <div className="flex-grow-1" style={{marginLeft: '80px'}}>
            <div className="d-flex align-items-center justify-content-between px-3 py-2">
                <SearchBar/>
                <ProfileDropdown/>
            </div>
            <main>{children}</main>
        </div>
    </div>
);

const UnauthenticatedLayout = ({children}) => (
    <>
        <Header/>
        <main>{children}</main>
    </>
);

const RedirectToSelfProfile = ({children}) => {
    const {username} = useParams();
    const {user, loading} = useAppContext();

    if (loading) return null;

    if (!user) return <Navigate to="/"/>;
    console.log(user.username);
    console.log(username);
    if (username === user.username) {
        return <Navigate to="/profile" replace/>;
    }

    return children;
};


const AppRoutes = () => {
    const {user} = useAppContext();
    const isAuthenticated = !!user;

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout><Home/></AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout><Home/></UnauthenticatedLayout>
                        )
                    }
                />

                <Route
                    path="/explore"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout><Explore/></AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout><Explore/></UnauthenticatedLayout>
                        )
                    }
                />

                <Route
                    path="/profile"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout><Profile/></AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout><Profile/></UnauthenticatedLayout>
                        )
                    }
                />

                <Route
                    path="/profile/:username"
                    element={
                        isAuthenticated ? (
                            <RedirectToSelfProfile>
                                <AuthenticatedLayout>
                                    <OtherUserProfile/>
                                </AuthenticatedLayout>
                            </RedirectToSelfProfile>
                        ) : (
                            <UnauthenticatedLayout><OtherUserProfile/></UnauthenticatedLayout>
                        )
                    }
                />


                <Route
                    path="/pin/:id"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout><PinDetail/></AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout><PinDetail/></UnauthenticatedLayout>
                        )
                    }
                />

                <Route
                    path="/tag/:tagName"
                    element={
                        isAuthenticated ? (
                            <AuthenticatedLayout><TagPage/></AuthenticatedLayout>
                        ) : (
                            <UnauthenticatedLayout><TagPage/></UnauthenticatedLayout>
                        )
                    }
                />

                />

                {isAuthenticated && (
                    <>
                        <Route path="/create-pin" element={<AuthenticatedLayout><CreatePin/></AuthenticatedLayout>}/>
                        <Route path="/create-board"
                               element={<AuthenticatedLayout><CreateBoard/></AuthenticatedLayout>}/>
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
