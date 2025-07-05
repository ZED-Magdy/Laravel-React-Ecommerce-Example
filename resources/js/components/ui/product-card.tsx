import React from 'react';
import { QuantityControls } from './quantity-controls';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick
}) => {
  const { cartItems, updateQuantity, addItem } = useCart();
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleQuantityChange = (qty: number) => {
    if (qty <= 0) {
      updateQuantity(product.id, 0);
    } else if (cartItem) {
      updateQuantity(product.id, qty);
    } else {
      addItem(product, qty);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image Section */}
      <div className="relative aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Quantity Badge */}
        {quantity > 0 && (
          <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center shadow-md">
            {quantity}
          </div>
        )}
      </div>

      {/* Product Content Section */}
      <div className="p-4 space-y-3">
        {/* Product Name and Category Row */}
        <div className="flex justify-between items-start gap-2">
          <h3 
            className="font-medium text-base line-clamp-2 flex-1 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={() => onProductClick(product)}
          >
            {product.name}
          </h3>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-sm whitespace-nowrap">
            {product.category}
          </span>
        </div>

        {/* Price and Stock Row */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-gray-900">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>

        {/* Quantity Controls */}
        <div className="border border-gray-300 rounded-lg overflow-hidden w-1/2">
          <QuantityControls
            value={quantity}
            min={0}
            max={product.stock}
            onChange={handleQuantityChange}
          />
        </div>
      </div>
    </div>
  );
}; 