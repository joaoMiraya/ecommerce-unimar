import { persistReducer } from 'redux-persist';
import authSlice from './auth_slice';

const getSessionStorage = () => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const s = window.sessionStorage;
    // redux-persist expects async storage (returning promises). Wrap sessionStorage in promise-based API.
    return {
      getItem: (key: string) => Promise.resolve(s.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(s.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(s.removeItem(key)),
    } as unknown as Storage;
  }
  return undefined;
};

const authPersistConfig = {
  key: 'auth',
  storage: getSessionStorage() as Storage,
  whitelist: ['user', 'isAuthenticated'],
};

const authReducer = persistReducer(authPersistConfig, authSlice);

export default authReducer;