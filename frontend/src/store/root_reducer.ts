import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { apiSlice } from "./api.slice";
import authReducer from "../features/auth/store/auth_reducer";
import { cartSlice } from "../features/cart/store/cart_slice";

const storage = {
    getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default persistReducer(persistConfig, rootReducer);