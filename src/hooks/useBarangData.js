import { useEffect, useState } from "react";

export default function useBarangData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || result.status !== 200) {
          const message =
            result?.message || "Failed to fetch products from server.";
          throw new Error(message);
        }

        setData(result.data || []); // <-- use result.data based on your JSON
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { data, loading, error };
}
