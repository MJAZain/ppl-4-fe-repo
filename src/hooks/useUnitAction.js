import { useState } from "react";
import { apiClient } from "../config/api";

export default function useUnitActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUnitById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/units/${id}`);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/units/${id}`);
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getUnitById,
    deleteUnit,
    loading,
    error,
  };
}
