'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/app/components/NavBar';
import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/interfaces/Product';
import { VerticalScrollContainer } from '@/app/components/VerticalScrollContainer';
import UseFetching from '@/app/hooks/UseFetching';

export default function Page() {
    const params = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const query = params.name as string;

    useEffect(() => {
        async function fetchProducts() {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await UseFetching<Product[]>(`/read/products/name/${query}`);
                
                if (response.error) {
                    setError(response.error);
                    return;
                }
                
                if (response.data) {
                    setProducts(response.data);
                } else {
                    setError('No products data received');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
        
        if (query) {
            fetchProducts();
        }
    }, [query]);

    return (
        <>
            <NavBar />
            <div className='p-4'>
                <h1 className='text-2xl font-bold text-gray-800 mb-4'>Results for &quot;{query}&quot;</h1>
                
                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        <strong>Erro:</strong> {error}
                    </div>
                )}
                
                {isLoading && (
                    <div className='text-center py-8'>
                        <p className='text-gray-600'>Loading products...</p>
                    </div>
                )}
                
                {!isLoading && !error && products.length === 0 && (
                    <div className='text-center py-8'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-2'>No product found</h2>
                        <p className='text-gray-600'>No product found for &quot;{query}&quot;</p>
                    </div>
                )}
                
                {!isLoading && !error && products.length > 0 && (
                    <>
                        <VerticalScrollContainer className='w-full flex flex-wrap gap-4 my-2 justify-center'>
                            {products.map((product, index) => (
                                <ProductCard key={index} product={product} width='w-48 max-sm:w-36' height='h-72 max-sm:h-60' />
                            ))}
                        </VerticalScrollContainer>
                    </>
                )}
            </div>
        </>
    );
}