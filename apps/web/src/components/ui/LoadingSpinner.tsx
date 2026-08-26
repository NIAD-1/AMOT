import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="w-8 h-8 text-[#1e3a5f] animate-spin" />
    </div>
  );
};
