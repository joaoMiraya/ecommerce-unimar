import { ENDPOINTS } from "../../../constants/api";
import { apiSlice } from "../../../store/api.slice";
import type { Product, ProductRequest, ProductResponse } from "../types/product.types";


export const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      create: builder.mutation<ProductResponse<Product>, Product>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.PRODUCT,
              method: 'POST',
              body: credentials,
          })
      }),
      update: builder.mutation<ProductResponse<Product>, Product>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.PRODUCT,
              method: 'PUT',
              body: credentials,
          })
      }),
      delete: builder.mutation<void, Product>({
        query: () => ({
          url: ENDPOINTS.PRODUCTS.PRODUCT,
          method: 'DELETE',
        })
      }),
      get: builder.query<ProductResponse<Product[]>, void>({
          query: (credentials) => ({
              url: ENDPOINTS.PRODUCTS.GET,
              method: 'GET',
              body: credentials,
          })
      }),
      getAll: builder.query<ProductResponse<Product[]>, ProductRequest>({
          query: ({ page, limit }) => ({
              url: ENDPOINTS.PRODUCTS.GET_ALL(page, limit),
              method: 'GET',
          }),
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
} = productApi;
