import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Leaf, Loader2, Search } from "lucide-react";
import type { FilterOptions } from "../components/ProductFilters";
import ProductFilters from "../components/ProductFilters";
import ProductListHero from "../components/ProductListHero";
import ProductListToolbar from "../components/ProductListToolbar";
import ProductGrid from "../components/ProductGrid";
import ProductPagination from "../components/ProductPagination";
import { useProductList } from "../hooks/useProductList";
import { useProductFilters, type SortOption } from "../hooks/useProductFilters";

export default function ProductListPage() {
    // URL params
    const [searchParams, setSearchParams] = useSearchParams();
    const appliedQuery = (searchParams.get("q") ?? "").trim();
    const currentPage = Number(searchParams.get("page") ?? "1");

    // Local states (giảm từ 10 xuống 5 states)
    const [searchTerm, setSearchTerm] = useState(appliedQuery);
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filtersVersion, setFiltersVersion] = useState(0);

    // Custom hooks - data fetching
    const { products, isLoading, error, pagination } = useProductList(appliedQuery, currentPage);

    // Custom hooks - filtering & sorting
    const { filteredProducts, resultCount } = useProductFilters(
        products,
        activeFilters,
        sortOption
    );

    // Sync search term với URL
    useEffect(() => {
        setSearchTerm(appliedQuery);
    }, [appliedQuery]);

    const totalPages = Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize));

    // Event handlers
    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const params: Record<string, string> = { page: "1" };
        if (searchTerm.trim()) {
            params.q = searchTerm.trim();
        }
        setSearchParams(params);
    };

    const handlePageChange = (page: number) => {
        const params: Record<string, string> = { page: page.toString() };
        if (appliedQuery) {
            params.q = appliedQuery;
        }
        setSearchParams(params);
    };

    const handleQuickSearch = (value: string) => {
        setSearchTerm(value);
        const params: Record<string, string> = { page: "1", q: value };
        setSearchParams(params);
    };

    const handleFilterChange = (filters: FilterOptions) => {
        setActiveFilters(filters);
    };

    const resetAllFilters = () => {
        setActiveFilters({});
        setFiltersVersion((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50/20">
            <ProductListHero
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearchSubmit={handleSearchSubmit}
                onQuickSearch={handleQuickSearch}
            />
            <section className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
                <div className="grid lg:grid-cols-[280px,1fr] gap-8">
                    <aside className="hidden lg:block sticky top-16 h-fit">
                        <ProductFilters key={`desktop-${filtersVersion}`} onFilterChange={handleFilterChange} />
                    </aside>

                    <div className="space-y-8">
                        <ProductListToolbar
                            resultCount={resultCount}
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                            activeFilters={activeFilters}
                            onShowMobileFilters={() => setShowMobileFilters(true)}
                        />

                        {error ? (
                            <div className="bg-white border border-red-100 rounded-3xl p-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl font-bold">
                                    !
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900">Không thể tải sản phẩm</h3>
                                <p className="text-gray-600 max-w-md mx-auto">{error}</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        type="button"
                                        className="px-6 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                        onClick={() => {
                                            setSearchParams({});
                                            window.location.reload();
                                        }}
                                    >
                                        Tải lại trang
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
                                        onClick={() => window.location.reload()}
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        ) : isLoading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="w-12 h-12 animate-spin text-green-500" />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto">
                                    <Search className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900">Không tìm thấy sản phẩm phù hợp</h3>
                                <p className="text-gray-600">
                                    Thử điều chỉnh bộ lọc, tìm kiếm bằng từ khóa khác hoặc quay lại danh mục chính.
                                </p>
                                <button
                                    type="button"
                                    className="px-6 py-3 text-sm font-semibold text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-colors"
                                    onClick={() => {
                                        resetAllFilters();
                                        setSearchParams({});
                                    }}
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <ProductGrid
                                products={filteredProducts} />
                        )
                        }

                        <ProductPagination
                            currentPage={pagination.page}
                            totalPages={totalPages}
                            totalCount={pagination.totalCount}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 pb-16 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-green-600">Bộ sưu tập chuyên đề</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">Nhìn rộng hơn về phong cách sống xanh</h2>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:border-green-200 hover:text-green-600 transition-colors"
                    >
                        Xem thêm
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        {
                            title: "Không gian bếp xanh",
                            description: "Dụng cụ nấu nướng tái chế và tối ưu năng lượng.",
                            metric: "12 sản phẩm nổi bật"
                        },
                        {
                            title: "Chăm sóc cá nhân hữu cơ",
                            description: "Mỹ phẩm, chăm sóc cá nhân không hóa chất độc hại.",
                            metric: "9 sản phẩm đề cử"
                        },
                        {
                            title: "Văn phòng tối giản",
                            description: "Vật dụng bàn làm việc giảm nhựa, tăng trải nghiệm.",
                            metric: "7 combo gợi ý"
                        }
                    ].map((collection) => (
                        <div
                            key={collection.title}
                            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3 hover:border-green-200 hover:shadow-xl transition-all"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                                <Leaf className="w-4 h-4" />
                                Tuyển chọn
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{collection.title}</h3>
                            <p className="text-gray-600">{collection.description}</p>
                            <p className="text-sm font-semibold text-green-600">{collection.metric}</p>
                        </div>
                    ))}
                </div>
            </section>

            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
                            <button
                                type="button"
                                className="text-sm font-semibold text-green-600"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                Đóng
                            </button>
                        </div>
                        <ProductFilters
                            key={`mobile-${filtersVersion}`}
                            onFilterChange={handleFilterChange}
                            isOpen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
