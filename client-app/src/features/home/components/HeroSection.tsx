import { ShieldCheck, Star } from 'lucide-react';
import banner from '@assets/forest.jpg';
import about from '@assets/about.png';
import { stats } from '../constants/homeConstants';

export default function HeroSection() {
    return (
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
    );
}

