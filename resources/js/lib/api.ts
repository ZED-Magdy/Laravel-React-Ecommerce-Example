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
 * Fetch all categories from the API
 */
export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/categories');
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