import { useState, useEffect, useCallback } from 'react';

interface UrlParams {
  [key: string]: string | string[] | undefined;
}

/**
 * Custom hook for managing URL query parameters
 */
export function useUrlParams(): {
  params: UrlParams;
  setParam: (key: string, value: string | string[] | undefined) => void;
  setParams: (params: UrlParams) => void;
  clearParams: () => void;
  clearParam: (key: string) => void;
} {
  const [params, setParamsState] = useState<UrlParams>({});

  // Read current URL parameters
  const readParams = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const newParams: UrlParams = {};

    for (const [key, value] of searchParams.entries()) {
      // Handle multiple values for the same key (e.g., categories)
      if (newParams[key]) {
        if (Array.isArray(newParams[key])) {
          (newParams[key] as string[]).push(value);
        } else {
          newParams[key] = [newParams[key] as string, value];
        }
      } else {
        newParams[key] = value;
      }
    }

    setParamsState(newParams);
  }, []);

  // Update URL without page reload
  const updateUrl = useCallback((newParams: UrlParams) => {
    const searchParams = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.set(key, value);
        }
      }
    });

    const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  // Set a single parameter
  const setParam = useCallback((key: string, value: string | string[] | undefined) => {
    const newParams = { ...params, [key]: value };
    setParamsState(newParams);
    updateUrl(newParams);
  }, [params, updateUrl]);

  // Set multiple parameters
  const setParams = useCallback((newParams: UrlParams) => {
    const mergedParams = { ...params, ...newParams };
    setParamsState(mergedParams);
    updateUrl(mergedParams);
  }, [params, updateUrl]);

  // Clear all parameters
  const clearParams = useCallback(() => {
    setParamsState({});
    updateUrl({});
  }, [updateUrl]);

  // Clear a single parameter
  const clearParam = useCallback((key: string) => {
    const newParams = { ...params };
    delete newParams[key];
    setParamsState(newParams);
    updateUrl(newParams);
  }, [params, updateUrl]);

  // Initialize params on mount and listen for back/forward navigation
  useEffect(() => {
    readParams();

    const handlePopState = () => {
      readParams();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [readParams]);

  return {
    params,
    setParam,
    setParams,
    clearParams,
    clearParam,
  };
} 