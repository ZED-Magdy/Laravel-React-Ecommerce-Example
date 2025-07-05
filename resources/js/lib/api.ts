const API_BASE_URL = '/api';

/**
 * Generic API request function
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Categories API interface
 */
export interface Category {
  id: number;
  title: string;
}

/**
 * Products API interface
 */
export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
  thumbnail: string | null;
}

export interface ProductsResponse {
  data: ApiProduct[];
  links: {
    first: string;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface ProductFilters {
  category_id?: number;
  categories?: number[];
  price_min?: number;
  price_max?: number;
  search?: string;
  page?: number;
}

/**
 * Fetch all categories from the API
 */
export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/categories');
}

/**
 * Fetch products from the API with filtering and pagination
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  
  // Add non-empty filters to search params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'categories' && Array.isArray(value)) {
        // Handle categories array as PHP-style array parameters
        value.forEach(categoryId => {
          if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
            searchParams.append('categories[]', categoryId.toString());
          }
        });
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const endpoint = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return apiRequest<ProductsResponse>(endpoint);
}

/**
 * Price range API interface
 */
export interface PriceRange {
  min_price: number;
  max_price: number;
}

/**
 * Fetch min and max product prices from the API
 */
export async function getMinMaxProductsPrice(): Promise<PriceRange> {
  return apiRequest<PriceRange>('/products/min-max-price');
}

/**
 * Transform API category data to filter format
 */
export function transformCategoriesForFilter(categories: Category[]) {
  const transformedCategories = [
    { id: 'all', label: 'All' },
    ...categories.map(category => ({
      id: category.id.toString(),
      label: category.title,
    })),
  ];
  
  return transformedCategories;
}

/**
 * Transform API product data to component format
 */
export function transformProductsForComponent(apiProducts: ApiProduct[]): any[] {
  return apiProducts.map(product => {
    return {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
      category: product.category || 'Unknown',
      stock: product.stock,
    };
  });
} 