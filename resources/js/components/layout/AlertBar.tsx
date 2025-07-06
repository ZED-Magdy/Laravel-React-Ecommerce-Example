import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const AlertBar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setIsVisible(false);
    }
  }, [isAuthenticated]);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-2 relative w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative px-4">
        <div className="text-center">
          <span className="text-sm font-normal font-roboto">
            Sign up and get 20% off to your first order.{' '}
          </span>
          <button className="text-sm font-bold font-roboto underline hover:no-underline">
            Sign Up Now
          </button>
        </div>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:opacity-70 p-1"
        >
          <X size={16} strokeWidth={2} className="text-white" />
        </button>
      </div>
    </div>
  );
}; 