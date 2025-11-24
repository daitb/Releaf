import { impactTimeline } from '../constants/homeConstants';

export default function ImpactTimelineSection() {
    return (
        <section className='py-20 bg-gray-900 text-white'>
            <div className='max-w-6xl mx-auto px-6 space-y-12'>
                <div className='space-y-4 text-center'>
                    <p className='text-green-300 font-semibold'>Hành trình bền vững</p>
                    <h2 className='text-3xl font-bold'>Minh bạch từng bước tác động</h2>
                    <p className='text-gray-300'>Mỗi đơn hàng được theo dõi và báo cáo carbon footprint rõ ràng.</p>
                </div>
                <div className='grid gap-6 md:grid-cols-3'>
                    {impactTimeline.map((item) => (
                        <article key={item.step} className='p-6 rounded-3xl bg-white/5 border border-white/10'>
                            <p className='text-green-300 font-semibold'>Bước {item.step}</p>
                            <h3 className='text-xl font-semibold mt-3'>{item.title}</h3>
                            <p className='text-gray-300 mt-2 text-sm leading-relaxed'>{item.desc}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

