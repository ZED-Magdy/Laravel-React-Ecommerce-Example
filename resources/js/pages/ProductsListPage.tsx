import React from 'react';
import { FilterPopup } from '@/components/ui/filter-popup';
import { ProductDetails } from '@/components/ui/product-details';
import { ProductCard } from '@/components/ui/product-card';
import { OrderSummary } from '@/components/ui/order-summary';
import { Product } from '@/types/product';

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
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format",
      category: "T-shirts",
      stock: 25,
    },
    {
      id: 2,
      name: "Polo with Tipping Details",
      price: 180,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&auto=format",
      category: "Polo",
      stock: 18,
    },
    {
      id: 3,
      name: "Black Striped T-shirt",
      price: 120,
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format",
      category: "T-shirts",
      stock: 30,
    },
    {
      id: 4,
      name: "Classic Blue Jeans",
      price: 200,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format",
      category: "Jeans",
      stock: 15,
    },
    {
      id: 5,
      name: "Plaid Flannel Shirt",
      price: 160,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&auto=format",
      category: "Shirts",
      stock: 22,
    },
    {
      id: 6,
      name: "Orange Cotton T-shirt",
      price: 110,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&auto=format",
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
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Breadcrumb */}
      <div className="mx-auto px-32 py-4">
        <div className="flex items-center text-sm">
          <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Casual</span>
        </div>
      </div>
      <div className="hidden md:block">
        <FilterPopup onApplyFilters={setFilters} />
      </div>
      <div className="mx-auto px-4 md:px-32">
        {/* Rest of the content */}
        <div className="flex justify-between space-y-6">
          {/* Search and Filter Area */}
          <div className="bg-white shadow-sm rounded-lg p-6 w-full md:w-3/4">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
              <div className="md:hidden absolute top-1.5 right-14">
                  <FilterPopup onApplyFilters={setFilters} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name"
                  className="w-full h-[52px] pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
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
              <div className="flex items-start">
                <h1 className="text-2xl font-bold">Casual</h1>
              </div>
            {/* Main products area */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getQty(product.id)}
                    onProductClick={handleProductClick}
                    onUpdateQuantity={updateQuantity}
                  />
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