import { ArrowUpDown, Filter, LayoutGrid, Rows } from "lucide-react";
import type { FilterOptions } from "./ProductFilters";

type SortOption = "newest" | "price-asc" | "price-desc" | "rating-desc";

const sortLabels: Record<SortOption, string> = {
    "newest": "Mới nhất",
    "price-asc": "Giá tăng dần",
    "price-desc": "Giá giảm dần",
    "rating-desc": "Đánh giá cao"
};

interface ProductListToolbarProps {
    resultCount: number;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    activeFilters: FilterOptions;
    onShowMobileFilters: () => void;
}

const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function ProductListToolbar({
    resultCount,
    sortOption,
    onSortChange,
    activeFilters,
    onShowMobileFilters
}: ProductListToolbarProps) {
    const hasActiveFilters =
        Boolean(activeFilters.categories?.length) ||
        Boolean(activeFilters.materials?.length) ||
        Boolean(activeFilters.status) ||
        Boolean(
            activeFilters.priceRange &&
            (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000000)
        );

    return (
        <div className="flex flex-col gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 justify-between">
                <div>
                    <p className="text-sm font-semibold text-green-600">Danh sách sản phẩm</p>
                    <h2 className="text-2xl font-bold text-gray-900">Khám phá {resultCount} lựa chọn</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold"
                        onClick={onShowMobileFilters}
                    >
                        <Filter className="w-4 h-4" />
                        Bộ lọc
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sắp xếp:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`px-4 py-2 text-sm rounded-full border transition-colors ${sortOption === option
                                ? "border-green-500 bg-green-50 text-green-600"
                                : "border-gray-200 text-gray-600 hover:border-green-200"
                                }`}
                            onClick={() => onSortChange(option)}
                        >
                            {sortLabels[option]}
                        </button>
                    ))}
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {activeFilters.categories?.map((category) => (
                        <span key={category} className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-green-50 text-green-700 border border-green-100">
                            {category}
                        </span>
                    ))}
                    {activeFilters.materials?.map((material) => (
                        <span key={material} className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {material}
                        </span>
                    ))}
                    {activeFilters.status && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                            {activeFilters.status === "Available" ? "Còn hàng" : "Hết hàng"}
                        </span>
                    )}
                    {activeFilters.priceRange && (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000000) && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                            {formatPrice(activeFilters.priceRange.min)} - {formatPrice(activeFilters.priceRange.max)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export type { SortOption };
