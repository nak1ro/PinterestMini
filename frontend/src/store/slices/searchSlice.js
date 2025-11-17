import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  isSearching: false,
  searchQuery: '',
  hasSearched: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setHasSearched: (state, action) => {
      state.hasSearched = action.payload;
    },
    resetSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
      state.isSearching = false;
      state.hasSearched = false;
    },
  },
});

export const {
  setSearchResults,
  setSearchQuery,
  setIsSearching,
  setHasSearched,
  resetSearch,
} = searchSlice.actions;

// Selectors
export const selectSearchResults = (state) => state.search.searchResults;
export const selectSearchQuery = (state) => state.search.searchQuery;
export const selectIsSearching = (state) => state.search.isSearching;
export const selectHasSearched = (state) => state.search.hasSearched;

export default searchSlice.reducer;

