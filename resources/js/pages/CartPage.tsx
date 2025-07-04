import React, { useState } from 'react';
import { QuantityControls } from '@/components/ui/quantity-controls';
import { Product } from '@/types/product';

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      product: {
        id: 1,
        name: "Gradient Graphic T-shirt",
        price: 145,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format",
        category: "T-shirts",
        stock: 25,
      },
      quantity: 1,
    },
    {
      id: 2,
      product: {
        id: 2,
        name: "Polo with Tipping Details",
        price: 180,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&auto=format",
        category: "Polo",
        stock: 18,
      },
      quantity: 1,
    },
    {
      id: 3,
      product: {
        id: 3,
        name: "Classic Blue Jeans",
        price: 200,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format",
        category: "Jeans",
        stock: 15,
      },
      quantity: 1,
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = 15.00;
  const tax = 12.50;
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="mx-auto px-32 py-4">
        <div className="flex items-center text-sm">
          <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Casual</span>
        </div>
      </div>

      <div className="mx-auto px-32">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-black mb-8">Your cart</h1>

        <div className="flex gap-5">
          {/* Cart Items Section */}
          <div className="flex-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="w-[509px]">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Order Summary ( #123 )</h2>
                <span className="text-blue-600 text-base">5 May 2025</span>
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="text-black text-sm font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Shipping</span>
                  <span className="text-black text-sm font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Tax</span>
                  <span className="text-black text-sm font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-black text-lg font-bold">Total</span>
                  <span className="text-black text-lg font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button className="w-full bg-black text-white text-base font-medium py-3 rounded-sm hover:bg-gray-800 transition-colors">
                Place the order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartItemCardProps {
  item: CartItem;
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
          <div className="flex justify-start items-start gap-4">
            <h3 className="font-medium text-base text-black">
              {item.product.name}
            </h3>
            <span className="bg-gray-100 text-black text-xs px-2 py-1 rounded whitespace-nowrap">
              {item.product.category}
            </span>
          </div>

          {/* Price and Stock */}
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-base text-black">${item.product.price}</span>
            <span className="text-sm text-gray-500">Stock: {item.product.stock}</span>
          </div>
        </div>

        {/* Bottom Section - Quantity Controls */}
        <div className="mt-4 w-1/2">
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