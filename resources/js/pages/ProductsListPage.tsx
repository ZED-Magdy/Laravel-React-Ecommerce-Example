import React from 'react';
import { FilterPopup } from '@/components/ui/filter-popup';
import { ProductDetails } from '@/components/ui/product-details';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { QuantityControls } from '@/components/ui/quantity-controls';
import { OrderSummary } from '@/components/ui/order-summary';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const ProductsListPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    priceRange: 0,
    categories: [] as string[],
  });
  const [cart, setCart] = React.useState<Record<number, number>>({});

  // Mock products data
  const products: Product[] = [
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      price: 145,
      image: "https://picsum.photos/400/400?random=1",
      category: "T-shirts",
      stock: 25,
    },
    {
      id: 2,
      name: "Polo with Tipping Details",
      price: 180,
      image: "https://picsum.photos/400/400?random=2",
      category: "Polo",
      stock: 18,
    },
    {
      id: 3,
      name: "Black Striped T-shirt",
      price: 120,
      image: "https://picsum.photos/400/400?random=3",
      category: "T-shirts",
      stock: 30,
    },
    {
      id: 4,
      name: "Classic Blue Jeans",
      price: 200,
      image: "https://picsum.photos/400/400?random=4",
      category: "Jeans",
      stock: 15,
    },
    {
      id: 5,
      name: "Plaid Flannel Shirt",
      price: 160,
      image: "https://picsum.photos/400/400?random=5",
      category: "Shirts",
      stock: 22,
    },
    {
      id: 6,
      name: "Orange Cotton T-shirt",
      price: 110,
      image: "https://picsum.photos/400/400?random=6",
      category: "T-shirts",
      stock: 28,
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= (filters.priceRange || 300);
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes('all') || 
      filters.categories.includes(product.category.toLowerCase());
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleAddToCart = (quantity: number) => {
    // Implement cart functionality
    console.log(`Added ${quantity} of ${selectedProduct?.name} to cart`);
    setIsDetailsOpen(false);
  };

  const updateQuantity = (id: number, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: qty };
    });
  };

  const getQty = (id: number) => cart[id] ?? 0;

  const handleAddOne = (id: number, stock: number) => {
    updateQuantity(id, Math.min(getQty(id) + 1, stock));
  };

  const handleRemoveItem = (id: number) => {
    updateQuantity(id, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FilterPopup onApplyFilters={setFilters} />
              <h1 className="text-2xl font-bold">Products</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
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
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[400px]">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by product name"
              />
            </div>
            <div className="flex-1 text-sm text-gray-500 flex items-center">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main products area */}
            <div className="flex-1 space-y-6">
              {/* top_area remains including search etc */}
              {/* Use filteredProducts.map to render cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col"
                  >
                    <div
                      className="relative aspect-square"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {getQty(product.id) > 0 && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                          {getQty(product.id)}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-base line-clamp-2 flex-1" onClick={() => handleProductClick(product)}>
                          {product.name}
                        </h3>
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded self-start">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-lg">${product.price}</span>
                        <span className="text-gray-500">Stock: {product.stock}</span>
                      </div>
                      <QuantityControls
                        value={getQty(product.id)}
                        min={0}
                        max={product.stock}
                        onChange={(qty) => updateQuantity(product.id, qty)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Order summary */}
            <div className="hidden lg:block lg:w-80 xl:w-96">
              <OrderSummary
                cart={cart}
                products={products}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        </div>

        <ProductDetails
          product={selectedProduct}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}; 