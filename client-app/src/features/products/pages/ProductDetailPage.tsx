import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '@features/products/services/productService';
import type { Product } from '../types/product';
import LoadingSpinner from '@shared/components/LoadingSpinner';
import ProductCard from '@features/products/components/ProductCard';
import fallbackImage from '@assets/forest.jpg';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <LoadingSpinner size="lg" text="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <svg
              className="w-20 h-20 mx-auto text-gray-300 mb-4"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {error || 'Sản phẩm không tồn tại'}
            </h2>
            <p className="text-gray-600 mb-6">
              Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không còn khả dụng.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-green-600 transition">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{product.productName}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Detail Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === img
                          ? 'border-green-600'
                          : 'border-gray-200 hover:border-green-400'
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
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                {product.categoryName}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating!)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating.toFixed(1)} ({product.reviewCount || 0} đánh giá)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b py-4">
                <p className="text-4xl font-bold text-green-600">{formatPrice(product.price)}</p>
                {product.productStatus === 'Available' ? (
                  <p className="text-green-600 font-medium mt-2">✓ Còn hàng</p>
                ) : (
                  <p className="text-red-600 font-medium mt-2">✗ Hết hàng</p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm:</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Materials */}
              {product.materials && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Chất liệu:</h3>
                  <p className="text-gray-700">{product.materials}</p>
                </div>
              )}

              {/* Supplier */}
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Nhà cung cấp:</span> {product.supplierName}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.productStatus !== 'Available'}
                  className="flex-1 px-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  Thêm vào giỏ hàng
                </button>
                <button className="px-6 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition">
                  ♥
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
              <Link
                to="/products"
                className="text-green-600 hover:text-green-700 font-medium transition"
              >
                Xem tất cả →
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
    </div>
  );
}
