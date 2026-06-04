import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { login as loginAction, logout as logoutAction } from '../store/auth_slice';
import type { User } from '../../user/types/user.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const login = useCallback((userData: User) => {
    dispatch(loginAction({ user: userData }));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return { user, isAuthenticated, login, logout };
}
