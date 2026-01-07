import { Search, Sparkles } from "lucide-react";

interface ProductListHeroProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    onSearchSubmit: (event: React.FormEvent) => void;
    onQuickSearch: (value: string) => void;
    stats: Array<{ label: string; value: string }>;
}

const quickSearchTags = ["đồ tre", "không nhựa", "giảm thiểu rác", "tái chế", "nhà bếp xanh", "quà tặng"];

export default function ProductListHero({
    searchTerm,
    onSearchTermChange,
    onSearchSubmit,
    onQuickSearch,
    stats
}: ProductListHeroProps) {
    return (
        <section className="bg-gradient-to-r from-emerald-600 to-green-500 text-white">
            <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20 space-y-10">
                <div className="flex flex-col lg:flex-row items-start gap-10">
                    <div className="flex-1 space-y-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-semibold tracking-wide uppercase">
                            <Sparkles className="w-4 h-4" />
                            Bộ sưu tập sống xanh
                        </span>
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                                Remake cửa hàng sản phẩm bền vững của bạn theo phong cách mới
                            </h1>
                            <p className="mt-4 text-lg text-emerald-50 max-w-2xl">
                                Kết nối những vật dụng thân thiện môi trường, đi kèm dữ liệu rõ ràng về chất liệu,
                                nguồn gốc, và tác động tích cực. Dễ dàng lọc, tìm kiếm và khám phá các bộ sưu tập tuyển chọn.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 backdrop-blur-sm"
                            >
                                <p className="text-sm uppercase tracking-wide text-emerald-50">{stat.label}</p>
                                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={onSearchSubmit}>
                    <div className="bg-white rounded-2xl p-3 shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex items-center gap-2 px-4">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    value={searchTerm}
                                    onChange={(event) => onSearchTermChange(event.target.value)}
                                    placeholder="Nhập tên sản phẩm, chất liệu, nhà cung cấp..."
                                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 py-3"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 px-4">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Gợi ý:</span>
                            {quickSearchTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => onQuickSearch(tag)}
                                    className="px-3 py-1.5 text-sm rounded-full border border-emerald-100 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
