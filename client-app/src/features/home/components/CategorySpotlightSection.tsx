import { ArrowRight } from 'lucide-react';
import { categoryHighlights } from '../constants/homeConstants';

export default function CategorySpotlightSection() {
    return (
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
    );
}

