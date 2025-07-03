import React from 'react';
import { Button } from "@/components/ui/button";

interface QuantityControlsProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

export const QuantityControls: React.FC<QuantityControlsProps> = ({
  value,
  min = 0,
  max = Infinity,
  onChange,
  size = 'md',
}) => {
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const inputSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const fontSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className={`${btnSize} bg-gray-100 rounded-l-lg hover:bg-gray-200`}
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={value <= min}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M5 12h14" />
        </svg>
      </Button>
      <div className={`${inputSize} flex items-center justify-center ${fontSize} font-medium bg-white`}>
        {value}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={`${btnSize} bg-gray-100 rounded-r-lg hover:bg-gray-200`}
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value >= max}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </Button>
    </div>
  );
}; 