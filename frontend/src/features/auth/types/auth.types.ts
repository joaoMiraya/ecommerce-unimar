import type { BasicUser } from "../../user/types/user.types";


export interface AuthState {
    user: BasicUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
};

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export interface LoginRequest {
    email: string;
    password: string;
};

export interface AuthResponse<T> {
  status: number;
  data: {
    user: T;
    accessToken: string;
  }
};
