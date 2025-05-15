import { useState } from "react";
import axios from "axios";

export default function useProductActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProductById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/products/${id}`, {
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

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
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
    getProductById,
    deleteProduct,
    loading,
    error,
  };
}
