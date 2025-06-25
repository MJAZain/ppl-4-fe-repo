import React, { useEffect, useState } from "react";
import Button from "../../components/buttonComp";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/tableCompo";
import ActionMenu from "../../components/ActionMenu";
import NonPBFProductModal from "./NonPBFProductModal";
import { apiClient } from "../../config/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/toast";
import { getFriendlyErrorMessage } from "../../utils/errorHandler";

export default function NonPBFProductListPage() {
  const [toast, setToast] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [nonpbfList, setNonPbfList] = useState(() => {
    const saved = localStorage.getItem("nonpbfList");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedForm = JSON.parse(localStorage.getItem("nonpbfForm") || "null");
    if (storedForm) {
      setFormData(storedForm);
    }
  }, []);

  useEffect(() => {
    const storedNonPbfList = JSON.parse(localStorage.getItem("nonpbfList") || "null");
    if (storedNonPbfList) {
      setNonPbfList(storedNonPbfList);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nonpbfList", JSON.stringify(nonpbfList));
  }, [nonpbfList]);

  const handleKembali = () => {
    localStorage.removeItem("nonpbfForm");
    localStorage.removeItem("nonpbfList");
    navigate("/non-pbf-detail");
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setModalOpen(true);
  };

  const handleDeleteRequest = (row) => {
    setItemToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete= (id) => {
    const updatedList = nonpbfList.filter((item) => item.product?.id !== id);
    localStorage.setItem("nonpbfList", JSON.stringify(updatedList));
    setNonPbfList(updatedList);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleTambahBarang = (item) => {
    setNonPbfList((prev) => [...prev, item]);
  };

  const calculateTotalPembelian = () => {
    return nonpbfList.reduce((acc, item) => acc + item.quantity * item.purchase_price, 0);
  };

  const handleSave = async () => {
    try {
      const form = JSON.parse(localStorage.getItem("nonpbfForm"));
      const nonpbfList = JSON.parse(localStorage.getItem("nonpbfList"));

      if (!form || !nonpbfList || nonpbfList.length === 0) {
        setToast({
          message: "Mohon lengkapi form dan tambahkan setidaknya satu produk.",
          type: "error",
        });
        return;
      }

    const totalPurchase = calculateTotalPembelian();
    
    const formatDate = (date) => date ? new Date(date).toISOString() : null;
    
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      order_date: formatDate(form.order_date),
      order_number: form.order_number,
      transaction_code: form.order_number,
      incoming_date: formatDate(form.receipt_date),
      supplier_name: form.supplier_name, // Ensure this is stored in the form/localStorage
      invoice_number: form.invoice_number,
      transaction_type: form.transaction_type,
      payment_due_date: formatDate(form.payment_due_date),
      additional_notes: form.additional_notes || "",
      total_purchase: totalPurchase,
      payment_status: "Belum Lunas",
      user_id: user?.id,
      officer_name: user?.full_name,
      details: nonpbfList.map((item) => ({
        product_id: item.product.id,
        product_code: item.product.code || "",
        product_name: item.product.name || "",
        unit: item.product.unit?.name || "",
        incoming_quantity: item.quantity,
        purchase_price: item.purchase_price,
        batch_number: form.order_number,
        expiry_date: formatDate(item.expiry),
      })),
    };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      await apiClient.post("/incoming-nonpbf", payload);

      setToast({ message: "Barang masuk berhasil disimpan!", type: "success" });

      localStorage.removeItem("nonpbfForm");
      localStorage.removeItem("nonpbfList");
      navigate("/non-pbf-detail");

    } catch (err) {
      console.error("Gagal menyimpan barang masuk:", err);
      const message = getFriendlyErrorMessage(err);
      setToast({ message, type: "error" });
    }
  };

  const columns = [
    { header: "Nama Obat", accessor: "product.name" },
    { header: "Kode Barang", accessor: "product.code" },
    {
      header: "Harga Beli Satuan",
      accessor: "purchase_price",
      render: (row) => {
        const value = row.purchase_price;
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
        return formatted.replace("Rp", "Rp.");
      },
    },
    { header: "Kode Batch", accessor: "product_batch" },
    { header: "Tanggal Kedaluwarsa", accessor: "expiry" },
    { header: "Kuantitas", accessor: "quantity" },
    {
      header: "Total Beli Produk",
      accessor: "computed_total_price",
      render: (row) => {
        const total = row.quantity * row.purchase_price;
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(total).replace("Rp", "Rp.");
      },
    },
    {
      header: "Aksi",
      accessor: "actions",
      isAction: true,
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "Edit", onClick: () => handleEdit(row) },
            { label: "Hapus", onClick: () => handleDeleteRequest(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Detail Pesanan Obat Non-PBF</h1>

        <div className="mb-4">
          <Button
            className="mb-4"
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
          >
            Tambah Barang
          </Button>
        </div>

        <div className="border border-gray-300 p-6 rounded-md bg-white min-h-[150px] w-full">
          {nonpbfList.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-800 font-semibold font-[Open Sans] text-center">
                Mohon masukkan barang terlebih dahulu
              </p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={nonpbfList} showIndex={true} />

              <div className="flex justify-end mt-4">
                <div className="text-right font-semibold text-lg">
                  Total Pembelian:{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(calculateTotalPembelian()).replace("Rp", "Rp.")}
                </div>
              </div>
            </>
          )}
        </div>

        <NonPBFProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={(updatedList) => {
            setNonPbfList(updatedList);
          }}
          initialData={editingItem}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <ConfirmDialog
          isOpen={confirmOpen}
          title="Hapus Produk"
          description="Apakah Anda yakin ingin menghapus produk ini dari daftar?"
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />

        <div className="flex justify-between mt-6 space-x-4">
          <Button className="w-full" onClick={handleKembali}>
            Kembali
          </Button>
          <Button className="w-full" onClick={handleSave}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
