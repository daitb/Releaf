import type { Product } from "@entities/product/model";
import { Link } from "react-router-dom";
import { useState } from "react";
import fallbackImage from "@assets/forest.jpg";
import { Heart, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    const isNew = product.publishAt ?
        new Date().getTime() - new Date(product.publishAt).getTime() < 7 * 24 * 60 * 60 * 1000
        : false;

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200">
            {/* Image Container */}
            <Link to={`/products/${product.productId}`} className="block relative overflow-hidden aspect-[4/3] bg-gray-100">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {isNew && (
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            MỚI
                        </span>
                    )}
                    {product.productStatus !== 'Available' && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                            HẾT HÀNG
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    aria-label="Add to wishlist"
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ${isWishlisted
                            ? 'fill-red-500 text-red-500 scale-110'
                            : 'text-gray-600 hover:text-red-500'
                            }`}
                    />
                </button>

                {/* Image Count Badge */}
                {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{product.images.length}</span>
                    </div>
                )}

                {/* Product Image */}
                <div className="relative w-full h-full">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                    )}
                    <img
                        src={product.imageUrl || fallbackImage}
                        alt={product.productName}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                            setImageLoaded(true);
                        }}
                    />
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick View Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="px-6 py-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl flex items-center gap-2 font-semibold text-gray-800 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Eye className="w-5 h-5" />
                        <span>Xem chi tiết</span>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100">
                        {product.categoryName}
                    </span>
                    {product.rating && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-600">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Product Name */}
                <Link to={`/products/${product.productId}`} className="block">
                    <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] hover:text-green-600 transition-colors duration-300 text-base leading-tight">
                        {product.productName}
                    </h3>
                </Link>

                {/* Materials */}
                {product.materials && (
                    <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        {product.materials}
                    </p>
                )}

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                        <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        disabled={product.productStatus !== 'Available'}
                        className="group/btn p-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                    </button>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                    {product.productStatus === 'Available' ? (
                        <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-600">Còn hàng</span>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-red-600">Hết hàng</span>
                        </>
                    )}
                </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </div>
        </article>
    );
}
