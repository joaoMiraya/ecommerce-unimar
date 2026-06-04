import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/api';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = originalRequest.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
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
    const result = await axiosInstance({
      url,
      method,
      data: body,
      params,
      headers,
    });
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
