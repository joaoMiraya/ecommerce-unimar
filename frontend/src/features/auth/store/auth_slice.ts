import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, AuthState } from '../types/auth.types';

const user = sessionStorage.getItem('user');

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  accessToken: null,
  isAuthenticated: !!user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
    },
    setAccessToken(state, action: PayloadAction<string>) {
        state.accessToken = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
