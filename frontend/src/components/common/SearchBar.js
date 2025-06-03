import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchPins } = useAppContext();

  const handleSubmit = (e) => {
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
    <motion.div 
      className="search-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for pins..."
          value={searchTerm}
          onChange={handleChange}
        />
      </form>
    </motion.div>
  );
};

export default SearchBar;
