import { highlights } from '../constants/homeConstants';

export default function HighlightsSection() {
    return (
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
    );
}

