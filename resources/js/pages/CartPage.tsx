import React, { useEffect, useState } from 'react';
import { QuantityControls } from '@/components/ui/quantity-controls';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getNextOrderNumber } from '@/lib/api';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [nextOrderNumber, setNextOrderNumber] = useState<number | null>(null);
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = 15.00;
  const tax = 12.50;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    let isMounted = true;

    const fetchNextOrderNumber = async () => {
      if (!isAuthenticated || cartItems.length === 0) {
        setNextOrderNumber(null);
        return;
      }

      setIsLoadingNumber(true);
      try {
        const response = await getNextOrderNumber();
        if (isMounted) {
          setNextOrderNumber(response.order_number);
        }
      } catch (error) {
        console.error('Failed to fetch next order number:', error);
        if (isMounted) {
          setNextOrderNumber(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingNumber(false);
        }
      }
    };

    fetchNextOrderNumber();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, cartItems.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="mx-auto px-4 md:px-32 py-4">
        <div className="flex items-center text-sm">
          <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Cart</span>
        </div>
      </div>

      <div className="mx-auto px-4 md:px-32">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-black mb-8">Your cart</h1>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Cart Items Section */}
          <div className="w-full md:w-2/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="w-full md:w-1/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Order Summary
                  {isAuthenticated && !isLoadingNumber && nextOrderNumber && (
                    <span> (#{nextOrderNumber})</span>
                  )}
                </h2>
                {isAuthenticated && isLoadingNumber && (
                  <span className="text-sm text-gray-400">Loading...</span>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="text-black text-sm font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {isAuthenticated && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Shipping</span>
                      <span className="text-black text-sm font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Tax</span>
                      <span className="text-black text-sm font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Total */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black text-lg font-bold">Total</span>
                    <span className="text-black text-lg font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Place Order Button or Login Message */}
              {isAuthenticated ? (
                <button 
                  className="w-full bg-black text-white text-base font-medium py-3 rounded-sm hover:bg-gray-800 transition-colors"
                  disabled={cartItems.length === 0}
                >
                  Place the order
                </button>
              ) : (
                <>
                  <button 
                    className="w-full bg-blue-600 text-white text-base font-medium py-3 rounded-sm hover:bg-blue-700 transition-colors"
                    onClick={() => window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                  >
                    Login to Checkout
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Please login to see final price with shipping and tax
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartItemCardProps {
  item: import('@/contexts/CartContext').CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex gap-4">
      {/* Product Image */}
      <div className="relative w-48 h-54 flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover rounded"
        />
        {/* Quantity Badge */}
        <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          {item.quantity}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Top Section - Name and Category */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row justify-start items-start gap-4">
            <h3 className="font-medium text-base text-black">
              {item.product.name}
            </h3>
            <span className="bg-gray-100 text-black text-xs px-2 py-1 rounded whitespace-nowrap">
              {item.product.category}
            </span>
          </div>

          {/* Price and Stock */}
          <div className="flex flex-row md:flex-col justify-between md:justify-start md:gap-1">
            <span className="font-bold text-base text-black">${item.product.price}</span>
            <span className="text-sm text-gray-500">Stock: {item.product.stock}</span>
          </div>
        </div>

        {/* Bottom Section - Quantity Controls */}
        <div className="mt-4 w-full md:w-1/2">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <QuantityControls
              value={item.quantity}
              min={0}
              max={item.product.stock}
              onChange={(qty) => onUpdateQuantity(item.id, qty)}
            />
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="flex items-start pt-4">
        <button
          onClick={() => onRemove(item.id)}
          className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
        >
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5h16M7 9v6M11 9v6M2 5l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M6 5V3a1 1 0 011-1h4a1 1 0 011 1v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}; 