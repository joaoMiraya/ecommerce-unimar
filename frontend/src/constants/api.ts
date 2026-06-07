export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },
  USERS: {
    UPDATE: "/users/",
    ADDRESS: "/users/address/",
    DELETE: "/users/",
    GET_BY_ID: (id: number) => `/users/${id}`,
  },
  PRODUCTS: {
    GET_ALL: (page: number, limit: number) => `/products/?page=${page}/limit=${limit}`,
    GET: "/products/",
    PRODUCT: "/products/",
  },
  ORDERS: {
    GET_ALL: (page: number, limit: number) => `/orders/?page=${page}/limit=${limit}`,
  },
};
