import { useState, useCallback, useRef, useEffect } from "react";
import { getErrorMessage } from "../utils/errorUtils";

interface UseAsyncOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    defaultErrorMessage?: string;
}

interface UseAsyncReturn<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    execute: (asyncFn: () => Promise<T>) => Promise<T | null>;
    reset: () => void;
}

/**
 * Custom hook để quản lý async operations với loading, error, và data states
 * 
 * @example
 * const { data, isLoading, error, execute } = useAsync<Product[]>();
 * 
 * useEffect(() => {
 *   execute(() => fetchProducts());
 * }, []);
 */
export function useAsync<T = unknown>(options?: UseAsyncOptions<T>): UseAsyncReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const execute = useCallback(
        async (asyncFn: () => Promise<T>): Promise<T | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await asyncFn();
                setData(result);
                optionsRef.current?.onSuccess?.(result);
                return result;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                optionsRef.current?.onError?.(message);
                return null;
            } finally {
                setIsLoading(false);
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
        reset
    };
}

