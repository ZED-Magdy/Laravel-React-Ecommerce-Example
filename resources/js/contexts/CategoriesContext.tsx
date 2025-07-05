import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCategories, transformCategoriesForFilter } from '@/lib/api';

interface FilterCategory {
  id: string;
  label: string;
}

interface CategoriesContextType {
  categories: FilterCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

interface CategoriesProviderProps {
  children: ReactNode;
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
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

  const value: CategoriesContextType = {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories(): CategoriesContextType {
  const context = useContext(CategoriesContext);
  
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  
  return context;
} 