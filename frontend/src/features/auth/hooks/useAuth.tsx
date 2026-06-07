import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCredentials, logout as logoutAction } from '../store/auth_slice';
import type { AuthResponse } from '../types/auth.types';
import type { BasicUser } from '../../user/types/user.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const login = useCallback((data: AuthResponse<BasicUser>) => {
    dispatch(setCredentials(data));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return { user, isAuthenticated, accessToken, login, logout };
}
