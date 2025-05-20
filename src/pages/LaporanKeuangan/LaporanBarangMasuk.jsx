import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/tableCompo";
import useSearch from "../../hooks/useSearch";
import Sidebar from "../../components/Sidebar";
import { apiClient } from "../../config/api";

function LaporanBarangMasukPage() {
  const [incomingProducts, setIncomingProducts] = useState([]);

  // Fetch data from API
  const fetchIncomingProducts = async () => {
    try {
      const response = await apiClient.get("/incoming-products/");
      return response.data.data; // Extract the actual data array
    } catch (error) {
      console.error("Failed to fetch incoming products:", error);
      throw error;
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIncomingProducts();
        setIncomingProducts(Array.isArray(data) ? data : []);
      } catch {
        setIncomingProducts([]);
      }
    };

    loadData();
  }, []);

  // Search logic
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    incomingProducts,
    ["supplier", "no_faktur", "payment_status", "date"]
  );

  // Define columns for table
  const columns = [
    { header: "Tanggal", accessor: "date" },
    { header: "Nama Supplier", accessor: "supplier" },
    { header: "Total Pembelian Barang", accessor: "total_amount" },
    { header: "NSFP", accessor: "no_faktur" },
    { header: "Status", accessor: "payment_status" },
  ];

  return (
    <div className="flex">
      <div className="bg-white min-h-screen">
            <Sidebar />
            </div>

      <div className="p-5 w-full py-10">
        <h1 className="text-2xl font-bold mb-6">Laporan Barang Masuk</h1>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Cari berdasarkan supplier, faktur, status..."
        />

        <div className="border border-gray-400 rounded-xl bg-white p-5">
          <DataTable
            columns={columns}
            data={filteredData}
            showIndex={true}
          />
        </div>
      </div>
    </div>
  );
}

export default LaporanBarangMasukPage;
