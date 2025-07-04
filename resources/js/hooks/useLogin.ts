import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/lib/auth';

/**
 * Custom hook for login functionality
 * Provides login state management and submission
 */
export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, loading: authLoading, error: authError } = useAuth();

  const submitLogin = async (credentials: LoginCredentials) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await login(credentials);
      // Login successful - user will be redirected by the auth context
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    isSubmitting,
    submitError,
    isLoading: authLoading || isSubmitting,
    globalError: authError,
    
    // Actions
    submitLogin,
    clearSubmitError: () => setSubmitError(null),
  };
}