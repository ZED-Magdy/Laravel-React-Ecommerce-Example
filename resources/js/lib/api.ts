import { authFetch } from './auth';

export interface ProductFilters {
  search?: string;
  price_min?: number;
  price_max?: number;
  categories?: number[];
}

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutRequest {
  items: CartItem[];
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  title: string;
  image_url: string;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  order_number: number;
  items: OrderItem[];
}

export interface OrderInList {
  id: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  order_number: number;
}

export interface OrdersResponse {
  data: OrderInList[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
  links: {
    first: string;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

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
 * Generic authenticated API request function
 */
async function authenticatedApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await authFetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Authenticated API request failed:', error);
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
 * Next order number API interface
 */
export interface NextOrderNumberResponse {
  order_number: number;
}

/**
 * Fetch the next order number for the authenticated user
 */
export async function getNextOrderNumber(): Promise<NextOrderNumberResponse> {
  return authenticatedApiRequest<NextOrderNumberResponse>('/next-order-number');
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

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * Calculate cart totals
 */
export async function calculateCart(items: CartItem[]): Promise<CartTotals> {
  const response = await fetch(`${API_BASE_URL}/calculate-cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate cart totals');
  }

  return response.json();
}


/**
 * Create a new order (checkout)
 */
export async function checkout(data: CheckoutRequest): Promise<Order> {
  const response = await authFetch(`${API_BASE_URL}/checkout`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create order');
  }

  return response.json();
} 

/**
 * Get orders list
 */
export async function getOrders(page: number = 1): Promise<OrdersResponse> {
  const response = await authFetch(`${API_BASE_URL}/orders?page=${page}`);
  return response.json();
}

export async function getOrderDetails(orderId: number): Promise<Order> {
  const response = await authFetch(`${API_BASE_URL}/orders/${orderId}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Please login to view order details');
    } else if (response.status === 404) {
      throw new Error('Order not found');
    } else {
      throw new Error(errorData.error || 'Failed to fetch order details');
    }
  }

  return response.json();
} 