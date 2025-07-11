'use client';

import { useRef, useEffect, useCallback } from 'react';

interface VerticalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
  maxHeight?: string;
  onScrollEnd?: () => void;
  limit?: number;
}

export function VerticalScrollContainer({
  children,
  className = '',
  height = 'h-screen',
  maxHeight = 'max-h-[80vh]',
  onScrollEnd,
  limit = 50,
}: VerticalScrollContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !onScrollEnd) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < limit;

    if (isNearBottom) {
      onScrollEnd();
    }
  }, [onScrollEnd, limit]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !onScrollEnd) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll, onScrollEnd]);

  return (
    <div
      ref={scrollContainerRef}
      className={`
        overflow-y-auto
        scrollbar-thin
        scrollbar-thumb-gray-400
        scrollbar-track-gray-100
        scroll-smooth
        focus:outline-none
        focus:ring-2
        focus:ring-blue-700
        ${height}
        ${maxHeight}
        ${className}
      `}
      role='region'
      aria-label='Vertical scroll container'
      tabIndex={0}
    >
      {children}
    </div>
  );
} 