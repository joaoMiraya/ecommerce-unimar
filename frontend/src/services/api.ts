import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/api';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const getStore = async () => {
  const { store } = await import('../store/store');
  return store;
};

axiosInstance.interceptors.request.use(async (config) => {
  const store = await getStore();
  const accessToken = store.getState().auth.accessToken;  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const authRoutes = [
  '/auth/login',
  '/auth/register',
];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {    
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = authRoutes.some(route =>
      originalRequest.url?.includes(route)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;      
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );        
        const store = await getStore();
        const { setCredentials } = await import('../features/auth/store/auth_slice');
        store.dispatch(setCredentials(data));

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.data.accessToken}`,
        };

        return axiosInstance(originalRequest);
      } catch (refreshError) {        
        const store = await getStore();
        const { logout } = await import('../features/auth/store/auth_slice');
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const axiosBaseQuery = (): BaseQueryFn<{
  url: string;
  method: AxiosRequestConfig['method'];
  body?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}> => async ({ url, method, body, params, headers }) => {
  try {
    const result = await axiosInstance({ url, method, data: body, params, headers });
    return { data: result.data };
  } catch (error) {
    const err = error as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};