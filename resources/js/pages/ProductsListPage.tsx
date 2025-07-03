import React from 'react';
import { FilterPopup } from '@/components/ui/filter-popup';
import { ProductDetails } from '@/components/ui/product-details';
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
      {/* Breadcrumb */}
      <div className="container mx-auto px-20 py-4">
        <div className="flex items-center text-sm">
          <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Casual</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-20">
        {/* Rest of the content */}
        <div className="flex justify-between space-y-6">
          {/* Search and Filter Area */}
          <div className="bg-white shadow-sm rounded-lg p-6 w-full md:w-3/4">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name"
                  className="w-full h-[46px] pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Title and Filter */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Casual</h1>
                <div className="flex items-center space-x-4">
                  <FilterPopup onApplyFilters={setFilters} />
                </div>
              </div>
{/* Main products area */}
<div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {getQty(product.id) > 0 && (
                        <span className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                          {getQty(product.id)}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 
                          className="font-medium text-base line-clamp-2 flex-1 cursor-pointer"
                          onClick={() => handleProductClick(product)}
                        >
                          {product.name}
                        </h3>
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">${product.price}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>
                      <div className="border rounded-lg p-[1px]">
                        <QuantityControls
                          value={getQty(product.id)}
                          min={0}
                          max={product.stock}
                          onChange={(qty) => updateQuantity(product.id, qty)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                <button className="flex items-center text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  <button className="h-8 w-8 bg-black text-white rounded flex items-center justify-center">
                    1
                  </button>
                </div>
                <button className="flex items-center text-gray-400 hover:text-gray-600">
                  Next
                  <svg
                    className="h-4 w-4 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
              {/* Results Count */}
              <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} Products
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div className="hidden lg:block w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
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