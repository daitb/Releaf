export default function CTASection() {
    return (
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
    );
}

