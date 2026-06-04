import type { User } from "../../user/types/user.types";


export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
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

export interface AuthResponse {
    data: {
        user: User;
    }
    message: string;
    isSuccess: number;
};
