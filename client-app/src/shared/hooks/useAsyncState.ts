import { useState, useCallback, useRef, useEffect } from "react";
import { getErrorMessage } from "../utils/errorUtils";

/**
 * Options cho callback khi execute async function
 */
interface ExecuteOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
}

/**
 * Return type của useAsyncState hook
 */
interface UseAsyncStateReturn<T> {
    /** Dữ liệu trả về từ async function (null nếu chưa có hoặc bị lỗi) */
    data: T | null;
    /** Trạng thái loading */
    isLoading: boolean;
    /** Error message (null nếu không có lỗi) */
    error: string | null;
    /** Function để thực thi async operation */
    execute: <R = T>(
        asyncFn: () => Promise<R>,
        options?: ExecuteOptions<R>
    ) => Promise<R | null>;
    /** Reset về trạng thái ban đầu */
    reset: () => void;
    /** Clear error message */
    clearError: () => void;
}

/**
 * Custom hook để quản lý async operations với loading, error, và data states
 * 
 * Hook này thay thế cho useAsync và useAsyncError, cung cấp API đơn giản và dễ sử dụng
 * cho cả việc fetch data và execute async operations với callbacks.
 * 
 * @template T - Kiểu dữ liệu trả về mặc định
 * 
 * @example
 * // Use case 1: Fetch data (như HomePage)
 * const { data, isLoading, error, execute } = useAsyncState<Product[]>();
 * 
 * useEffect(() => {
 *   execute(() => fetchBestSellingProducts(4));
 * }, []);
 * 
 * @example
 * // Use case 2: Form submission với callbacks (như LoginPage)
 * const { isLoading, execute } = useAsyncState();
 * 
 * const handleSubmit = async () => {
 *   await execute(
 *     () => loginAPI({ email, password }),
 *     {
 *       onSuccess: (tokens) => {
 *         login(tokens);
 *         toast.success("Đăng nhập thành công!");
 *       },
 *       onError: (errorMessage) => {
 *         toast.error(errorMessage);
 *       }
 *     }
 *   );
 * };
 */
export function useAsyncState<T = unknown>(): UseAsyncStateReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Sử dụng ref để tránh stale closure issues
    const isMountedRef = useRef(true);

    useEffect(() => {
        // Reset về true khi component mount (fix cho React StrictMode)
        isMountedRef.current = true;
        
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const execute = useCallback(
        async <R = T>(
            asyncFn: () => Promise<R>,
            options?: ExecuteOptions<R>
        ): Promise<R | null> => {
            // Clear error trước khi execute
            setError(null);
            setIsLoading(true);

            try {
                const result = await asyncFn();

                // Chỉ update state nếu component còn mounted
                if (isMountedRef.current) {
                    setData(result as unknown as T);
                    options?.onSuccess?.(result);
                }

                return result;
            } catch (err) {
                const message = getErrorMessage(err);

                // Chỉ update state nếu component còn mounted
                if (isMountedRef.current) {
                    setError(message);
                    options?.onError?.(message);
                }

                return null;
            } finally {
                // Chỉ update state nếu component còn mounted
                if (isMountedRef.current) {
                    setIsLoading(false);
                }
            }
        },
        []
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        data,
        isLoading,
        error,
        execute,
        reset,
        clearError
    };
}
