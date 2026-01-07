import { useMemo, useCallback } from "react";
import type { Product } from "../types/product";
import type { FilterOptions } from "../components/ProductFilters";

/**
 * Sort options cho products
 */
export type SortOption = "newest" | "price-asc" | "price-desc" | "rating-desc";

/**
 * Custom hook để xử lý filtering và sorting products
 * 
 * Hook này nhận vào list products và các filter options, trả về danh sách
 * products đã được filter và sort. Sử dụng useMemo để optimize performance.
 * 
 * @param products - Danh sách products gốc
 * @param activeFilters - Filter options đang active
 * @param sortOption - Sort option hiện tại
 * @returns Object chứa filtered/sorted products và reset function
 * 
 * @example
 * ```tsx
 * const { filteredProducts, resetFilters } = useProductFilters(
 *   products, 
 *   { categories: ["Furniture"], priceRange: { min: 0, max: 1000000 } },
 *   "price-asc"
 * );
 * ```
 */
export function useProductFilters(
    products: Product[],
    activeFilters: FilterOptions,
    sortOption: SortOption
) {
    // Filter products dựa trên activeFilters
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Filter by categories
            if (activeFilters.categories?.length && !activeFilters.categories.includes(product.categoryName)) {
                return false;
            }

            // Filter by materials
            if (activeFilters.materials?.length) {
                const materialText = (product.materials ?? "").toLowerCase();
                const materialMatch = activeFilters.materials.some((material) =>
                    materialText.includes(material.toLowerCase())
                );
                if (!materialMatch) return false;
            }

            // Filter by status
            if (activeFilters.status && product.productStatus !== activeFilters.status) {
                return false;
            }

            // Filter by price range
            const hasCustomPrice =
                activeFilters.priceRange &&
                (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000000);

            if (hasCustomPrice && activeFilters.priceRange) {
                if (
                    product.price < activeFilters.priceRange.min ||
                    product.price > activeFilters.priceRange.max
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [products, activeFilters]);

    // Sort filtered products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        sorted.sort((a, b) => {
            switch (sortOption) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "rating-desc":
                    return (b.rating ?? 0) - (a.rating ?? 0);
                case "newest":
                default:
                    return new Date(b.publishAt ?? "").getTime() - new Date(a.publishAt ?? "").getTime();
            }
        });

        return sorted;
    }, [filteredProducts, sortOption]);

    // Function để reset filters (không cần state trong hook này)
    const createResetHandler = useCallback(() => {
        return () => {
            // Logic reset sẽ được handle ở component level
            // Hook này chỉ return function signature
        };
    }, []);

    return {
        filteredProducts: sortedProducts,
        resultCount: sortedProducts.length,
        createResetHandler
    };
}
