import { useState } from "react";
import axios from "axios";

export default function useUnitActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUnitById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/units/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/unit/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
