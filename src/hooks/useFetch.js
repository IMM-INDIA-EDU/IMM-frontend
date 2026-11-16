import { useState, useEffect, useMemo } from "react";
import { API_ENDPOINTS } from "../lib/api";

// Simple cache to prevent duplicate requests
const requestCache = new Map();

export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  useEffect(() => {
    const cacheKey = `${endpoint}-${JSON.stringify(memoizedOptions)}`;
    
    // Check if we already have this data in cache
    if (requestCache.has(cacheKey)) {
      const cachedData = requestCache.get(cacheKey);
      setData(cachedData);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.API}${endpoint}`, {
          ...memoizedOptions,
          headers: {
            "Content-Type": "application/json",
            ...memoizedOptions.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Cache the result
        requestCache.set(cacheKey, result);
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, memoizedOptions]);

  return { data, loading, error };
};

// Example usage with query parameters
export const useQueryFetch = (endpoint, queryParams = {}, options = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullEndpoint = `${endpoint}${queryString ? `?${queryString}` : ""}`;

  return useFetch(fullEndpoint, options);
};
