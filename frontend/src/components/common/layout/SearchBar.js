import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../../context/AppContext';

const SearchBar = ({width}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchPins } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPins(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchPins(value);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    searchPins(searchTerm);
  };

  return (

        <div className="flex-grow-1 ms-4">
          <form onSubmit={handleSearch} className="w-20">
            <input
                type="text"
                className="form-control rounded-pill px-4"
                placeholder="Search for pins..."
                value={searchTerm}
                onChange={handleChange}
            />
          </form>
        </div>

  );
};

export default SearchBar;
