import CategoryCard from './components/CategoryCards';
import SectionContainer from './components/SectionContainer';
import { HorizontalScrollContainer } from './components/HorizontalScrollContainer';
import NavBar from './components/NavBar';

export default function Home() {
  return (
    <>
    <NavBar />
      <div className='my-10 flex flex-col sm:items-center'>
        <HorizontalScrollContainer buttonPadding='p-2' className='flex items-center h-32' width='w-full'>
          <CategoryCard />
        </HorizontalScrollContainer>
        <SectionContainer title='Trending' endpoint='/read/products/category/trending' limit={10} orientation='horizontal' category='trending' />
        <SectionContainer title='Smart Stuff' endpoint='/read/products/category/smart' limit={10} orientation='horizontal' category='smart' />
        <SectionContainer title='Sales' endpoint='/read/products/category/sales' limit={10} orientation='horizontal' category='sales' />
        <SectionContainer title='The most delicious' endpoint='/read/products/category/food' limit={10} orientation='horizontal' category='food' />
      </div>
    </>
  );
}
