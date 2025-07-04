import { useState, useEffect } from 'react';
import { getCategories, transformCategoriesForFilter } from '@/lib/api';

interface FilterCategory {
  id: string;
  label: string;
}

interface UseCategoriesReturn {
  categories: FilterCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing categories data
 * Fetches categories from API and transforms them for filter usage
 */
export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiCategories = await getCategories();
      const transformedCategories = transformCategoriesForFilter(apiCategories);
      
      setCategories(transformedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      
      // Fallback to default categories if API fails
      setCategories([
        { id: 'all', label: 'All' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
} 