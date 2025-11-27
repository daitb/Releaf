import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import type { Product } from '@entities/product/model';
import { Link } from 'react-router-dom';

interface ProductsSectionProps {
    productList: Product[];
    isLoading: boolean;
    error: string | null;
}

export default function ProductsSection({ productList, isLoading, error }: ProductsSectionProps) {
    const renderProductShowcase = () => {
        if (isLoading) {
            return (
                <div className='flex justify-center'>
                    <Loader2 className='w-12 h-12 animate-spin text-green-500' />
                </div>
            );
        }

        if (error) {
            return <p className='text-center text-red-500'>Lỗi: {error}</p>;
        }

        if (productList.length === 0) {
            return <p className='text-center text-gray-600'>Không tìm thấy sản phẩm</p>;
        }

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {productList.map((product) => (
                    <article
                        key={product.productId}
                        className='group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300'
                    >
                        <div className='overflow-hidden'>
                            <img
                                src={product.imageUrl}
                                alt={product.productName}
                                className='w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500'
                            />
                        </div>
                        <div className='p-5 space-y-3'>
                            <div className='flex items-center gap-2 text-sm text-emerald-600 font-medium'>
                                <ShieldCheck className='w-4 h-4' />
                                Top lựa chọn
                            </div>
                            <h3 className='font-semibold text-gray-900 line-clamp-2'>{product.productName}</h3>
                            <p className='text-green-600 font-semibold text-lg'>{product.price} VND</p>
                            <button className='w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition'>
                                Thêm vào giỏ
                                <ArrowRight className='w-4 h-4' />
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        );
    };

    return (
        <section id='products' className='py-20 bg-white'>
            <div className='max-w-7xl mx-auto px-6 space-y-10'>
                <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
                    <div>
                        <p className='text-green-600 font-semibold'>Best seller tuần này</p>
                        <h2 className='text-3xl font-bold mt-2'>Top sản phẩm được yêu thích</h2>
                        <p className='text-gray-600 mt-3'>
                            Dữ liệu cập nhật theo thời gian thực từ hành trình mua sắm của cộng đồng Releaf.
                        </p>
                    </div>
                    <Link to="/products" className='inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition'>
                        Xem tất cả sản phẩm
                        <ArrowRight className='w-4 h-4' />
                    </Link>
                </div>
                {renderProductShowcase()}
            </div>
        </section>
    );
}

