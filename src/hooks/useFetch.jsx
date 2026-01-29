import { useEffect, useState, useCallback } from "react";
import { config } from "../config/config";

export const useFetch = ({ search = "", page = 1, limit = 10, append = false }) => {
  const [response, setResponse] = useState({
    products: [],
    total: 0,
    page,
    limit,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApiResponse = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);

      const url = config.isDevelopment
        ? `/api/task/products/search?${params.toString()}`
        : `${config.baseURL}/task/products/search?${params.toString()}`;

      const headers = {};
      headers["x-api-key"] = config.apiKey;

      const res = await fetch(url, { method: "GET", headers, signal });

      if (!res.ok) {
        const errorMessages = {
          404: "Products not found. Please try again later.",
          500: "Server error. Please try again later.",
          403: "Access denied. Please check your credentials.",
        };
        throw new Error(errorMessages[res.status] || `Unable to fetch products (Error ${res.status})`);
      }

      const data = await res.json();

      const products = Array.isArray(data) ? data : [];

      setResponse((prev) => ({
        products: append ? [...prev.products, ...products] : products,
        total: products.length,
        page,
        limit,
      }));
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(err.message);
      if (!append) {
        setResponse({
          products: [],
          total: 0,
          page,
          limit,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, append]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchApiResponse(abortController.signal);
    
    return () => {
      abortController.abort();
    };
  }, [fetchApiResponse]);

  const refetch = useCallback(() => {
    fetchApiResponse();
  }, [fetchApiResponse]);

  return { response, loading, error, refetch };
};