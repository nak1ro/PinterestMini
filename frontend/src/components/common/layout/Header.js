import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import AuthButtons from '../Auth/AuthButtons';
import SearchBar from './SearchBar';


const Header = () => {
  const location = useLocation();
  const { searchPins } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);



  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchPins(value);
  };

  return (
      <>
        <motion.header
            className="d-flex align-items-center justify-content-between px-4 py-3 shadow-sm sticky-top bg-white z-3"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <Link to="/" className="text-danger fw-bold fs-4 text-decoration-none me-4">Pinterest</Link>

          <nav className="d-flex align-items-center gap-3 me-4">
            <Link
                to="/"
                className={`btn btn-sm ${location.pathname === '/' ? 'btn-secondary' : 'btn-light'}`}
            >
              Home
            </Link>
            <Link
                to="/explore"
                className={`btn btn-sm ${location.pathname === '/explore' ? 'btn-secondary' : 'btn-light'}`}
            >
              Explore
            </Link>
          </nav>
              <SearchBar />
              <AuthButtons />


        </motion.header>
      </>
  );
};

export default Header;
