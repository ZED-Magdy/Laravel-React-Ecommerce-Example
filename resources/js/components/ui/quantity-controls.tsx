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
  const fontSize = size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className={`${btnSize} rounded-lg`}
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={value <= min}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
      <span className={`${fontSize} font-medium w-6 text-center`}>
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        className={`${btnSize} rounded-lg`}
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value >= max}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </Button>
    </div>
  );
}; 