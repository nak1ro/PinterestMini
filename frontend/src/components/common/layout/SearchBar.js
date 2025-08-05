import React, { useState } from 'react';
import useSearchPins from '../../../hooks/useSearchPins';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchScope, setSearchScope] = useState('all');

  const {
    searchPins,
    resetSearch
  } = useSearchPins(searchScope); // ✅ dynamic!

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    searchPins(trimmed, 1, 20);
  };

  return (
      <form onSubmit={handleSubmit} className="d-flex w-100 justify-content-center">
        <div className="d-flex rounded-pill overflow-hidden shadow-sm" style={{ backgroundColor: '#f1f1f1', height: '48px', width: '100%' }}>
          <input
              type="text"
              className="form-control border-0 rounded-0"
              placeholder="Search for ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search pins"
              style={{ backgroundColor: 'transparent', color: '#333', fontSize: '16px', boxShadow: 'none', paddingLeft: '1rem' }}
          />

          <select
              value={searchScope}
              onChange={(e) => {
                setSearchScope(e.target.value);
                resetSearch();
              }}
              className="form-select border-0 rounded-0"
              style={{ width: '160px', backgroundColor: 'transparent', fontSize: '14px', color: '#555', boxShadow: 'none' }}
          >
            <option value="all">All Pins</option>
            <option value="saved">Saved Pins</option>
          </select>

          <button type="submit" className="btn d-flex align-items-center justify-content-center border-0" style={{ width: '48px', backgroundColor: 'transparent', padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#888' }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </form>
  );
};

export default SearchBar;
