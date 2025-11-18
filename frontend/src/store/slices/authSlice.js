import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadInitialState = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const storedMail = localStorage.getItem('mail');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    mail: storedMail || null,
    loading: false,
  };
};

const initialState = loadInitialState();

const defaultAvatar = `${process.env.PUBLIC_URL || ''}/assets/avatar-default.svg`;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { userData, userMail, jwtToken } = action.payload;
      state.user = userData;
      state.mail = userMail;
      state.token = jwtToken;
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('mail', userMail);
      localStorage.setItem('token', jwtToken);
    },
    logout: (state) => {
      state.user = null;
      state.mail = null;
      state.token = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('mail');
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { login, logout, setLoading, updateUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.user?.id || null;
export const selectToken = (state) => state.auth.token;
export const selectMail = (state) => state.auth.mail;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAvatarUrl = (state) => {
  const user = state.auth.user;
  return user?.profilePictureUrl && user.profilePictureUrl.trim() !== ''
    ? user.profilePictureUrl
    : defaultAvatar;
};
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;

