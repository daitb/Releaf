import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "../utils/errorUtils";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor: Thêm token vào header
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Xử lý lỗi và redirect
apiClient.interceptors.response.use(
    (res) => res,
    (err: AxiosError<ApiErrorResponse>) => {
        const status = err.response?.status;

        // 401 Unauthorized: Xóa token và redirect về login
        if (status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            
            // Chỉ redirect nếu không đang ở trang login/register
            if (!window.location.pathname.includes("/login") && 
                !window.location.pathname.includes("/register")) {
                window.location.href = "/login";
            }
        }

        // 403 Forbidden: Log warning
        if (status === 403) {
            console.warn("Forbidden! You don't have permission to access this resource.");
        }

        // 500+ Server errors: Log error
        if (status && status >= 500) {
            console.error("Server error:", {
                status,
                message: err.response?.data?.message || err.message,
                url: err.config?.url
            });
        }

        // Network errors: Log warning
        if (!err.response) {
            console.error("Network error:", err.message);
        }

        return Promise.reject(err);
    }
);