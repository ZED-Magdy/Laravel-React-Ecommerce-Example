import React from 'react';
import { Button } from "@/components/ui/button";
import { QuantityControls } from "@/components/ui/quantity-controls";

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
  const items = products.filter((p) => cart[p.id] && cart[p.id] > 0);
  const subtotal = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const shipping = items.length ? 15 : 0;
  const tax = items.length ? 12.5 : 0;
  const total = subtotal + shipping + tax;

  return (
    <aside className="w-full lg:w-80 xl:w-96 space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {items.map((p) => (
          <div key={p.id} className="flex gap-3 border-b pb-4 last:border-b-0 last:pb-0">
            <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-medium leading-tight line-clamp-2 flex-1">
                  {p.name}
                </h3>
                <button
                  onClick={() => onRemoveItem(p.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6v12" />
                    <path d="M16 6v12" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M15 3H9l-1 3h8z" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <QuantityControls
                  value={cart[p.id]}
                  min={1}
                  max={p.stock}
                  onChange={(qty) => onUpdateQuantity(p.id, qty)}
                  size="sm"
                />
                <span className="text-sm font-medium">${p.price}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Button className="w-full h-12">Proceed to Checkout</Button>
    </aside>
  );
}; 