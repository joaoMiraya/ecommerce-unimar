import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import authReducer from "../features/auth/store/auth_reducer";



const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
