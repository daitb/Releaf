import { useEffect, useState } from "react";
import type { Product } from "@entities/product/model";
import { fetchProducts as fetchProductsRequest } from "../services/productService";

export const useProducts = (query?: string) => {
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const products = await fetchProductsRequest({ q: query });
                setData(products);
            } catch(err){
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, [query]);

    return { data, isLoading, error };
};