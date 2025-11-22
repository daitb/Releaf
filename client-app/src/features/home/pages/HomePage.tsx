import {
    ArrowRight,
    Droplets,
    Leaf,
    Loader2,
    Quote,
    Recycle,
    ShieldCheck,
    ShoppingBag,
    Sprout,
    Star,
    Sun,
    Truck
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import banner from '@assets/forest.jpg';
import about from '@assets/about.png';
import type { Product } from '@entities/product/model';
import { fetchBestSellingProducts } from '@features/products/services/productService';

export default function HomePage() {
    const highlights = useMemo(() => ([
        {
            id: 1,
            icon: <Leaf className="w-7 h-7 text-green-600" />,
            title: 'Tự nhiên 100%',
            desc: 'Ưu tiên chất liệu hữu cơ, bảo vệ sức khỏe gia đình bạn.'
        },
        {
            id: 2,
            icon: <Truck className="w-7 h-7 text-green-600" />,
            title: 'Giao hàng 24h',
            desc: 'Đội ngũ vận chuyển phủ sóng toàn quốc, đảm bảo đúng hẹn.'
        },
        {
            id: 3,
            icon: <Recycle className="w-7 h-7 text-green-600" />,
            title: 'Chu trình khép kín',
            desc: 'Tái chế & xử lý rác thải ngay tại chuỗi cửa hàng Releaf.'
        },
        {
            id: 4,
            icon: <ShoppingBag className="w-7 h-7 text-green-600" />,
            title: 'Mua sắm thông minh',
            desc: 'Gợi ý sản phẩm dựa trên thói quen & mức độ phát thải.'
        }
    ]), []);

    const stats = useMemo(() => ([
        { label: 'Năm đồng hành', value: '5+' },
        { label: 'Khách hàng xanh', value: '120K' },
        { label: 'Rác tái chế', value: '48 tấn' },
        { label: 'Điểm bán lẻ', value: '260+' }
    ]), []);

    const categoryHighlights = useMemo(() => ([
        {
            id: 'eco-home',
            title: 'Gia dụng tái chế',
            desc: 'Nhựa sinh học, vải tencel & dụng cụ nhà bếp thân thiện.',
            icon: <Sprout className="w-6 h-6 text-green-500" />,
            accent: 'from-lime-100 via-emerald-50 to-white'
        },
        {
            id: 'beauty',
            title: 'Chăm sóc cơ thể',
            desc: 'Tinh dầu hữu cơ, đồ skincare thuần chay & refill station.',
            icon: <Sun className="w-6 h-6 text-amber-500" />,
            accent: 'from-amber-50 via-orange-50 to-white'
        },
        {
            id: 'lifestyle',
            title: 'Lifestyle bền vững',
            desc: 'Túi canvas, bình giữ nhiệt, outfit organic cotton.',
            icon: <Droplets className="w-6 h-6 text-blue-500" />,
            accent: 'from-sky-50 via-cyan-50 to-white'
        }
    ]), []);

    const testimonials = useMemo(() => ([
        {
            id: 1,
            quote: '"Releaf giúp team mình chuyển đổi sang mô hình văn phòng xanh chỉ trong 2 tháng."',
            author: 'Lan Phương · HR Lead',
            impact: 'Tiết kiệm 1.2 tấn nhựa/năm'
        },
        {
            id: 2,
            quote: '"Sản phẩm refill rất tiện, chất lượng ổn định và được tư vấn tận tình."',
            author: 'Hoàng Minh · Chủ quán cafe',
            impact: 'Cắt giảm 80% bao bì nhựa'
        }
    ]), []);

    const [productList, setProductList] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBestSellingProduct = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const products = await fetchBestSellingProducts(4);
                setProductList(products);
            }
            catch (err: any) {
                const message = err.response?.data?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
                setError(message);
            }
            finally {
                setIsLoading(false);
            }
        };

        void fetchBestSellingProduct();
    }, []);

    const renderProductShowcase = () => {
        if (isLoading) {
            return (
                <div className='flex justify-center'>
                    <Loader2 className='w-12 h-12 animate-spin text-green-500' />
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
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {
                    productList.map((product) => (
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
                    ))
                }
            </div>
        )
    }

    return (
        <div className='bg-white text-gray-900'>
            {/* Hero */}
            <section className="relative isolate overflow-hidden">
                <img
                    src={banner}
                    alt="forest banner"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-emerald-50/80 backdrop-blur-sm" />
                <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-20 lg:flex lg:items-center lg:gap-12">
                    <div className="w-full space-y-6 text-center lg:text-left lg:w-3/5">
                        <p className='inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700'>
                            <Star className='w-4 h-4' />
                            Chuỗi cửa hàng sống xanh số 1 Việt Nam
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Sống xanh bắt đầu từ những lựa chọn nhỏ.
                        </h1>
                        <p className="text-lg text-gray-600">
                            Releaf kết nối bạn với những sản phẩm bền vững, minh bạch nguồn gốc
                            và tạo tác động tích cực tới cộng đồng địa phương.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition">
                                Khám phá sản phẩm
                            </button>
                            <button className="px-6 py-3 border border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition">
                                Đăng ký cộng đồng
                            </button>
                        </div>
                    </div>
                    <div className='w-full lg:w-2/5 mt-10 lg:mt-0'>
                        <div className='relative rounded-3xl bg-white/70 p-6 shadow-xl border border-emerald-50 backdrop-blur'>
                            <img
                                src={about}
                                alt='eco product'
                                className='w-full h-64 object-cover rounded-2xl'
                            />
                            <div className='grid grid-cols-2 gap-4 mt-6'>
                                {stats.map((stat) => (
                                    <div key={stat.label} className='p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 text-center'>
                                        <p className='text-2xl font-bold text-green-600'>{stat.value}</p>
                                        <p className='text-sm text-gray-500'>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2'>
                                <ShieldCheck className='w-5 h-5' />
                                Cam kết bền vững
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className='py-16 border-y border-gray-100 bg-white'>
                <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6'>
                    {highlights.map((item) => (
                        <article key={item.id} className='p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition bg-gradient-to-br from-gray-50 to-white'>
                            <div className='flex items-center gap-3'>
                                <span className='inline-flex items-center justify-center rounded-2xl bg-white shadow-inner p-3'>
                                    {item.icon}
                                </span>
                                <h3 className='font-semibold text-lg text-gray-900'>{item.title}</h3>
                            </div>
                            <p className='mt-3 text-sm text-gray-600 leading-relaxed'>{item.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Category spotlight */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-6 space-y-10'>
                    <div className='text-center space-y-4'>
                        <p className='text-green-600 font-semibold'>Danh mục nổi bật</p>
                        <h2 className='text-3xl font-bold'>Tùy chọn sống xanh phù hợp mọi lối sống</h2>
                        <p className='text-gray-600 max-w-2xl mx-auto'>
                            Lựa chọn sản phẩm được tuyển chọn thủ công bởi đội ngũ Releaf, đảm bảo 3 tiêu chí:
                            bền vững – tiện lợi – dễ áp dụng.
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {categoryHighlights.map((category) => (
                            <article
                                key={category.id}
                                className={`p-6 rounded-3xl border border-gray-100 shadow-sm bg-gradient-to-br ${category.accent}`}
                            >
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow'>
                                        {category.icon}
                                    </div>
                                    <h3 className='text-xl font-semibold'>{category.title}</h3>
                                </div>
                                <p className='text-gray-600 text-sm leading-relaxed'>{category.desc}</p>
                                <button className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700'>
                                    Xem bộ sưu tập
                                    <ArrowRight className='w-4 h-4' />
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products */}
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
                        <button className='inline-flex items-center gap-2 text-green-700 font-semibold'>
                            Xem tất cả sản phẩm
                            <ArrowRight className='w-4 h-4' />
                        </button>
                    </div>
                    {renderProductShowcase()}
                </div>
            </section>

            {/* Impact timeline */}
            <section className='py-20 bg-gray-900 text-white'>
                <div className='max-w-6xl mx-auto px-6 space-y-12'>
                    <div className='space-y-4 text-center'>
                        <p className='text-green-300 font-semibold'>Hành trình bền vững</p>
                        <h2 className='text-3xl font-bold'>Minh bạch từng bước tác động</h2>
                        <p className='text-gray-300'>Mỗi đơn hàng được theo dõi và báo cáo carbon footprint rõ ràng.</p>
                    </div>
                    <div className='grid gap-6 md:grid-cols-3'>
                        {[
                            {
                                step: '01',
                                title: 'Chọn nguồn nguyên liệu',
                                desc: 'Ưu tiên nông trại hữu cơ, hợp tác xã địa phương & nguồn tái chế.'
                            },
                            {
                                step: '02',
                                title: 'Sản xuất & kiểm định',
                                desc: 'Đảm bảo tiêu chuẩn thuần chay, không thử nghiệm trên động vật.'
                            },
                            {
                                step: '03',
                                title: 'Vòng đời mới',
                                desc: 'Chương trình thu gom & upcycle sản phẩm sau sử dụng.'
                            }
                        ].map((item) => (
                            <article key={item.step} className='p-6 rounded-3xl bg-white/5 border border-white/10'>
                                <p className='text-green-300 font-semibold'>Bước {item.step}</p>
                                <h3 className='text-xl font-semibold mt-3'>{item.title}</h3>
                                <p className='text-gray-300 mt-2 text-sm leading-relaxed'>{item.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-6xl mx-auto px-6 space-y-10'>
                    <div className='text-center space-y-4'>
                        <p className='text-green-600 font-semibold'>Câu chuyện khách hàng</p>
                        <h2 className='text-3xl font-bold'>Cộng đồng nói gì về Releaf?</h2>
                    </div>
                    <div className='grid md:grid-cols-2 gap-6'>
                        {testimonials.map((testi) => (
                            <article key={testi.id} className='p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4'>
                                <Quote className='w-10 h-10 text-green-500' />
                                <p className='text-lg font-medium text-gray-800'>{testi.quote}</p>
                                <div>
                                    <p className='font-semibold text-gray-900'>{testi.author}</p>
                                    <p className='text-sm text-gray-500'>{testi.impact}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className='py-20'>
                <div className='max-w-5xl mx-auto px-6'>
                    <div className='rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-10 text-white text-center space-y-4'>
                        <h2 className='text-3xl font-bold'>Tham gia hành trình Releaf Collective</h2>
                        <p className='text-lg text-green-50'>
                            Nhận bản tin cảm hứng mỗi tuần, workshop offline và ưu đãi độc quyền.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto'>
                            <input
                                type='email'
                                placeholder='Nhập email của bạn'
                                className='flex-1 rounded-2xl px-4 py-3 text-gray-900'
                            />
                            <button className='px-6 py-3 rounded-2xl bg-white text-green-700 font-semibold hover:bg-green-50 transition'>
                                Đăng ký ngay
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}