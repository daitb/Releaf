import { Link } from "react-router-dom";
import { ChevronRight, Leaf } from "lucide-react";
import type { Product } from "../types/product";
import fallbackImage from "@assets/forest.jpg";

interface ProductListViewProps {
    products: Product[];
}

const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function ProductListView({ products }: ProductListViewProps) {
    return (
        <div className="space-y-5">
            {products.map((product) => (
                <Link
                    key={product.productId}
                    to={`/products/${product.productId}`}
                    className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-2xl transition-all duration-300 group"
                >
                    <div className="md:w-60 w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                        <img
                            src={product.imageUrl || fallbackImage}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(event) => {
                                event.currentTarget.src = fallbackImage;
                            }}
                        />
                        {product.productStatus !== "Available" && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                Tạm hết
                            </span>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
                                <Leaf className="w-4 h-4" />
                                {product.categoryName}
                            </span>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                                {product.productName}
                            </h3>
                            <p className="text-gray-600 line-clamp-2">{product.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {product.materials && (
                                <span>Chất liệu: <strong className="text-gray-800 font-medium">{product.materials}</strong></span>
                            )}
                            {product.supplierName && (
                                <span>Nhà cung cấp: <strong className="text-gray-800 font-medium">{product.supplierName}</strong></span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm font-semibold">
                                {product.rating && (
                                    <span className="flex items-center gap-2 text-amber-500">
                                        ★ {product.rating.toFixed(1)}
                                        <span className="text-gray-400 font-normal">
                                            ({product.reviewCount ?? 0})
                                        </span>
                                    </span>
                                )}
                                <span className="flex items-center gap-2 text-green-600">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    {product.productStatus === "Available" ? "Còn hàng" : "Liên hệ"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                                Khám phá chi tiết
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
