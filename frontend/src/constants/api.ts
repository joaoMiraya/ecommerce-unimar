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
    PRODUCT: "/products/",
    OWN: "/products/own",
  },
  ORDERS: {
    CREATE: "/orders",
    CANCEL: "/orders/cancel",
    GET: "/orders",
  },
};

export type Pagination = {
  page: number;
  limit: number;
};
