import { ENDPOINTS } from "../../../constants/api";
import { apiSlice } from "../../../store/api.slice";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth.types";


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: ENDPOINTS.AUTH.REGISTER,
                method: 'POST',
                body: credentials,
            })
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: ENDPOINTS.AUTH.LOGIN,
                method: 'POST',
                body: credentials,
            })
        }),
        logout: builder.mutation<void, void>({
            query: (credentials) => ({
                url: ENDPOINTS.AUTH.LOGOUT,
                method: 'POST',
                body: credentials,
            })
        }),
    }),
    overrideExisting: false,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation
} = authApi;
