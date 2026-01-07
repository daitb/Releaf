import axios, { type AxiosError } from "axios";

/**
 * Interface cho error response từ API
 * 
 * @example
 * ```typescript
 * interface ApiErrorResponse {
 *   success: false,
 *   message: "Email already exists",
 *   data: null
 * }
 * ```
 */
export interface ApiErrorResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

/**
 * Trích xuất error message từ nhiều loại error khác nhau
 * 
 * Hỗ trợ:
 * - String: Trả về trực tiếp
 * - AxiosError: Trích xuất từ response.data.message hoặc statusText
 * - Error object: Lấy error.message
 * - Unknown: Trả về default message
 * 
 * @param error - Error object cần xử lý (có thể là bất kỳ kiểu gì)
 * @returns Error message dạng string để hiển thị cho user
 * 
 * @example
 * ```typescript
 * try {
 *   await apiClient.post('/login', data);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message); // "Email hoặc mật khẩu không đúng"
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
    // Nếu là string, trả về trực tiếp
    if (typeof error === "string") {
        return error;
    }

    // Nếu là AxiosError (lỗi từ API)
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

    // Nếu là Error object thông thường
    if (error instanceof Error) {
        return error.message;
    }

    // Default message khi không xác định được error type
    return "Đã xảy ra lỗi. Vui lòng thử lại.";
}
