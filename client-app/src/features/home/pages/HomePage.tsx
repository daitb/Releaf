import { useEffect } from 'react';
import type { Product } from '@features/products/types/product';
import { fetchBestSellingProducts } from '@features/products/services/productService';
import { useAsyncState } from '@shared/hooks/useAsyncState';
import HeroSection from '../components/HeroSection';
import HighlightsSection from '../components/HighlightsSection';
import CategorySpotlightSection from '../components/CategorySpotlightSection';
import ProductsSection from '../components/ProductsSection';
import ImpactTimelineSection from '../components/ImpactTimelineSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

export default function HomePage() {
    const { data, isLoading, error, execute } = useAsyncState<Product[]>();
    const productList = data ?? [];

    useEffect(() => {
        void execute(() => fetchBestSellingProducts(4));
    }, [execute]);

    return (
        <div className='bg-white text-gray-900'>
            <HeroSection />
            <HighlightsSection />
            <CategorySpotlightSection />
            <ProductsSection
                productList={productList}
                isLoading={isLoading}
                error={error}
            />
            <ImpactTimelineSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
}