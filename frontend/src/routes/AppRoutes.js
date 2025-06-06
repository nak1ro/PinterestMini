import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/common/layout/Header';
import SideBar from '../components/common/layout/SideBar';
import Home from '../components/pages/Home';
import Explore from '../components/pages/Explore';
import Profile from '../components/pages/Profile';
import PinDetail from '../components/pages/PinDetail';
import SearchBar from "../components/common/layout/SearchBar";
import CreatePin from '../components/pages/CreatePin';
import {useAppContext} from '../context/AppContext.js';
import ProfileImage from '../components/common/layout/ProfileDropdown';
import ProfileDropdown from "../components/common/layout/ProfileDropdown";

const AppRoutes = () => {
    const [ isLoggedIn, setLogin ] = useState(0);
    const { user, login, logout } = useAppContext();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
        {user ==null ? (
            <Router>
            <div>
            <Header />
                <button onClick={() => login("smthng", null)}>Test logIn</button>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/pin/:id" element={<PinDetail />} />
            </Routes>
            </div>
            </Router>
        ) : (
            <>
                <Router>
                    <SideBar />
                    <div className="d-flex align-items-center px-3 py-2 ms-5">
                        <SearchBar />
                        <ProfileDropdown />
                    </div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/pin/:id" element={<PinDetail />} />
                        <Route path="create-pin" element={<CreatePin />} />
                    </Routes>
                </Router>
            </>
        )}
        </>
  );
};

export default AppRoutes;
