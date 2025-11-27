import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '@features/products/services/productService';
import type { Product } from '@entities/product/model';
import LoadingSpinner from '@shared/components/LoadingSpinner';
import ProductCard from '@features/products/components/ProductCard';
import fallbackImage from '@assets/forest.jpg';
import {
  ChevronRight,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  X,
  ZoomIn,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Leaf
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');

  useEffect(() => {
    if (id) {
      loadProductDetail(Number(id));
    }
  }, [id]);

  const loadProductDetail = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const productData = await fetchProductById(productId);
      setProduct(productData);
      setSelectedImage(productData.imageUrl || fallbackImage);

      // Load related products
      const relatedData = await fetchProducts({ pageSize: 4 });
      setRelatedProducts(relatedData.items.filter(p => p.productId !== productId).slice(0, 4));
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Không tìm thấy sản phẩm này.');
      } else {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.productName,
        text: product?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link sản phẩm!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 py-12">
        <LoadingSpinner size="lg" text="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {error || 'Sản phẩm không tồn tại'}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không còn khả dụng.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Quay về trang sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl || fallbackImage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors font-medium">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-green-600 transition-colors font-medium">Sản phẩm</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold line-clamp-1">{product.productName}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Detail Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 group cursor-zoom-in"
                onClick={() => setShowLightbox(true)}
              >
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-3 rounded-full">
                    <ZoomIn className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img
                          ? 'border-green-500 ring-4 ring-green-100 scale-105'
                          : 'border-gray-200 hover:border-green-300 hover:scale-105'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.productName} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Eco Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-sm font-bold border border-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  {product.categoryName}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold shadow-md">
                  <Leaf className="w-4 h-4" />
                  Thân thiện môi trường
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.productName}</h1>
                {product.rating && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">
                      {product.rating.toFixed(1)} ({product.reviewCount || 0} đánh giá)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <p className="text-sm text-gray-600 mb-1 font-medium">Giá sản phẩm</p>
                <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </p>
                {product.productStatus === 'Available' ? (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-green-600 font-semibold">Còn hàng</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <p className="text-red-600 font-semibold">Hết hàng</p>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Số lượng:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-8 py-3 border-x-2 border-gray-300 font-bold text-lg min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.productStatus !== 'Available'}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-green-500/50 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-5 py-4 border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-green-600' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="px-5 py-4 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Share product"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Miễn phí vận chuyển</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Bảo hành chính hãng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex gap-4 px-6 lg:px-10 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-semibold transition-all duration-300 relative ${activeTab === 'description'
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Mô tả sản phẩm
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-6 py-4 font-semibold transition-all duration-300 relative ${activeTab === 'specs'
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Thông số kỹ thuật
                {activeTab === 'specs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                )}
              </button>
            </div>

            <div className="p-6 lg:p-10">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Chất liệu
                    </h3>
                    <p className="text-gray-700 font-medium">{product.materials || 'Đang cập nhật'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Nhà cung cấp
                    </h3>
                    <p className="text-gray-700 font-medium">{product.supplierName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sản phẩm liên quan</h2>
              <Link
                to="/products"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors group"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.productId} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={selectedImage}
            alt={product.productName}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}


