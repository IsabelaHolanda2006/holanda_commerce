'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AppDialogProps {
    children: React.ReactNode;
    open: boolean;
    onClose?: () => void;
    title?: string;
}

export default function AppDialog({ 
    children, 
    open, 
    onClose,
    title
}: AppDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [open]);

    function handleClose() {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        onClose?.();
    }

    function handleBackdropClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }

    return (
        <dialog 
            className='bg-transparent border-none p-0 m-0 max-w-md w-96 backdrop:bg-black/80 backdrop:backdrop-blur-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' 
            ref={dialogRef}
            onClose={handleClose}
            aria-labelledby={title ? 'dialog-title' : undefined}
        >
            <div 
                className='bg-gray-100 p-6 rounded-lg shadow-lg relative'
                onClick={handleBackdropClick}
            >
                <button 
                    onClick={handleClose} 
                    className='absolute top-2 right-2 p-1 cursor-pointer hover:bg-gray-300 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700'
                    aria-label='Close dialog'
                >
                    <X className='text-gray-800 w-5 h-5' />
                </button>
                
                {title && (
                    <h2 id='dialog-title' className='text-xl font-semibold text-gray-800 mb-4'>
                        {title}
                    </h2>
                )}
                
                <div className='mt-2'>
                    {children}
                </div>
            </div>
        </dialog>
    );
}