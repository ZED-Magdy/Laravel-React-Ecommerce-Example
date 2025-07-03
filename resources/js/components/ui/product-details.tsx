import React from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1);

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          <div className="relative aspect-square w-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/80 hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-8 space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                <div className="text-2xl font-bold">${product.price}</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock</span>
                  <span>{product.stock} items</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Quantity</h3>
              <div className="flex items-center space-x-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </Button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                  disabled={product && quantity >= product.stock}
                  className="h-10 w-10 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="p-8 border-t">
            <Button
              className="w-full h-12 text-base font-medium"
              onClick={() => onAddToCart(quantity)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 