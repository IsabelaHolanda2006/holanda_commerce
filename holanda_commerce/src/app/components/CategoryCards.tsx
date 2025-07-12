'use client';

import Image from 'next/image';
import UseFetching from '../hooks/UseFetching';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    image_url: string;
}

interface CategoryCardProps {
    width?: string;
    height?: string;
}

export default function CategoryCard({ width = 'w-15', height = 'h-15' }: CategoryCardProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                
                const response = await UseFetching<Category[]>('/read/categories');
                
                if (response.error) {
                    console.error('Error fetching categories:', response.error);
                    return;
                }
                
                if (response.data) {
                    setCategories(response.data);
                } else {
                    console.error('No categories data received');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className='flex gap-6'>
                {[1, 2, 3, 4].map((index) => (
                    <div key={index} className='flex flex-col justify-center items-center'>
                        <div className={`${width} ${height} rounded-full bg-gray-300 animate-pulse mb-2`} />
                        <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
                    </div>
                ))}
            </div>
        );
    }

    if (!categories.length) {
        return (
            <div className='flex items-center justify-center w-full h-32 text-gray-600'>
                <p>No categories available.</p>
            </div>
        );
    }

    return (
        <div className='flex gap-6'>
            {categories.map((category) => (
                <div
                    key={category.id} 
                    className='flex flex-col w-full h-full items-center cursor-pointer hover:scale-105 transition-transform'
                    role='button'
                    tabIndex={0}
                    aria-label={`Category: ${category.name}`}
                >
                    <div className={`${width} ${height} relative`}>
                        <Link href={`/pages/categories/${category.id}`}>
                            <Image 
                                src={category.image_url ?? '/holanda-commerce.png'} 
                                alt={`Category: ${category.name}`} 
                                sizes='256px'
                                fill
                                className='rounded-full object-cover shadow-md hover:shadow-xl transition-shadow relative'
                            />
                        </Link>
                    </div>
                    <span className='text-gray-800 text-sm font-medium mt-2 text-center'>
                        {category.name}
                    </span>
                </div>
            ))}
        </div>
    );
}