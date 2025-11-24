import axios, { type AxiosError } from "axios";

/**
 * Interface cho error response từ API
 */
export interface ApiErrorResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

/**
 * Extract error message từ error object
 * Hỗ trợ nhiều loại error: AxiosError, Error, string, unknown
 */
export function getErrorMessage(error: unknown): string {
    // Nếu là string, trả về trực tiếp
    if (typeof error === "string") {
        return error;
    }

    // Nếu là AxiosError
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        
        // Ưu tiên message từ response.data.message
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }

        // Fallback về message từ response.data (nếu không có structure chuẩn)
        if (axiosError.response?.data && typeof axiosError.response.data === "string") {
            return axiosError.response.data;
        }

        // Fallback về status text
        if (axiosError.response?.statusText) {
            return axiosError.response.statusText;
        }

        // Fallback về error message
        if (axiosError.message) {
            return axiosError.message;
        }
    }

    // Nếu là Error object
    if (error instanceof Error) {
        return error.message;
    }

    // Default message
    return "Đã xảy ra lỗi. Vui lòng thử lại.";
}

/**
 * Kiểm tra xem error có phải là network error không
 */
export function isNetworkError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
        return !error.response; // Không có response = network error
    }
    return false;
}

/**
 * Kiểm tra xem error có phải là server error (5xx) không
 */
export function isServerError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        return status !== undefined && status >= 500 && status < 600;
    }
    return false;
}

/**
 * Kiểm tra xem error có phải là client error (4xx) không
 */
export function isClientError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        return status !== undefined && status >= 400 && status < 500;
    }
    return false;
}

/**
 * Lấy HTTP status code từ error
 */
export function getErrorStatus(error: unknown): number | null {
    if (axios.isAxiosError(error)) {
        return error.response?.status ?? null;
    }
    return null;
}

