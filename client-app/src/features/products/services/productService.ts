import { apiClient } from "@shared/api/apiClient";
import type { Product } from "@entities/product/model";

interface ProductQueryParams {
    q?: string;
}

export async function fetchProducts(params: ProductQueryParams = {}): Promise<Product[]> {
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

