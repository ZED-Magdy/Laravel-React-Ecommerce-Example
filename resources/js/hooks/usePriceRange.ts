import { useState, useEffect } from 'react';
import { getMinMaxProductsPrice, PriceRange } from '@/lib/api';

export const usePriceRange = () => {
  const [priceRange, setPriceRange] = useState<PriceRange>({ min_price: 0, max_price: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceRange = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMinMaxProductsPrice();
      setPriceRange(data);
    } catch (err) {
      console.error('Error fetching price range:', err);
      setError('Failed to fetch price range');
      // Set default values on error
      setPriceRange({ min_price: 0, max_price: 1000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceRange();
  }, []);

  return {
    priceRange,
    loading,
    error,
    refetch: fetchPriceRange
  };
}; 