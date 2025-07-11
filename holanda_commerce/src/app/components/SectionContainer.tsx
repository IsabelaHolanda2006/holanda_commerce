'use client';

import LinkButton from './LinkButton';
import { HorizontalScrollContainer } from './HorizontalScrollContainer';
import ProductCard from './ProductCard';
import UseFetching from '../hooks/UseFetching';
import { useEffect, useState } from 'react';
import { Product } from '../interfaces/Product';
import { VerticalScrollContainer } from './VerticalScrollContainer';

interface SectionContainerProps {
    title: string,
    category: string,
    endpoint: string,
    limit: number,
    orientation: 'horizontal' | 'vertical'
}

function renderProductContent(
    error: string | null,
    isLoading: boolean,
    products: Product[],
    limit: number
) {
    // Error State
    if (error) {
        return (
            <div className='flex items-center justify-center w-full h-32 text-gray-600'>
                <p>Failed to load products. Please try again later.</p>
            </div>
        );
    }
    
    // Loading State
    if (isLoading) {
        return Array.from({ length: limit }).map((_, index) => (
            <ProductCard 
                key={`skeleton-${index}`} 
                product={null} 
                width='w-48 max-sm:w-36' 
                height='h-72 max-sm:h-60' 
            />
        ));
    }
    
    // Products
    return products.map((product) => (
        <ProductCard 
            key={product.id} 
            product={product} 
            width='w-48 max-sm:w-36' 
            height='h-72 max-sm:h-60' 
        />
    ));
}

export default function SectionContainer({ title, endpoint, limit, orientation, category }: SectionContainerProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await UseFetching<Product[]>(`http://localhost:8000${endpoint}`);
                
                if (response.error) {
                    setError(response.error);
                    console.error(`Error fetching products for ${title}:`, response.error);
                    return;
                }
                
                if (response.data) {
                    const limitedProducts = limit ? response.data.slice(0, limit) : response.data;
                    setProducts(limitedProducts);
                } else {
                    setError('No products data received');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
                setError(errorMessage);
                console.error(`Error fetching products for ${title}:`, errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchProducts();
    }, [endpoint, limit, title]);

    return (
        <div className='flex w-full flex-col gap-2 overflow-x-hidden'>
            <div className='flex max-sm:flex-col justify-between items-center'>
                <h2 className='text-2xl font-bold mb-4 px-4 text-blue-900 text-center'>{title}</h2>
                {orientation === 'horizontal' && <LinkButton className='px-4 text-blue-900' href={`/pages/categories/${category}`}>Show all</LinkButton>}
            </div>
            {orientation === 'horizontal' ? 
            <HorizontalScrollContainer buttonPadding='p-2' width='w-full' className='h-88 flex gap-4 items-center px-4'>
                {renderProductContent(error, isLoading, products, limit)}
            </HorizontalScrollContainer> : 
            <VerticalScrollContainer className='flex flex-wrap gap-4 m-2 justify-center'>
                {renderProductContent(error, isLoading, products, limit)}
            </VerticalScrollContainer>}
            
        </div>
    );
}