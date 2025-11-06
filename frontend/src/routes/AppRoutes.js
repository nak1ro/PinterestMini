import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useParams} from 'react-router-dom';
import Header from '../components/common/Header';
import SideBar from '../components/bars/SideBar';
import Home from '../components/pages/Home';
import Explore from '../components/pages/Explore';
import Profile from '../components/profile/Profile';
import PinDetail from '../components/pin/PinDetail';
import CreatePin from '../components/pin/CreatePin';
import {useAppContext} from '../context/AppContext';
import TagPage from '../components/pages/Tag';
import CreateBoard from '../components/board/CreateBoard';
import OtherUserProfile from '../components/profile/OtherUserProfile';
import ProfileSettings from '../components/profile/ProfileSettings';
import useUserProfile from "../hooks/useUserProfile";

const AuthenticatedLayout = ({children}) => (
    <div className="d-flex">
        <SideBar/>
        <div className="flex-grow-1">
            <Header/>
            <main style={{ marginLeft: '80px' }}>{children}</main>
        </div>
    </div>
);

const UnauthenticatedLayout = ({children}) => (
    <div className="d-flex">
        <SideBar/>
        <div className="flex-grow-1">
            <Header/>
            <main style={{ marginLeft: '80px' }}>{children}</main>
        </div>
    </div>
);

const RedirectToSelfProfile = ({children}) => {
    const {username} = useParams();
    const {user, loading} = useAppContext();

    if (loading) return null;

    if (!user) return <Navigate to="/"/>;

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

            

                {isAuthenticated && (
                    <>
                        <Route path="/create-pin" element={<AuthenticatedLayout><CreatePin/></AuthenticatedLayout>}/>
                        <Route path="/create-board"
                               element={<AuthenticatedLayout><CreateBoard/></AuthenticatedLayout>}/>
                        <Route path="/settings/profile" element={<AuthenticatedLayout><ProfileSettings/></AuthenticatedLayout>}/>
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
