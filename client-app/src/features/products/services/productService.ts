import { apiClient } from "@shared/api/apiClient";
import type { Product } from "../types/product";

interface ProductQueryParams {
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export async function fetchProducts(params: ProductQueryParams = {}): Promise<PaginatedResult<Product>> {
    const response = await apiClient.get("/Products", {
        params
    });

    return response.data.data;
}

export async function fetchBestSellingProducts(count: number = 4): Promise<Product[]> {
    const response = await apiClient.get("/Products/bestselling", {
        params: { count }
    });

    return response.data.data;
}

export async function fetchProductById(productId: number): Promise<Product> {
    const response = await apiClient.get(`/Products/${productId}`);
    return response.data.data;
}

