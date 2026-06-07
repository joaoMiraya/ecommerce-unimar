import { ENDPOINTS } from "../../../constants/api";
import { apiSlice } from "../../../store/api.slice";
import type { AuthResponse } from "../../auth/types/auth.types";
import type {  Address, UpdateUser, User } from "../../user/types/user.types";


export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        update: builder.mutation<AuthResponse<User>, UpdateUser>({
            query: (credentials) => ({
                url: ENDPOINTS.USERS.UPDATE,
                method: 'PUT',
                body: credentials,
            })
        }),
        createAddress: builder.mutation<AuthResponse<User>, Address>({
            query: (credentials) => ({
                url: ENDPOINTS.USERS.ADDRESS,
                method: 'POST',
                body: credentials,
            })
        }),
        address: builder.mutation<AuthResponse<User>, Address>({
            query: (credentials) => ({
                url: ENDPOINTS.USERS.ADDRESS,
                method: 'PUT',
                body: credentials,
            })
        }),
        delete: builder.mutation<void, void>({
            query: (credentials) => ({
                url: ENDPOINTS.USERS.DELETE,
                method: 'DELETE',
                body: credentials,
            })
        }),
    }),
    overrideExisting: false,
});

export const {
    useUpdateMutation,
    useCreateAddressMutation,
    useAddressMutation,
    useDeleteMutation,
} = userApi;
