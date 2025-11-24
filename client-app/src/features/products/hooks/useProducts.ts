import { useEffect } from "react";
import type { Product } from "@entities/product/model";
import { fetchProducts as fetchProductsRequest } from "../services/productService";
import { useAsync } from "@shared/hooks/useAsync";

export const useProducts = (query?: string) => {
    const { data = [], isLoading, error, execute } = useAsync<Product[]>();

    useEffect(() => {
        void execute(() => fetchProductsRequest({ q: query }));
    }, [query, execute]);

    return { data, isLoading, error };
};