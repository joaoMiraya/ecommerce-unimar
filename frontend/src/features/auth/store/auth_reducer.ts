import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import authSlice from './auth_slice';

const authPersistConfig = {
  key: 'auth',
  storage: storageSession,
  whitelist: ['user', 'isAuthenticated'],
};

const authReducer = persistReducer(authPersistConfig, authSlice);

export default authReducer;