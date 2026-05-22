export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    GET_BY_ID: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },
  PRODUCTS: {
    GET_ALL: (page: number, limit: number) => `/products/?page=${page}/limit=${limit}`,
  },
  ORDERS: {
    GET_ALL: (page: number, limit: number) => `/orders/?page=${page}/limit=${limit}`,
  },
};
