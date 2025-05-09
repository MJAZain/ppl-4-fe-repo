import dummyBarang from "../data/dummyBarang";
import { useEffect, useState } from "react";

export default function useBarangData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData(dummyBarang);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return { data, loading, error: null };
}
