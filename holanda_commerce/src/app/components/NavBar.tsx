'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import LinkButton from './LinkButton';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, openLogoutDialog } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        openLogoutDialog();
        setIsSidebarOpen(false);
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    const handleSearch = (query: string) => {
        router.push(`http://localhost:3000/pages/query_products/${query}`);
    };

    return (
        <header className='flex flex-col items-center'>
            <div className='w-full h-navbar bg-blue-900 flex items-center justify-between px-4'>
                <div className='flex items-center'>
                    <Link href='/' aria-label='Go to homepage'>
                        <Image 
                            src='/holanda-commerce.png' 
                            alt='Holanda Commerce logo - A franchise of supermarkets' 
                            width={70} 
                            height={70} 
                        />
                    </Link>
                </div>
                
                <div className='flex items-center gap-4'>
                    {user ? (
                        <>
                            <LinkButton 
                                href='/pages/wishlist'
                                className='p-2 rounded-md max-sm:hidden group hover:bg-blue-800 transition-colors duration-200 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300'
                                aria-label='Go to wishlist'
                            >
                                <Heart className='w-6 h-6 group-hover:fill-red-500 group-hover:stroke-red-900 transition-colors' />
                            </LinkButton>
                            <LinkButton 
                                href='/pages/shopping_cart' 
                                className='p-2 rounded-md max-sm:hidden hover:bg-blue-800 transition-colors duration-200 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300'
                                aria-label='Go to shopping cart'
                            >
                                <ShoppingCart className='w-6 h-6' />
                            </LinkButton>
                            <LinkButton 
                                href='/pages/profile' 
                                className='p-2 rounded-md max-sm:hidden hover:bg-blue-800 transition-colors duration-200 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300'
                                aria-label='Go to profile'
                            >
                                <User className='w-6 h-6' />
                            </LinkButton>
                        </>
                    ) : (
                        <LinkButton 
                            href='/pages/login' 
                            className='p-2 rounded-md max-sm:hidden hover:bg-blue-800 transition-colors duration-200 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300'
                            aria-label='Go to login page'
                        >
                            <User className='w-6 h-6' />
                        </LinkButton>
                    )}
                    
                    <button
                        className='p-2 rounded-md bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-orange-300 sm:hidden'
                        onClick={handleSidebarToggle}
                        aria-label='Open navigation menu'
                        aria-expanded={isSidebarOpen}
                    >
                        <Menu className='w-6 h-6' />
                    </button>
                </div>
            </div>

            <SearchBar 
                placeholder='Search Products...' 
                className='text-gray-800 placeholder:text-gray-400 bg-gray-200 m-2 focus:ring-2 focus:ring-orange-500 transition-all duration-200'
                onSearch={handleSearch}
            />

            {/* Sidebar */}
            <nav
                className={`fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-lg shadow-black/50 z-50 transform transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-label='Navigation menu'
            >
                <div className='flex justify-end p-4'>
                    <button
                        className='p-2 rounded-md transition-colors duration-300 bg-blue-700 hover:bg-blue-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        onClick={handleSidebarClose}
                        aria-label='Close navigation menu'
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>
                
                {user && (
                    <div className='px-4 mb-4'>
                        <p className='text-gray-800 font-medium'>Welcome, {user.name}!</p>
                        <p className='text-gray-600 text-sm'>{user.email}</p>
                    </div>
                )}

                
                <nav className='flex items-center flex-col mt-4'>
                    <ul className='flex flex-col gap-4'>
                        {user ? (
                            <>
                                <li className='w-40'>
                                    <LinkButton 
                                        href='/pages/profile' 
                                        className='flex relative w-full text-start items-center justify-between h-12 hover:bg-gray-200 rounded-lg p-2'
                                    >
                                        <span>Profile</span>
                                        <User className='w-4 h-4 inline-block absolute right-[8px] top-1/2 -translate-y-1/2' />
                                    </LinkButton>
                                </li>
                                <li className='w-40'>
                                    <LinkButton 
                                        href='/wishlist' 
                                        className='flex relative w-full text-start items-center justify-between h-12 hover:bg-gray-200 rounded-lg p-2'
                                    >
                                        <span>Wishlist</span>
                                        <Heart className='w-4 h-4 inline-block absolute right-[8px] top-1/2 -translate-y-1/2' />
                                    </LinkButton>
                                </li>
                                <li className='w-40'>
                                    <LinkButton 
                                        href='/cart' 
                                        className='flex relative w-full text-start items-center justify-between h-12 hover:bg-gray-200 rounded-lg p-2'
                                    >
                                        <span>Cart</span>
                                        <ShoppingCart className='w-4 h-4 inline-block absolute right-[8px] top-1/2 -translate-y-1/2' />
                                    </LinkButton>
                                </li>
                                <li className='w-40'>
                                    <button
                                        onClick={handleLogout}
                                        className='flex relative w-full text-start items-center justify-between h-12 hover:bg-gray-200 rounded-lg p-2 text-red-600'
                                    >
                                        <span>Logout</span>
                                        <LogOut className='w-4 h-4 inline-block absolute right-[8px] top-1/2 -translate-y-1/2' />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className='w-40'>
                                <LinkButton 
                                    href='/login' 
                                    className='flex relative w-full text-start items-center justify-between h-12 hover:bg-gray-200 rounded-lg p-2'
                                >
                                    <span>Login</span>
                                    <User className='w-4 h-4 inline-block absolute right-[8px] top-1/2 -translate-y-1/2' />
                                </LinkButton>
                            </li>
                        )}
                    </ul>
                </nav>
            </nav>
            
            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 bg-black/60 z-40 duration-300'
                    onClick={handleSidebarClose}
                    aria-hidden='true'
                />
            )}
        </header>
    );
}