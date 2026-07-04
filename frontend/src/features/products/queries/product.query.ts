import { ENDPOINTS, type Pagination } from "../../../constants/api";
import { apiSlice } from "../../../store/api.slice";
import type { CreateProductType, Product, ProductRequest, ProductResponse } from "../types/product.types";


export const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      create: builder.mutation<ProductResponse<Product>, CreateProductType>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.PRODUCT,
              method: 'POST',
              body: credentials,
          }),
          invalidatesTags: ['Products'],
      }),
      update: builder.mutation<ProductResponse<Product>, Product>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.PRODUCT,
              method: 'PUT',
              body: credentials,
          }),
          invalidatesTags: ['Products'],
      }),
      delete: builder.mutation<void, Product>({
        query: () => ({
          url: ENDPOINTS.PRODUCTS.PRODUCT,
          method: 'DELETE',
        }),
        invalidatesTags: ['Products'],
      }),
      get: builder.query<ProductResponse<Product[]>, void>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.PRODUCT,
              method: 'GET',
              body: credentials,
          }),
          providesTags: ['Products'],
      }),
      getAll: builder.query<ProductResponse<Product[]>, ProductRequest>({
        query: (filters) => ({
            url: ENDPOINTS.PRODUCTS.PRODUCT,
            method: 'GET',
            params: filters,
        }),
        providesTags: ['Products'],
      }),
      own: builder.query<ProductResponse<Product[]>, Pagination>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.OWN,
              method: 'GET',
              body: credentials,
          }),
          providesTags: ['Products'],
      }),
  }),
  overrideExisting: false,
});

export const {
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
    useGetQuery,
    useGetAllQuery,
    useOwnQuery,
} = productApi;
