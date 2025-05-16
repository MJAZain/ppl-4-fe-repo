import { useState } from "react";
import { apiClient } from "../config/api";

export default function useCategoryActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategoryById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/categories/${id}`);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/categories/${id}`);
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCategoryById,
    deleteCategory,
    loading,
    error,
  };
}
