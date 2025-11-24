import { Quote } from 'lucide-react';
import { testimonials } from '../constants/homeConstants';

export default function TestimonialsSection() {
    return (
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
    );
}

