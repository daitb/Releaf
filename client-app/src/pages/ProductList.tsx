import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";

export default function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const { isLoading, error } = useProducts(query);

    const [searchTerm, setSearchTerm] = useState(query);

    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ q: searchTerm, page: "1" });
    }

    if (isLoading) {
        return (
            <div className="flex justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-10">
                <p className="text-center text-red-500">Error loading product: {error.message}</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Eco-Friendly Products</h1>

            {/* Search bar */}
            <form action="" onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                    <input type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Products..."
                        className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 transition" />

                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-green-600">
                        <Search className="w-5 h-5 text white" />
                    </button>
                </div>
            </form>

            {/* Grid products */}

        </div>
    )
}