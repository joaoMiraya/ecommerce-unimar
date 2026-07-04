import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../services/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: ['Orders', 'Products']
});
