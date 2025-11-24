import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, AuthUser } from "../types/AuthContextType";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, type AuthTokens } from "@features/auth/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setUser(null);
    }, []);

    const loadUserProfile = useCallback(async () => {
        setIsLoadingUser(true);
        try {
            const profile = await fetchCurrentUser();
            setUser(profile);
            setIsLoggedIn(true);
        } catch (error) {
            // 401 đã được xử lý bởi apiClient interceptor
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                logout();
            } else {
                console.error("Failed to load user info", error);
                setUser(null);
            }
        }
        finally {
            setIsLoadingUser(false);
        }
    }, [logout]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
            loadUserProfile().finally(() => setIsBootstrapping(false));
            return;
        }
        setIsBootstrapping(false);
    }, [loadUserProfile]);

    const login = useCallback((tokens: AuthTokens) => {
        localStorage.setItem("accessToken", tokens.accessToken);
        if (tokens.refreshToken) {
            localStorage.setItem("refreshToken", tokens.refreshToken);
        } else {
            localStorage.removeItem("refreshToken");
        }

        setIsLoggedIn(true);
        void loadUserProfile();
        navigate("/");
    }, [loadUserProfile, navigate]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isBootstrapping, isLoadingUser, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}