import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import CreatePinModal from './CreatePinModal';

const Header = () => {
  const location = useLocation();
  const { searchPins } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    searchPins(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Perform search as user types (debounced in a real app)
    searchPins(value);
  };

  return (
    <>
      <motion.header 
        className="header"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/" className="logo">Pinterest</Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>Explore</Link>
          <button 
            className="create-pin-button"
            onClick={() => setShowCreateModal(true)}
          >
            Create Pin
          </button>
        </div>
        
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search for pins..."
              value={searchTerm}
              onChange={handleChange}
            />
          </form>
        </div>
        
        <div className="nav-links">
          <Link to="/profile" className={`nav-link ${location.pathname.includes('/profile') ? 'active' : ''}`}>Profile</Link>
        </div>
      </motion.header>

      {showCreateModal && (
        <CreatePinModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

export default Header;
