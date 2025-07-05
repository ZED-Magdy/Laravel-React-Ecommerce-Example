import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { QuantityControls } from "@/components/ui/quantity-controls";
import { useNavigate } from 'react-router-dom';
import { getNextOrderNumber } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface OrderSummaryProps {
  cart: Record<number, number>;
  products: Product[];
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemoveItem: (id: number) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  products,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [nextOrderNumber, setNextOrderNumber] = useState<number | null>(null);
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const { isAuthenticated } = useAuth();
  const items = products.filter((p) => cart[p.id] && cart[p.id] > 0);
  const subtotal = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const shipping = items.length ? 15 : 0;
  const tax = items.length ? 12.5 : 0;
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();

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

  const handleProceedClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
    } else {
      navigate('/cart');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Order Summary
        {isAuthenticated && !isLoadingNumber && nextOrderNumber && (
            <span> (#{nextOrderNumber})</span>
        )}
        </h2>
        {isAuthenticated && isLoadingNumber && (
          <span className="text-sm text-gray-400">
            Loading...
          </span>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 border-b pb-4 last:border-b-0">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700 flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="border rounded-lg p-[1px]">
                  <QuantityControls
                    value={cart[item.id]}
                    min={1}
                    max={item.stock}
                    onChange={(qty) => onUpdateQuantity(item.id, qty)}
                    size="sm"
                  />
                </div>
                <span className="font-medium">${item.price}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {isAuthenticated && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Button */}
      {items.length > 0 && (
        <Button 
          className="w-full h-12 text-base"
          onClick={handleProceedClick}
        >
          {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
        </Button>
      )}

      {/* Guest Message */}
      {!isAuthenticated && items.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          Please login to see final price with shipping and tax
        </p>
      )}
    </div>
  );
}; 