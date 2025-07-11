import ProductFetcher from '@/app/components/ProductFetcher';
import NavBar from '@/app/components/NavBar';

export default function Page() {
    return (
        <>
            <NavBar />
            <ProductFetcher readedFrom='shopping_cart' />
        </>
    );
}