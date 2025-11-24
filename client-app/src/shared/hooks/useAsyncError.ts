import { useState, useCallback } from "react";
import { getErrorMessage } from "../utils/errorUtils";

interface UseAsyncErrorOptions {
    onError?: (error: string) => void;
    defaultErrorMessage?: string;
}

interface UseAsyncErrorReturn {
    error: string | null;
    isLoading: boolean;
    setError: (error: string | null) => void;
    clearError: () => void;
    handleError: (error: unknown) => void;
    execute: <T>(
        asyncFn: () => Promise<T>,
        options?: { onSuccess?: (data: T) => void; onError?: (error: string) => void }
    ) => Promise<T | null>;
}

/**
 * Custom hook để xử lý lỗi trong async operations
 * 
 * @example
 * const { error, execute, clearError } = useAsyncError();
 * 
 * const handleSubmit = async () => {
 *   await execute(
 *     () => login({ email, password }),
 *     {
 *       onSuccess: (tokens) => {
 *         // Handle success
 *       }
 *     }
 *   );
 * };
 */
export function useAsyncError(options?: UseAsyncErrorOptions): UseAsyncErrorReturn {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const handleError = useCallback(
        (err: unknown) => {
            const message = getErrorMessage(err);
            setError(message);
            options?.onError?.(message);
        },
        [options]
    );

    const execute = useCallback(
        async <T,>(
            asyncFn: () => Promise<T>,
            execOptions?: { onSuccess?: (data: T) => void; onError?: (error: string) => void }
        ): Promise<T | null> => {
            clearError();
            setIsLoading(true);

            try {
                const result = await asyncFn();
                execOptions?.onSuccess?.(result);
                return result;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                execOptions?.onError?.(message);
                options?.onError?.(message);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [clearError, options]
    );

    return {
        error,
        isLoading,
        setError,
        clearError,
        handleError,
        execute
    };
}

