import { forwardRef } from 'react';

interface TextInputProps {
    label: string;
    id: string;
    placeholder: string;
    className?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'password' | 'tel';
    error?: string;
    disabled?: boolean;
    autoComplete?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ 
        label, 
        id, 
        placeholder, 
        className = '', 
        required = false, 
        type = 'text',
        error,
        disabled = false,
        autoComplete
    }, ref) => {
        return (
            <div className='flex flex-col gap-2'>
                <label htmlFor={id} className='text-gray-800 ml-2 font-medium'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
                
                <input 
                    type={type}
                    id={id} 
                    placeholder={placeholder} 
                    className={`p-2 rounded-md w-full h-10 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                        error 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 bg-gray-100 focus:border-blue-700'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} 
                    required={required} 
                    ref={ref}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                
                {error && (
                    <p id={`${id}-error`} className='text-red-500 text-sm ml-2'>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;