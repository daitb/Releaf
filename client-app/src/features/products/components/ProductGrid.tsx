import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products}: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
            ))}
        </div>
    );
}
