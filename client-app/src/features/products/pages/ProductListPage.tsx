import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";

export default function ProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const { data, isLoading, error } = useProducts(query);

    const [searchTerm, setSearchTerm] = useState(query);

    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ q: searchTerm, page: "1" });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-green-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-10">
                <p className="text-center text-red-500">Error loading product: {error.message}</p>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <header className="flex flex-col gap-2 mb-8">
                <p className="text-sm font-semibold text-green-600">Danh mục sản phẩm</p>
                <h1 className="text-3xl font-bold text-gray-900">Eco-Friendly Products</h1>
                <p className="text-gray-600">
                    Lọc sản phẩm theo từ khóa để nhanh chóng tìm các lựa chọn sống xanh phù hợp.
                </p>
            </header>

            <form onSubmit={handleSearch} className="mb-10">
                <div className="relative max-w-3xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 transition"
                    />

                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-green-600"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
                ) : (
                    data.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))
                )}
            </div>
        </section>
    );
}
