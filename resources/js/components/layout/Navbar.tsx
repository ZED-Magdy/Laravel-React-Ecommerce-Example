import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white">
      <div className="mx-auto px-4 lg:px-32">
        <div className="flex items-center justify-between h-16 lg:h-17">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* Logo */}
            <Link to="/" className="flex items-center mr-6 lg:mr-8">
              <div className="w-20 lg:w-30 h-8 lg:h-10">
                <img 
                  src="/images/logo.png" 
                  alt="izam" 
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-black hover:text-gray-700 font-medium text-base font-roboto"
              >
                Products
              </Link>
              <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 whitespace-nowrap">
                Sell Your Product
              </button>
            </nav>
          </div>

          {/* Right section - Search, Cart, Auth */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Search Icon */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded">
              <Search size={20} className="text-black" />
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded">
              <ShoppingCart size={20} className="text-black" />
            </Link>

            {/* Authentication Section */}
            {loading ? (
              <div className="p-2">
                <Loader2 size={20} className="animate-spin text-gray-600" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                {/* Desktop User Menu */}
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                  >
                    <User size={20} className="text-black" />
                    <span className="text-sm font-medium text-black">{user.name}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile User Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 hover:bg-gray-100 rounded"
                >
                  <User size={20} className="text-black" />
                </button>
              </>
            ) : (
              <>
                {/* Desktop Login Button */}
                <Link 
                  to="/login" 
                  className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 hidden sm:block"
                >
                  Login
                </Link>

                {/* Mobile Login Button */}
                <Link 
                  to="/login" 
                  className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 text-center sm:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-900 hover:text-gray-700 font-medium font-roboto py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 text-left">
                Sell Your Product
              </button>
              
              {/* Mobile Auth Section */}
              {isAuthenticated && user ? (
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <div className="px-2 py-2">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 