import { apiClient } from "@shared/api/apiClient";
import type { AuthUser } from "../types/AuthContextType";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

const AUTH_BASE_PATH = "/Auth";

export async function fetchCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get(`${AUTH_BASE_PATH}/me`);
    return response.data.data;
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
    const response = await apiClient.post(`${AUTH_BASE_PATH}/login`, payload);
    return response.data.data;
}

export async function register(payload: RegisterPayload): Promise<void> {
    await apiClient.post(`${AUTH_BASE_PATH}/register`, payload);
}

