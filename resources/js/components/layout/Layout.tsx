import React from 'react';
import { AlertBar } from './AlertBar';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AlertBar />
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}; 