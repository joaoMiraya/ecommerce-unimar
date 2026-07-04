import { ENDPOINTS } from "../../../constants/api";
import { apiSlice } from "../../../store/api.slice";
import type { Order, OrderRequest, OrderResponse, UpdateOrderStatusRequest } from "../types/order.types";


export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createOrder: builder.mutation<null, OrderRequest>({
          query: (credentials) => ({
              url: ENDPOINTS.ORDERS.CREATE,
              method: 'POST',
              body: credentials,
          }),
          invalidatesTags: ['Orders'],
      }),
      cancelOrder: builder.mutation<void, string>({
          query: (orderId) => ({
              url: ENDPOINTS.ORDERS.CANCEL,
              method: 'POST',
              body: { orderId },
          }),
          invalidatesTags: ['Orders'],
      }),
      getAllOrders: builder.query<OrderResponse<Order[]>, void>({
        query: () => ({
            url: ENDPOINTS.ORDERS.GET,
            method: 'GET',
        }),
        providesTags: ['Orders'],
      }),
      getSalesOrders: builder.query<OrderResponse<Order[]>, void>({
        query: () => ({
            url: ENDPOINTS.ORDERS.SALES,
            method: 'GET',
        }),
        providesTags: ['Orders'],
      }),
      updateOrderStatus: builder.mutation<void, UpdateOrderStatusRequest>({
          query: (payload) => ({
              url: ENDPOINTS.ORDERS.UPDATE_STATUS,
              method: 'POST',
              body: payload,
          }),
          invalidatesTags: ['Orders'],
      }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useGetSalesOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
