import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductListHeroProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    onSearchSubmit: (event: React.FormEvent) => void;
    onQuickSearch: (value: string) => void;
}

const quickSearchTags = ["đồ tre", "không nhựa", "giảm thiểu rác", "tái chế", "nhà bếp xanh", "quà tặng"];

export default function ProductListHero({
    searchTerm,
    onSearchTermChange,
    onSearchSubmit,
    onQuickSearch,
}: ProductListHeroProps) {
    return (
        <>
            {/* Hero Banner with Wave Patterns */}
            <section className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white overflow-hidden">
                {/* Animated Wave Patterns */}
                <div className="absolute inset-0 opacity-30">
                    <svg
                        className="absolute bottom-0 w-full h-64 animate-wave"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="rgba(255, 255, 255, 0.1)"
                            fillOpacity="1"
                            d="M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                    <svg
                        className="absolute bottom-0 w-full h-64 animate-wave-slow"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="rgba(255, 255, 255, 0.05)"
                            fillOpacity="1"
                            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                    <svg
                        className="absolute bottom-0 w-full h-64 animate-wave-reverse"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="rgba(255, 255, 255, 0.08)"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-16">
                    {/* Title Section */}
                    <div className="text-center mb-10 space-y-3">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                            Khám Phá Sản Phẩm Xanh
                        </h1>
                        <p className="text-emerald-50 text-lg lg:text-xl max-w-2xl mx-auto">
                            Lựa chọn thông minh cho một hành tinh xanh hơn
                        </p>
                    </div>

                    {/* Search Box - Will become sticky */}
                    <form onSubmit={onSearchSubmit}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl flex flex-col gap-3 max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2 px-4">
                                    <Search className="w-5 h-5 text-emerald-500" />
                                    <input
                                        value={searchTerm}
                                        onChange={(event) => onSearchTermChange(event.target.value)}
                                        placeholder="Nhập tên sản phẩm, chất liệu, nhà cung cấp..."
                                        className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 py-3 text-base"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 px-4">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gợi ý:</span>
                                {quickSearchTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => onQuickSearch(tag)}
                                        className="px-3 py-1.5 text-sm rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:scale-105"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Bottom Wave Border */}
                <div className="absolute bottom-0 left-0 w-full h-16">
                    <svg
                        className="absolute bottom-0 w-full h-full"
                        viewBox="0 0 1440 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="white"
                            fillOpacity="1"
                            d="M0,50L60,45C120,40,240,30,360,35C480,40,600,60,720,65C840,70,960,60,1080,50C1200,40,1320,30,1380,25L1440,20L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
                        />
                    </svg>
                </div>
            </section>

            {/* Sticky Search Bar */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 -translate-y-full opacity-0"
                    }`}
            >
                <div className="bg-white shadow-xl border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <form onSubmit={onSearchSubmit}>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2 px-4 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <Search className="w-5 h-5 text-emerald-500" />
                                    <input
                                        value={searchTerm}
                                        onChange={(event) => onSearchTermChange(event.target.value)}
                                        placeholder="Nhập tên sản phẩm, chất liệu, nhà cung cấp..."
                                        className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 py-3 text-base"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Tìm kiếm
                                </button>
                                <div className="hidden lg:flex flex-wrap items-center gap-2">
                                    {quickSearchTags.slice(0, 4).map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => onQuickSearch(tag)}
                                            className="px-3 py-1.5 text-sm rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add custom animations to global styles */}
            <style>{`
                @keyframes wave {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-25px) translateY(-10px); }
                }
                
                @keyframes wave-slow {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-15px) translateY(-15px); }
                }
                
                @keyframes wave-reverse {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(25px) translateY(-8px); }
                }
                
                .animate-wave {
                    animation: wave 8s ease-in-out infinite;
                }
                
                .animate-wave-slow {
                    animation: wave-slow 12s ease-in-out infinite;
                }
                
                .animate-wave-reverse {
                    animation: wave-reverse 10s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
