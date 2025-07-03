import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';

export const CartPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {/* Cart Item */}
            {[1, 2].map((id) => (
              <div key={id} className="p-6 border-b last:border-b-0">
                <div className="flex items-center">
                  <img
                    src={`https://picsum.photos/200/200?random=${id}`}
                    alt={`Product ${id}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold">Product {id}</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet</p>
                    <div className="mt-2 flex items-center">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Minus size={16} />
                      </button>
                      <span className="mx-2">1</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${(49.99 * id).toFixed(2)}</p>
                    <button className="mt-2 text-gray-500 hover:text-gray-700">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$149.97</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$9.99</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$15.00</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$174.96</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
              Proceed to Checkout
            </button>
            <Link
              to="/"
              className="block text-center mt-4 text-gray-600 hover:text-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 