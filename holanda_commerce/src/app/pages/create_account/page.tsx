'use client';

import TextInput from '@/app/components/TextInput';
import LinkButton from '@/app/components/LinkButton';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRef, useState } from 'react';

export default function Page() {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        
        if (!emailRef.current?.value || !passwordRef.current?.value || !nameRef.current?.value) {
            setError('Please fill in all fields');
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            const success = await register(nameRef.current?.value, emailRef.current?.value, passwordRef.current?.value);
            
            if (success) {
                window.location.href = '/pages/login';
            } else {
                setError('Account creation failed. Please try again.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Account creation failed';
            setError(errorMessage);
            console.error('Account creation error:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <LinkButton href='/' aria-label='back to the main page' className='absolute top-2 left-2' >
                <ArrowLeft />
            </LinkButton>
            <div className='flex flex-col items-center h-content'>
                <div className='flex flex-col items-center justify-evenly w-96 h-content'>
                    <h1 className='text-4xl font-bold text-blue-950'>Create an Account</h1>
                    
                    {error && (
                        <div className='w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-md'>
                            {error}
                        </div>
                    )}
                    
                    <form className='flex flex-col gap-10 w-full' onSubmit={handleLogin}>
                        <TextInput 
                            ref={nameRef} 
                            className='border-b-3 border-blue-950 focus:border-3 focus:border-blue-950' 
                            required={true} 
                            label='Name' 
                            id='name' 
                            type='text'
                            placeholder='Enter your name'
                            autoComplete='name'
                        />
                        <TextInput 
                            ref={emailRef} 
                            className='border-b-3 border-blue-950 focus:border-3 focus:border-blue-950' 
                            required={true} 
                            label='Email' 
                            id='email' 
                            type='email'
                            placeholder='Enter your email'
                            autoComplete='email'
                        />
                        <TextInput 
                            ref={passwordRef} 
                            className='border-b-3 border-blue-950 focus:border-3 focus:border-blue-950' 
                            required={true} 
                            label='Password' 
                            id='password' 
                            type='password'
                            placeholder='Enter your password'
                            autoComplete='current-password'
                        />
                        <button 
                            type='submit' 
                            className='bg-blue-950 text-gray-100 p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors' 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                    <LinkButton href='/pages/login' className='text-blue-950'>{'Already have an account? Login'}</LinkButton>
                    {/* <p className='text-gray-800'>OR</p>
                    <LinkButton href='/' className='text-blue-950 p-3 rounded-md bg-gray-300'>{'Login with Google'}</LinkButton> */}
                </div>
            </div>
        </>
    );
}