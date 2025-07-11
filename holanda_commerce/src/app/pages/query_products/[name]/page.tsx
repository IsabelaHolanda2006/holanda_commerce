import NavBar from '@/app/components/NavBar';
import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/interfaces/Product';
import { VerticalScrollContainer } from '@/app/components/VerticalScrollContainer';
import UseFetching from '@/app/hooks/UseFetching';

export default async function Page({
    params
}: {
    params: Promise<{ name: string }>
}) {
    const { name: query } = await params;
    const products = await UseFetching<Product[]>(`http://localhost:8000/read/products/name/${query}`);

    return (
        <>
            <NavBar />
            <div>
                <VerticalScrollContainer className='w-full flex flex-wrap gap-4 my-2 justify-center'>
                    {products.data?.map((product, index) => {
                        return (
                            <ProductCard key={index} product={product} width='w-48 max-sm:w-36' height='h-72 max-sm:h-60' />
                        );
                    })}
                </VerticalScrollContainer>
            </div>
        </>
    );
}