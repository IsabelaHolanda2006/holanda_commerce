'use client';

// import TextInput from '@/app/components/TextInput';
import { useAuth } from '@/app/contexts/AuthContext';
import { User, LogOut, Settings, ArrowLeft } from 'lucide-react';
import LinkButton from '@/app/components/LinkButton';

export default function ProfilePage() {
    const { user, openLogoutDialog } = useAuth();

    if (!user) {
        return (
            <div className='flex h-full flex-col gap-10 items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-4'>Access Denied</h1>
                    <p className='text-gray-600'>Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <LinkButton href='/' aria-label='back to the main page' className='absolute top-2 left-2' >
                <ArrowLeft />
            </LinkButton>
            <div className='flex h-full flex-col gap-10 items-center p-6'>
                <div className='flex flex-col items-center mt-5 h-full w-full max-w-2xl'>
                    <div className='bg-gray-100 rounded-full p-6 mb-6'>
                        <User className='w-16 h-16 text-blue-700' />
                    </div>
                    
                    <h1 className='text-3xl font-bold text-gray-800 mb-2 text-center'>Your Profile</h1>
                    <p className='text-gray-600 text-center mb-8'>
                        Here you can manage your profile information and account settings
                    </p>
                    
                    <div className='w-full bg-gray-100 rounded-lg p-6 mb-6'>
                        <div className='flex items-center justify-center gap-3 mb-4'>
                            <Settings className='w-5 h-5 text-blue-700 max-xs:hidden' />
                            <h2 className='text-xl font-semibold text-gray-800 text-center'>Account Information</h2>
                        </div>
                        
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                                <p className='text-gray-800 max-xs:text-center bg-gray-200 p-3 rounded-md'>{user.name}</p>
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <p className='text-gray-800 max-xs:text-center bg-gray-200 p-3 xs:w-full rounded-md overflow-x-auto'>{user.email}</p>
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
                                <p className='text-gray-800 max-xs:text-center bg-gray-200 p-3 rounded-md capitalize'>{user.role}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex gap-4 w-full justify-center'>
                        <button 
                            onClick={openLogoutDialog} 
                            className='flex items-center gap-2 bg-red-500 text-gray-100 px-6 py-3 rounded-md cursor-pointer hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400'
                            aria-label='Logout from account'
                        >
                            <LogOut className='w-4 h-4' />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}