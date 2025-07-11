import Link from 'next/link';

interface LinkButtonProps {
    href: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    'aria-label'?: string;
}

export default function LinkButton({ 
    href, 
    className = '', 
    children, 
    onClick,
    disabled = false,
    'aria-label': ariaLabel
}: LinkButtonProps) {
    const defaultAriaLabel = ariaLabel || `Go to ${href}`;

    if (disabled) {
        return (
            <button 
                className={`${className} cursor-not-allowed opacity-50`} 
                disabled
                aria-label={defaultAriaLabel}
            >
                <span>{children}</span>
            </button>
        );
    }

    return (
        <Link 
            href={href} 
            aria-label={defaultAriaLabel} 
            role='link'
            onClick={onClick}
        >
            <button className={`${className} cursor-pointer transition-colors`}>
                <span>{children}</span>
            </button>
        </Link>
    );
}