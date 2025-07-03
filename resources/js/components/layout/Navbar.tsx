import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-20">
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

          {/* Right section - Search, Cart, Login */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Search Icon */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded">
              <Search size={20} className="text-black" />
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded">
              <ShoppingCart size={20} className="text-black" />
            </Link>

            {/* Login Button */}
            <Link 
              to="/login" 
              className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 hidden sm:block"
            >
              Login
            </Link>

            <Link 
                to="/login" 
                className="bg-black text-white px-4 py-2 rounded text-sm font-medium font-roboto hover:bg-gray-800 text-center sm:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
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
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 