import { ENDPOINTS } from "../../../constants/api";
import { apiSlice } from "../../../store/api.slice";
import type {  BasicUser, User } from "../../user/types/user.types";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth.types";


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse<BasicUser>, RegisterRequest>({
            query: (credentials) => ({
                url: ENDPOINTS.AUTH.REGISTER,
                method: 'POST',
                body: credentials,
            })
        }),
        login: builder.mutation<AuthResponse<BasicUser>, LoginRequest>({
            query: (credentials) => ({
                url: ENDPOINTS.AUTH.LOGIN,
                method: 'POST',
                body: credentials,
            })
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: ENDPOINTS.AUTH.LOGOUT,
                method: 'POST',
            })
        }),
        profile: builder.query<AuthResponse<User>, void>({
          query: () => ({
            url: ENDPOINTS.AUTH.PROFILE,
            method: 'GET',
          })
        }),
    }),
    overrideExisting: false,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useProfileQuery
} = authApi;
