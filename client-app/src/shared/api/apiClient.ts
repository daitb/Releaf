import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "../utils/errorUtils";

/**
 * API Client instance với Axios
 * 
 * Client này đã được configure với:
 * - Base URL từ environment variable (VITE_API_URL)
 * - Auto-attach JWT token vào mọi request
 * - Auto-handle 401 errors (logout + redirect)
 * - Centralized error logging
 * 
 * @example
 * ```typescript
 * // Sử dụng trong service
 * import { apiClient } from '@shared/api/apiClient';
 * 
 * export async function fetchProducts() {
 *   const response = await apiClient.get('/products');
 *   return response.data;
 * }
 * ```
 */
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * REQUEST INTERCEPTOR
 * 
 * Tự động thêm JWT token vào header của mọi request nếu user đã login.
 * Token được lấy từ localStorage và thêm vào Authorization header.
 * 
 * Flow:
 * 1. Lấy accessToken từ localStorage
 * 2. Nếu có token, thêm vào header: "Authorization: Bearer <token>"
 * 3. Request được gửi đi với token
 */
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

/**
 * RESPONSE INTERCEPTOR
 * 
 * Xử lý errors và auto-redirect khi cần thiết.
 * 
 * Xử lý các cases:
 * - 401 Unauthorized: Token hết hạn → Xóa tokens + redirect về /login
 * - 403 Forbidden: Không có quyền truy cập → Log warning
 * - 500+ Server errors: Lỗi server → Log error details
 * - Network errors: Không kết nối được server → Log error
 */
apiClient.interceptors.response.use(
    (res) => res,
    (err: AxiosError<ApiErrorResponse>) => {
        const status = err.response?.status;

        /**
         * 401 Unauthorized - Token không hợp lệ hoặc hết hạn
         * 
         * Actions:
         * 1. Xóa tokens khỏi localStorage
         * 2. Redirect về /login (trừ khi đang ở trang login/register)
         * 3. User sẽ phải đăng nhập lại
         */
        if (status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Chỉ redirect nếu không đang ở trang login/register
            // (Tránh infinite redirect loop)
            if (!window.location.pathname.includes("/login") &&
                !window.location.pathname.includes("/register")) {
                window.location.href = "/login";
            }
        }

        /**
         * 403 Forbidden - User không có quyền truy cập resource này
         * Log warning để dev biết, nhưng không redirect
         */
        if (status === 403) {
            console.warn("Forbidden! You don't have permission to access this resource.");
        }

        /**
         * 500+ Server errors - Lỗi từ phía server
         * Log chi tiết để dễ debug
         */
        if (status && status >= 500) {
            console.error("Server error:", {
                status,
                message: err.response?.data?.message || err.message,
                url: err.config?.url
            });
        }

        /**
         * Network errors - Không kết nối được tới server
         * (err.response sẽ undefined nếu là network error)
         */
        if (!err.response) {
            console.error("Network error:", err.message);
        }

        // Reject promise để component có thể catch và xử lý
        return Promise.reject(err);
    }
);
