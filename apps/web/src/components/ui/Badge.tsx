import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  const variants = {
    success: 'bg-[#10b981] text-white',
    warning: 'bg-[#f59e0b] text-white',
    danger: 'bg-[#ef4444] text-white',
    info: 'bg-[#3b82f6] text-white',
    neutral: 'bg-gray-200 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
