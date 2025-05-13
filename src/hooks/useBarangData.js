import { useEffect, useState } from "react";
import axios from "axios";

export default function useBarangData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get("/api/units", {
          headers: {
            // include this if auth token is required
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(response.data); // adjust based on actual response shape
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  return { data, loading, error };
}
