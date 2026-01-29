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

  const fetchApiResponse = useCallback(async () => {
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

      const res = await fetch(url, { method: "GET", headers });

      if (!res.ok) {
        throw new Error(`API failed: ${res.status}`);
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
    fetchApiResponse();
  }, [fetchApiResponse]);

  return { response, loading, error, refetch: fetchApiResponse };
};