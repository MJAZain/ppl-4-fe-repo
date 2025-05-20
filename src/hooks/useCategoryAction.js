import { useState, useCallback } from "react";
import { apiClient } from "../config/api";

export default function useCategoryActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryById = useCallback(
    (id) => {
      return handleRequest(() =>
        apiClient.get(`/categories/${id}`).then(res => res.data.data)
      );
    },
    [handleRequest]
  );

  const deleteCategory = useCallback(
    (id) => {
      return handleRequest(() => apiClient.delete(`/categories/${id}`));
    },
    [handleRequest]
  );

  return {
    getCategoryById,
    deleteCategory,
    loading,
    error,
  };
}
