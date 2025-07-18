import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { FilterPopup } from '@/components/ui/filter-popup';
import { ProductDetails } from '@/components/ui/product-details';
import { ProductCard } from '@/components/ui/product-card';
import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';
import { OrderSummary } from '@/components/ui/order-summary';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilters } from '@/lib/api';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useCart } from '@/contexts/CartContext';

export const ProductsListPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { cartItems, updateQuantity, addItem, removeItem } = useCart();
  
  // URL parameters management
  const { params, setParam, setParams, clearParams } = useUrlParams();
  
  // Separate search input state from URL state to avoid conflicts
  const [searchInputValue, setSearchInputValue] = useState('');
  const searchQuery = useDebounce(searchInputValue, 300);
  
  // Check if search is being debounced (user is typing but API hasn't been called yet)
  const isSearching = searchInputValue !== searchQuery;
  
  // Initialize search input from URL parameters
  useEffect(() => {
    const urlSearch = (params.search as string) || '';
    if (!isUpdatingUrlRef.current && urlSearch !== searchInputValue) {
      setSearchInputValue(urlSearch);
    }
  }, [params.search]); // Respond to URL parameter changes
  
  // Initialize filters from URL parameters
  const filters = useMemo(() => {
    const newFilters = {
      priceMin: params.price_min ? parseInt(params.price_min as string) : undefined,
      priceMax: params.price_max ? parseInt(params.price_max as string) : undefined,
      categories: params.categories ? 
        (Array.isArray(params.categories) ? params.categories : [params.categories]) : 
        [],
    };
    return newFilters;
  }, [params.price_min, params.price_max, params.categories]);

  // Track if we're updating URL ourselves to avoid loops
  const isUpdatingUrlRef = useRef(false);
  const lastUpdateRef = useRef<string>('');
  
  // Update URL when debounced search value changes
  useEffect(() => {
    if (!isUpdatingUrlRef.current && searchQuery !== lastUpdateRef.current) {
      isUpdatingUrlRef.current = true;
      lastUpdateRef.current = searchQuery;
      
      if (searchQuery.trim()) {
        setParam('search', searchQuery);
      } else {
        setParam('search', undefined);
      }
      
      // Reset flag after a microtask to allow URL update to complete
      Promise.resolve().then(() => {
        isUpdatingUrlRef.current = false;
      });
    }
  }, [searchQuery]); // Remove setParam from dependencies

  // Handle browser navigation (back/forward buttons) - only sync from external URL changes
  useEffect(() => {
    if (!isUpdatingUrlRef.current) {
      const urlSearch = (params.search as string) || '';
      // Only sync if URL search is different from our current input and user isn't typing
      if (urlSearch !== searchInputValue && !isSearching) {
        setSearchInputValue(urlSearch);
      }
    }
  }, [params.search, searchInputValue, isSearching]); // Include all dependencies

  // Create API filters from current state (not URL params directly)
  const apiFilters = useMemo<ProductFilters>(() => {
    const apiFilters: ProductFilters = {};
    
    // Add search filter from debounced search query
    if (searchQuery.trim()) {
      apiFilters.search = searchQuery.trim();
    }
    
    // Add price filters
    if (filters.priceMin !== undefined) {
      apiFilters.price_min = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      apiFilters.price_max = filters.priceMax;
    }
    
    // Add category filter
    if (filters.categories.length > 0 && !filters.categories.includes('all')) {
      // Convert categories to numbers and filter valid ones
      const validCategories = filters.categories
        .map(cat => parseInt(cat))
        .filter(cat => !isNaN(cat) && cat > 0);
      
      if (validCategories.length > 0) {
        apiFilters.categories = validCategories;
      }
    }
    
    return apiFilters;
  }, [searchQuery, filters.priceMin, filters.priceMax, filters.categories, isInitialized]);

  // Mark as initialized after URL params are loaded
  useEffect(() => {
    // Check if we have URL parameters or if this is the first load
    const hasUrlParams = window.location.search.length > 0;
    const hasLoadedParams = Object.keys(params).length > 0;
    
    if (!hasUrlParams || hasLoadedParams) {
      // Either no URL params to load, or they've been loaded
      setIsInitialized(true);
    }
  }, [params]);

  // Use the products hook with filters only after initialization
  const { 
    products, 
    loading, 
    error, 
    pagination, 
    refetch, 
    fetchNextPage, 
    fetchPrevPage 
  } = useProducts(isInitialized ? apiFilters : undefined);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  const handleApplyFilters = (newFilters: { priceMin?: number; priceMax?: number; categories: string[] }) => {
    const urlParams: { [key: string]: string | string[] | undefined } = {};
    
    // Keep existing search (use debounced value)
    if (searchQuery.trim()) {
      urlParams.search = searchQuery;
    }
    
    // Add price filters
    if (newFilters.priceMin !== undefined) {
      urlParams.price_min = newFilters.priceMin.toString();
    }
    if (newFilters.priceMax !== undefined) {
      urlParams.price_max = newFilters.priceMax.toString();
    }
    
    // Add categories filter
    if (newFilters.categories.length > 0 && !newFilters.categories.includes('all')) {
      urlParams.categories = newFilters.categories;
    } else {
      urlParams.categories = undefined; // Remove categories param if empty or 'all'
    }
    
    setParams(urlParams);
  };

  const handleClearFilters = () => {
    // Keep search but clear other filters
    if (searchQuery.trim()) {
      setParams({ search: searchQuery });
    } else {
      clearParams();
    }
  };

  const handleNextPage = () => {
    fetchNextPage();
  };

  const handlePrevPage = () => {
    fetchPrevPage();
  };

  // Show error state (only for initial load errors)
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen pb-12 bg-gray-50">
        <div className="mx-auto px-4 md:px-32 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-lg text-red-600 mb-4">Error: {error}</div>
            <button 
              onClick={() => refetch()}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Find the cart item for the selected product
  const selectedCartItem = selectedProduct ? cartItems.find(item => item.product.id === selectedProduct.id) : undefined;

  // Handler for add/update to cart from ProductDetails
  const handleAddOrUpdateCart = (quantity: number) => {
    if (!selectedProduct) return;
    if (selectedCartItem) {
      updateQuantity(selectedProduct.id, quantity);
    } else {
      addItem(selectedProduct, quantity);
    }
    setIsDetailsOpen(false);
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
        <FilterPopup 
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
        />
      </div>
      <div className="mx-auto px-4 md:px-32">
        {/* Rest of the content */}
        <div className="flex justify-between space-y-6 md:space-y-0 gap-2">
          {/* Search and Filter Area */}
          <div className="bg-white shadow-sm rounded-lg p-6 w-full md:w-3/4">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
              <div className="md:hidden absolute top-1.5 right-14">
                  <FilterPopup 
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    initialFilters={filters}
                  />
                </div>
                <input
                  type="text"
                    value={searchInputValue}
                    onChange={handleSearchChange}
                  placeholder="Search by product name"
                    className="w-full h-[52px] pl-10 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
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
                  {isSearching && (
                    <div className="absolute right-3 top-3.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
              </div>

              {/* Title and Filter */}
              <div className="flex items-start">
                <h1 className="text-2xl font-bold">Casual</h1>
              </div>

            {/* Main products area */}
              <div className="flex-1 relative">
                {/* Results Count */}
              <div className="text-sm mb-4 text-gray-500">
                Showing {products.length} of {pagination.totalItems} Products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Show skeletons when loading initial data */}
                  {loading && products.length === 0 && (
                    <>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                      ))}
                    </>
                  )}

                  {/* Show products */}
                  {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>

                {/* Loading overlay for pagination (when products exist) */}
                {loading && products.length > 0 && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* Empty state */}
                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No products found</div>
                    <div className="text-gray-400 text-sm mt-2">
                      Try adjusting your search or filters
                    </div>
                  </div>
                )}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                  <button 
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrev || loading}
                    className={`flex items-center ${
                      pagination.hasPrev && !loading
                        ? 'text-gray-600 hover:text-gray-800' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
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
                    <span className="text-sm text-gray-500">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                </div>
                  <button 
                    onClick={handleNextPage}
                    disabled={!pagination.hasNext || loading}
                    className={`flex items-center ${
                      pagination.hasNext && !loading
                        ? 'text-gray-600 hover:text-gray-800' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
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
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="hidden md:block w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <OrderSummary
                cart={Object.fromEntries(cartItems.map(item => [item.product.id, item.quantity]))}
                products={cartItems.map(item => item.product)}
                  onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                />
              </div>
            </div>
        </div>

        <ProductDetails
          product={selectedProduct}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          cartQuantity={selectedCartItem ? selectedCartItem.quantity : 0}
          onAddOrUpdateCart={handleAddOrUpdateCart}
        />
      </div>
    </div>
  );
}; 