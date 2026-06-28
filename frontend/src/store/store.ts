import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    FLUSH, REHYDRATE, PAUSE,
    PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import rootReducer from './root_reducer';
import { apiSlice } from './api.slice';

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
    devTools: import.meta.env.MODE !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;