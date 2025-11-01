import { Leaf, Loader2, Recycle, ShoppingBag, Truck } from 'lucide-react'
import banner from '../assets/forest.jpg'
import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import type { Product } from '../types/Product';

export default function HomePage() {

    const featureList = [
        {
            id: 1,
            icon: <Leaf className="w-8 h-8 text-green-600 mx-auto" />,
            title: "Tự nhiên 100%. ",
            desc: "Chất liệu thân thiện với môi trường."
        },

        {
            id: 2,
            icon: <Truck className="w-8 h-8 text-green-600 mx-auto" />,
            title: "Giao hàng nhanh. ",
            desc: "Đảm bảo giao hàng đúng hẹn."
        },

        {
            id: 3,
            icon: <Recycle className="w-8 h-8 text-green-600 mx-auto" />,
            title: "Tái chế & bền vững. ",
            desc: "Hạn chế rác thải nhựa. "
        },

        {
            id: 4,
            icon: <ShoppingBag className="w-8 h-8 text-green-600 mx-auto" />,
            title: "Mua sắm tiện lợi. ",
            desc: "Trải nghiệm mua sắm dễ dàng."
        }
    ]

    const [productList, setProductList] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBestSellingProduct = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get("/Products/bestselling?count=4");

                if (response.data && response.data.data) {
                    setProductList(response.data.data);
                }
            }
            catch (err: any) {
                if (err.response) {
                    setError(err.response.data.message || "Đã có lỗi xảy ra khi tải sản phẩm.");
                } else {
                    setError("Đã xảy ra lỗi. Vui lòng thử lại.");
                }
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchBestSellingProduct();
    }, []);

    const renderProductShowcase = () => {
        if (isLoading) {
            return (
                <div className='flex justify-center'>
                    <Loader2 className='w-12 h-12 animate-sprin text-green-500' />
                </div>
            )
        }

        if (error) {
            return <p className='text-center text-red-500'>Lỗi: {error}</p>
        }

        if (productList.length === 0) {
            return <p className='text-center text-gray-600'>Không tìm thấy sản phẩm</p>
        }

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                {
                    productList.map((product) => (
                        <div
                            key={product.productId}
                            className='bg-white rounded-xl shadow hover:shadow-md hover:scale-105 transition duration-500'
                        >
                            <img src={product.imageUrl} alt={product.productName} />

                            <div className='p-4'>
                                <h3 className='font-semibold text-gray-800'>{product.productName}</h3>
                                <p className='text-green-600 font-medium mt-1'>{product.price} VND</p>
                                <button className='mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm'>
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center text-center">
                <img
                    src={banner}
                    alt="forest banner"
                    className="absolute inset-0 h-full w-full object-cover" />

                <div className='absolute inset-0 bg-green-50/70'></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Sống xanh cùng <span className="text-green-600">Releaf</span>
                        </h1>

                        <p className="text-gray-700 text-lg">
                            Khám phá các sản phẩm thân thiện với môi trường, từ vật dụng tái chế đến đồ dùng thiên nhiên.
                        </p>

                        <div className="space-x-4">
                            <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
                                Mua ngay
                            </button>

                            <button className="px-6 py-3 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className='py-14 border-b border-gray-100'>
                <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center'>
                    {featureList.map((feature) => (
                        <div key={feature.id}>
                            {feature.icon}
                            <h3 className='mt-3 font-semibold'>{feature.title}</h3>
                            <p className='mt-1 text-gray-600 text-sm'>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Showcase */}
            <section id='products' className='py-16 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-10'>Sản phẩm nổi bật</h2>
                    {renderProductShowcase()}
                </div>
            </section>

            {/* About Section */}

        </div>

    )
}