import type { Product } from "@entities/product/model";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
            <div className="overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-56 object-cover"
                />
            </div>
            <div className="p-5 space-y-3">
                <div className="text-sm text-emerald-600 font-medium">
                    {product.categoryName}
                </div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.productName}</h3>
                <p className="text-green-600 font-semibold text-lg">{product.price} VND</p>
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition">
                    Thêm vào giỏ
                </button>
            </div>
        </article>
    );
}

