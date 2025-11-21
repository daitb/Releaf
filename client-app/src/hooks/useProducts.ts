import { api } from "../api/apiClient"
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";

export const useProducts = (query?: string) => {
    const [data, setData] = useState<Product[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get("/Products", {
                    params: {q: query}
                });

                setData(response.data.data);
            }
            catch(err){
                setError(err as Error);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, [query]);

    return { data, isLoading, error };
};