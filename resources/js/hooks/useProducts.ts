import { useState, useEffect, useCallback, useRef } from 'react';
import { getProducts, transformProductsForComponent, ProductFilters } from '@/lib/api';
import { Product } from '@/types/product';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  refetch: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  fetchPrevPage: () => Promise<void>;
}

/**
 * Custom hook for managing products data with filtering and pagination
 */
export function useProducts(filters: ProductFilters = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  // Track last filters to prevent unnecessary API calls
  const lastFiltersRef = useRef<string>('');

  const fetchProducts = useCallback(async (customFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use provided filters or current filters
      const filtersToUse = customFilters || filters;
      
      // Fetch products and categories concurrently
      const productsResponse = await getProducts(filtersToUse);
      
      // Transform products for component usage
      const transformedProducts = transformProductsForComponent(
        productsResponse.data,
      );
      
      setProducts(transformedProducts);
      setPagination({
        currentPage: productsResponse.meta.current_page,
        totalPages: productsResponse.meta.last_page,
        totalItems: productsResponse.meta.total,
        hasNext: productsResponse.links.next !== null,
        hasPrev: productsResponse.links.prev !== null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      
      // Fallback to empty state if API fails
      setProducts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Remove filters dependency to prevent recreation

  const refetch = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const fetchNextPage = useCallback(async () => {
    if (pagination.hasNext) {
      await fetchProducts({ ...filters, page: pagination.currentPage + 1 });
    }
  }, [pagination.hasNext, pagination.currentPage]); // Remove filters dependency

  const fetchPrevPage = useCallback(async () => {
    if (pagination.hasPrev) {
      await fetchProducts({ ...filters, page: pagination.currentPage - 1 });
    }
  }, [pagination.hasPrev, pagination.currentPage]); // Remove filters dependency

  // Fetch products when filters change
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    if (filtersString !== lastFiltersRef.current) {
      
      lastFiltersRef.current = filtersString;
      fetchProducts(filters);
    }
  }, [filters]); // Remove fetchProducts from dependencies

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
    fetchNextPage,
    fetchPrevPage,
  };
} 