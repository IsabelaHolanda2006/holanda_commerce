'use client';

import { useEffect, useState } from 'react';
import UseFetching from '@/app/hooks/UseFetching';
import { ProductsOnWishlist } from '@/app/interfaces/ProductsOnWishlist';
import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/interfaces/Product';
import { useAuth } from '@/app/contexts/AuthContext';
import { VerticalScrollContainer } from './VerticalScrollContainer';

/*
    this component is used to fetch the
    products for wishlist and cart pages
*/

interface ProductFetcherProps {
    readedFrom: string
}

export default function ProductFetcher({ readedFrom }: ProductFetcherProps) {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!user) return;

        async function fetchProducts() {
            if (user?.id) {
                const fetchedResponse = await UseFetching<ProductsOnWishlist[]>(`http://localhost:8000/read/${readedFrom}/${user.id}`, { method: 'GET' });
                if (fetchedResponse.data) {
                    const productsData = await Promise.all(
                        fetchedResponse.data.map(async (fetched) => {
                            const productResponse = await UseFetching<Product[]>(`http://localhost:8000/read/products/id/${fetched.product_id}`, { method: 'GET' });
                            return productResponse.data && productResponse.data[0];
                        })
                    );
                    setProducts(productsData.filter((product): product is Product => !!product && !!product.id));
                }
            }
            }

        fetchProducts();
    }, [user, readedFrom]);

    return (
        <>
            <VerticalScrollContainer className='w-full flex flex-wrap gap-4 my-2 justify-center'>
                {products.map((product) =>
                    <ProductCard key={product.id} product={product} width='w-48 max-sm:w-36' height='h-72 max-sm:h-60' />
                )}
            </VerticalScrollContainer>
        </>
    );
}