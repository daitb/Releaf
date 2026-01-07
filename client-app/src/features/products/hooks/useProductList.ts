import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import type { Product } from "../types/product";

/**
 * Pagination info từ API
 */
interface PaginationInfo {
    page: number;
    pageSize: number;
    totalCount: number;
}

/**
 * Custom hook để fetch danh sách products từ API
 * 
 * Hook này xử lý việc fetch data, loading state, error state và pagination info.
 * Tự động refetch khi query hoặc page thay đổi.
 * 
 * @param query - Search query string
 * @param page - Current page number (1-indexed)
 * @returns Object chứa products, loading state, error, và pagination info
 * 
 * @example
 * ```tsx
 * const { products, isLoading, error, pagination } = useProductList(searchQuery, currentPage);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage>{error}</ErrorMessage>;
 * return <ProductGrid products={products} />;
 * ```
 */
export function useProductList(query: string, page: number) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page,
        pageSize: 12,
        totalCount: 0
    });

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await fetchProducts({
                    q: query || undefined,
                    page,
                    pageSize: 12
                });

                // Chỉ update state nếu component vẫn còn mounted
                if (!isMounted) return;

                setProducts(result.items ?? []);
                setPagination({
                    page: result.page ?? page,
                    pageSize: result.pageSize ?? 12,
                    totalCount: result.totalCount ?? (result.items?.length ?? 0)
                });
            } catch (err) {
                console.error("Failed to fetch products:", err);
                if (isMounted) {
                    setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProducts();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [query, page]);

    return {
        products,
        isLoading,
        error,
        pagination
    };
}
