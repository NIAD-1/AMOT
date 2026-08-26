import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, fullWidth = false, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md';
    
    const variants = {
      primary: 'bg-[#1e3a5f] text-white hover:bg-[#152a45] focus:ring-[#1e3a5f]',
      secondary: 'bg-white text-[#1e3a5f] border border-[#1e3a5f] hover:bg-gray-50 focus:ring-[#1e3a5f]',
      accent: 'bg-[#f59e0b] text-[#1e3a5f] hover:bg-[#d97706] focus:ring-[#f59e0b]',
      danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]',
      ghost: 'bg-transparent text-[#1e3a5f] hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = [
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    return (
      <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
