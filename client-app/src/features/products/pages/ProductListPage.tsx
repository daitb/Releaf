import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@features/products/components/ProductCard';
import ProductFilters, { type FilterOptions } from '@features/products/components/ProductFilters';
import { fetchProducts } from '@features/products/services/productService';
import type { Product } from '@entities/product/model';
import LoadingSpinner from '@shared/components/LoadingSpinner';
import Pagination from '@shared/components/Pagination';
import SearchBar from '@shared/components/SearchBar';
import { Grid3x3, List, ArrowUp, Sparkles } from 'lucide-react';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 12;
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'name';

  useEffect(() => {
    loadProducts();
  }, [page, pageSize, searchQuery, sortBy, filters]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchProducts({
        page,
        pageSize,
        q: searchQuery,
        sort: sortBy
      });

      // Filter products based on selected filters
      let filteredProducts = result.items;

      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          filters.categories!.includes(p.categoryName)
        );
      }

      if (filters.materials && filters.materials.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          filters.materials!.some(mat => p.materials.includes(mat))
        );
      }

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(p =>
          p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
        );
      }

      if (filters.status) {
        filteredProducts = filteredProducts.filter(p =>
          p.productStatus === filters.status
        );
      }

      setProducts(filteredProducts);
      setTotalCount(filteredProducts.length);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchParams({ q: query, page: '1', pageSize: String(pageSize), sort: sortBy });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: searchQuery, page: String(newPage), pageSize: String(pageSize), sort: sortBy });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({ q: searchQuery, page: '1', pageSize: String(pageSize), sort: newSort });
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchParams({ q: searchQuery, page: '1', pageSize: String(pageSize), sort: sortBy });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      {/* Hero Section with Animated Gradient */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent)]" />
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="text-green-100 font-medium">Eco-Friendly Products</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up leading-tight">
              Sản phẩm thân thiện<br />môi trường
            </h1>
            <p className="text-green-50 text-lg md:text-xl leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Khám phá bộ sưu tập sản phẩm xanh, bền vững cho cuộc sống của bạn
            </p>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" fillOpacity="0.3" />
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#f9fafb" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#f9fafb" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f9fafb" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-2/3">
              <SearchBar
                onSearch={handleSearch}
                initialValue={searchQuery}
                placeholder="Tìm kiếm sản phẩm xanh..."
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Lọc
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-white shadow-md text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list'
                      ? 'bg-white shadow-md text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium text-gray-700 bg-white hover:border-gray-300"
              >
                <option value="name">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="price">Giá thấp → cao</option>
                <option value="price_desc">Giá cao → thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && (
            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                <span>
                  Tìm thấy <span className="font-bold text-green-600 text-lg">{totalCount}</span> sản phẩm
                </span>
              </div>
              {searchQuery && (
                <span className="hidden sm:inline">
                  cho từ khóa "<span className="font-semibold text-gray-900">{searchQuery}</span>"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-4">
              <ProductFilters
                onFilterChange={handleFilterChange}
                isOpen={isFilterOpen}
              />
            </div>
          </aside>

          {/* Products Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="lg" text="Đang tải sản phẩm..." />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-6 py-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc để khám phá thêm sản phẩm xanh
                  </p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }>
                  {products.map((product, index) => (
                    <div
                      key={product.productId}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
}
