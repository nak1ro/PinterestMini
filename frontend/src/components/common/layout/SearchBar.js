// components/common/search/SearchBar.jsx
import React, { useState } from 'react';
import { useSearchContext } from '../../../context/SearchContext';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchPins } = useSearchContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPins(searchTerm.trim());
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
      <div className="flex-grow-1 ms-4">
        <form onSubmit={handleSubmit} className="w-20 d-flex">
          <input
              type="text"
              className="form-control rounded-pill px-4"
              placeholder="Search for pins..."
              value={searchTerm}
              onChange={handleChange}
              aria-label="Search pins"
          />
          <button type="submit" className="btn btn-primary ms-2">
            Search
          </button>
        </form>
      </div>
  );
};

export default SearchBar;
