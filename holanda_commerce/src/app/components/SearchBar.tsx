'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
    position?: string;
    onSearch?: (query: string) => void;
    disabled?: boolean;
}

export default function SearchBar({ 
    placeholder = 'Search...', 
    className = '', 
    onSearch,
    disabled = false
}: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        if (onSearch && query.trim()) {
            onSearch(query.trim());
        }
    }, [onSearch, query]);

        const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);

    return (                
        <div className={`flex-1 flex mx-4`}>
            <form onSubmit={handleSubmit} className='w-screen flex max-w-2xl relative'>
                <input
                    type='text'
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 pr-10 rounded-md border-none outline-none transition-colors focus:ring-2 focus:ring-blue-700 ${className} ${
                        disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={disabled}
                    aria-label='Search input'
                />
                <button
                    type='submit'
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:cursor-pointer text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 rounded'
                    disabled={disabled || !query.trim()}
                    aria-label='Search'
                >
                    <Search className='w-4 h-4' />
                </button>
            </form>
        </div>
    );
}