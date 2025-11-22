import type { AuthTokens } from "../services/authService";

export interface AuthUser {
    fullName: string;
    email: string;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    isBootstrapping: boolean;
    isLoadingUser: boolean;
    user: AuthUser | null;
    login: (tokens: AuthTokens) => void;
    logout: () => void;
}