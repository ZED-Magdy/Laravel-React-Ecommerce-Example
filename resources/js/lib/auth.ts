import { User } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = '/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Login user with email and password
 * Follows OpenAPI spec for /login endpoint
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle different error status codes as per OpenAPI spec
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (response.status === 422) {
        throw new Error(errorData.message || 'Validation failed');
      } else if (response.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }

    const data: LoginResponse = await response.json();
    
    // Store token and user data
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred. Please check your connection.');
  }
}

/**
 * Get current authenticated user
 * Follows OpenAPI spec for /user endpoint
 */
export async function getCurrentUser(): Promise<User> {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Authentication expired. Please login again.');
      }
      throw new Error('Failed to fetch user data');
    }

    const user: User = await response.json();
    
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred. Please check your connection.');
  }
}

/**
 * Logout user and clear stored data
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored authentication token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getStoredUser(): User | null {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Create authenticated fetch instance
 */
export function createAuthenticatedFetch() {
  return async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      window.location.href = '/login';
    }

    return response;
  };
}

export const authFetch = createAuthenticatedFetch(); 