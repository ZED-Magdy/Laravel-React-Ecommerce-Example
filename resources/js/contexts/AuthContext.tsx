import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { login as apiLogin, logout as apiLogout, getCurrentUser, getStoredUser, isAuthenticated, LoginCredentials, LoginResponse } from '@/lib/auth';

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
  | { type: 'LOGIN_FAILURE'; payload: { error: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: { user: User } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INITIALIZE'; payload: { user: User | null; isAuthenticated: boolean } };

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload.error,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Auth context interface
interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const authenticated = isAuthenticated();

        if (authenticated && storedUser) {
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await getCurrentUser();
            dispatch({ 
              type: 'INITIALIZE', 
              payload: { 
                user: currentUser, 
                isAuthenticated: true 
              } 
            });
          } catch (error) {
            // Token is invalid, clear stored data
            apiLogout();
            dispatch({ 
              type: 'INITIALIZE', 
              payload: { 
                user: null, 
                isAuthenticated: false 
              } 
            });
          }
        } else {
          dispatch({ 
            type: 'INITIALIZE', 
            payload: { 
              user: null, 
              isAuthenticated: false 
            } 
          });
        }
      } catch (error) {
        dispatch({ 
          type: 'INITIALIZE', 
          payload: { 
            user: null, 
            isAuthenticated: false 
          } 
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response: LoginResponse = await apiLogin(credentials);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: { error: errorMessage } 
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    apiLogout();
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Refresh user function
  const refreshUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const user = await getCurrentUser();
      dispatch({ type: 'SET_USER', payload: { user } });
    } catch (error) {
      // Token might be invalid, logout user
      logout();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  // Context value
  const value: AuthContextType = {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    logout,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 