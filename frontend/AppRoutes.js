import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import Home from '../components/pages/Home';
import Explore from '../components/pages/Explore';
import Profile from '../components/pages/Profile';
import PinDetail from '../components/pages/PinDetail';

const AppRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/pin/:id" element={<PinDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
