import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear form errors when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate('/'); // Redirect to home page on success
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="my-24 md:my-0 md:min-h-[calc(100vh-6.5rem)] flex items-center justify-center px-4">
      <Card className="bg-transparent shadow-none md:bg-white w-full max-w-md md:shadow-[0_0.125rem_0.5rem_0px_rgba(0,0,0,0.08)] rounded-md border-0 p-8">
        <div className="space-y-1 text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Please enter your details to sign in
          </p>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-black">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`h-12 text-sm border-gray-200 rounded-md px-3 placeholder:text-gray-500 ${
                formErrors.email ? 'border-red-500 focus:border-red-500' : ''
              }`}
              disabled={loading}
            />
            {formErrors.email && (
              <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-black">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`h-12 text-sm border-gray-200 rounded-md px-3 pr-10 placeholder:text-gray-500 ${
                  formErrors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 !my-6 bg-black hover:bg-black/80 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}; 