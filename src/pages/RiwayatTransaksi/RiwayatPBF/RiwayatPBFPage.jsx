import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import DataTable from "../../../components/tableCompo";
import useSearch from "../../../hooks/useSearch";
import Sidebar from "../../../components/Sidebar";
import ActionMenu from "../../../components/ActionMenu";
import Toast from "../../../components/toast";
import usePBFActions from "./PBFActions";
import { apiClient } from "../../../config/api";

function RiwayatPBFPage() {
  const [incomingProducts, setIncomingProducts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const { deletePBF, loading, error } = usePBFActions();

  const fetchIncomingProducts = async () => {
    console.log("[DEBUG] Fetching incoming PBF transactions from /incoming-pbf...");
    try {
      const response = await apiClient.get("/incoming-pbf");
      const data = response?.data?.data || response?.data?.error;

      console.log("[DEBUG] API Response:", data);
      if (!Array.isArray(data)) {
        console.warn("[WARN] Expected array but got:", typeof data, data);
      }

      return data;
    } catch (err) {
      console.error("[ERROR] Failed to fetch incoming PBF transactions:", err);
      throw err;
    }
  };

  const loadData = async () => {
    try {
      const data = await fetchIncomingProducts();
      setIncomingProducts(Array.isArray(data) ? data : []);
    } catch {
      setIncomingProducts([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteRequest = (id) => {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePBF(deleteTargetId);
      await loadData();
      setToast({ message: "Data berhasil dihapus", type: "success" });
    } catch (err) {
      setToast({ message: "Gagal menghapus data.", type: "error" });
    } finally {
      setIsConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    incomingProducts,
    [
      "order_number",
      "payment_status",
      "payment_due_date",
      "supplier.name",
      "invoice_number",
    ]
  );

  const columns = [
    { header: "Nomor Transaksi", accessor: "order_number" },
    { header: "Tanggal Transaksi", accessor: "order_date", isDate: true },
    { header: "Batas Pembayaran", accessor: "payment_due_date", isDate: true },
    { header: "Supplier", accessor: (row) => row.supplier?.name || "-" },
    { header: "Total Pembelian", accessor: "total_purchase", isCurrency: true },
    { header: "Status", accessor: "payment_status" },
    {
      header: "Pilih Aksi",
      accessor: "actions",
      isAction: true,
      render: (item) => (
        <ActionMenu
          actions={[
            { label: "Delete", onClick: () => handleDeleteRequest(item.id) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex">
      <div className="bg-white min-h-screen">
        <Sidebar />
      </div>

      <div className="p-5 w-full py-10">
        <h1 className="text-2xl font-bold mb-6">Riwayat Pemesanan Barang PBF</h1>

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

        {/* Optional: Toast display */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Optional: Delete confirmation UI */}
        {isConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <p className="mb-4">Yakin ingin menghapus transaksi ini?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiwayatPBFPage;
