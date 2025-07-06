import React, { useEffect, useState, useMemo } from 'react';
import { QuantityControls } from '@/components/ui/quantity-controls';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getNextOrderNumber, calculateCart, checkout } from '@/lib/api';

interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [nextOrderNumber, setNextOrderNumber] = useState<number | null>(null);
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Memoize items array
  const items = useMemo(() => 
    cartItems.filter(item => item.quantity > 0),
    [cartItems]
  );

  // Handle checkout
  const handleCheckout = async () => {
    if (!isAuthenticated || items.length === 0 || isCalculating) {
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      await checkout({ items: orderItems });
      
      // Clear the cart after successful checkout
      clearCart();
      
      // Redirect to orders page
      window.location.href = '/orders';
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckoutError(
        error instanceof Error ? error.message : 'Failed to create order. Please try again.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Fetch next order number
  useEffect(() => {
    let isMounted = true;

    const fetchNextOrderNumber = async () => {
      if (!isAuthenticated || items.length === 0) {
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
  }, [isAuthenticated, items.length]);

  // Calculate cart totals
  useEffect(() => {
    let isMounted = true;

    const calculateTotals = async () => {
      if (items.length === 0) {
        setCartTotals({
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
        });
        return;
      }

      setIsCalculating(true);
      try {
        const cartItems = items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }));

        const totals = await calculateCart(cartItems);
        if (isMounted) {
          setCartTotals(totals);
        }
      } catch (error) {
        console.error('Failed to calculate cart totals:', error);
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    };

    calculateTotals();

    return () => {
      isMounted = false;
    };
  }, [items.length, cartItems]);

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
                  {isCalculating ? (
                    <span className="text-gray-400">Calculating...</span>
                  ) : (
                    <span className="text-black text-sm font-medium">
                      ${cartTotals.subtotal.toFixed(2)}
                    </span>
                  )}
                </div>
                {isAuthenticated && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Shipping</span>
                      {isCalculating ? (
                        <span className="text-gray-400">Calculating...</span>
                      ) : (
                        <span className="text-black text-sm font-medium">
                          ${cartTotals.shipping.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Tax</span>
                      {isCalculating ? (
                        <span className="text-gray-400">Calculating...</span>
                      ) : (
                        <span className="text-black text-sm font-medium">
                          ${cartTotals.tax.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Total */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black text-lg font-bold">Total</span>
                    {isCalculating ? (
                      <span className="text-gray-400">Calculating...</span>
                    ) : (
                      <span className="text-black text-lg font-bold">
                        ${cartTotals.total.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {checkoutError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-600">{checkoutError}</p>
                </div>
              )}

              {/* Place Order Button or Login Message */}
              {isAuthenticated ? (
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white text-base font-medium py-3 rounded-sm hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0 || isCalculating || isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : isCalculating ? 'Calculating...' : 'Place the order'}
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