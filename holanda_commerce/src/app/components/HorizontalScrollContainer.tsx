'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  buttonPadding: string;
  width?: string;
  scrollAmount?: number;
}

export function HorizontalScrollContainer({
  children,
  buttonPadding,
  className = '',
  width = 'w-11/12',
  scrollAmount = 300,
}: HorizontalScrollContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  }, [scrollAmount]);

  const handleScroll = useCallback(() => {
    updateScrollButtons();
  }, [updateScrollButtons]);

  useEffect(() => {
    updateScrollButtons();
  }, [updateScrollButtons]);

  return (
    <div className={`relative ${width} group px-10`}>
      <button
        onClick={() => scroll('left')}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-blue-700/80 hover:bg-blue-700
                 rounded-full shadow-md transition-opacity hover:cursor-pointer duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                 ${buttonPadding} ${
                   canScrollLeft 
                     ? 'opacity-100 max-sm:opacity-100' 
                     : 'opacity-0 max-sm:hidden group-hover:opacity-100'
                 }`}
        role='button'
        aria-label='Scroll to the left'
        disabled={!canScrollLeft}
      >
        <ChevronLeft className='w-6 h-6 text-gray-100' />
      </button>

      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto scrollbar-hide scroll-smooth ${className}`}
        role='region'
        aria-label='Horizontal scroll container'
        onScroll={handleScroll}
        tabIndex={0}
      >
        {children}
      </div>

      <button
        onClick={() => scroll('right')}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-blue-700/80 hover:bg-blue-700 
                 rounded-full shadow-md transition-opacity duration-200 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400
                 ${buttonPadding} ${
                   canScrollRight 
                     ? 'opacity-100 max-sm:opacity-100' 
                     : 'opacity-0 max-sm:hidden group-hover:opacity-100'
                 }`}
        role='button'
        aria-label='Scroll to the right'
        disabled={!canScrollRight}
      >
        <ChevronRight className='w-6 h-6 text-gray-100' />
      </button>
    </div>
  );
} 