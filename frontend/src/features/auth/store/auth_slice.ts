import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, AuthState } from '../types/auth.types';
import type { BasicUser } from '../../user/types/user.types';

const user = sessionStorage.getItem('user');

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  accessToken: null,
  isAuthenticated: !!user,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse<BasicUser>>) {
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
    },
    setAccessToken(state, action: PayloadAction<string>) {
        state.accessToken = action.payload;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setCredentials, setAccessToken, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
