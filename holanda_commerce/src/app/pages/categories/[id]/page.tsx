import NavBar from '@/app/components/NavBar';
import SectionContainer from '@/app/components/SectionContainer';

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return (
        <div>
            <NavBar />
            <SectionContainer title='' endpoint={`/read/products/category/${id}`} limit={0} orientation='vertical' category={id}/>
        </div>
    );
}