import React, { useEffect, useState } from "react";
import Button from "../../components/buttonComp";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/tableCompo";
import ActionMenu from "../../components/ActionMenu";
import PBFProductModal from "./PBFProductModal";
import { apiClient } from "../../config/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/toast";
import { useParams } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../utils/errorHandler";
import Select from "../../components/SelectComp";

export default function PBFProductListPage() {
  const [paymentStatus, setPaymentStatus] = useState("Belum Lunas");
  const [toast, setToast] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [barangList, setBarangList] = useState(() => {
    const saved = localStorage.getItem("barangList");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const storedForm = JSON.parse(localStorage.getItem("pbfForm") || "null");
    if (storedForm) {
      setFormData(storedForm);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await apiClient.get(`/incoming-pbf/${id}`);
          const data = res.data?.data;

          if (data) {
            setFormData({
              order_date: data.order_date,
              order_number: data.order_number,
              supplier_id: data.supplier_id,
              invoice_number: data.invoice_number,
              transaction_type: data.transaction_type,
              receipt_date: data.receipt_date,
              payment_due_date: data.payment_due_date,
              additional_notes: data.additional_notes,
            });

            setPaymentStatus(data.payment_status || "Belum Lunas");

            const detailItems = data.details.map((item) => ({
              product: {
                id: item.product_id,
                name: item.product_name,
                code: item.product_code,
                unit: { name: item.unit },
              },
              quantity: item.quantity,
              purchase_price: item.purchase_price,
              product_batch: item.batch_number,
              expiry: item.expiry_date,
            }));

            setBarangList(detailItems);
          }
        } catch (error) {
          console.error("Failed to fetch PBF detail:", error);
          setToast({ message: "Gagal memuat data untuk edit", type: "error" });
        }
      } else {
        const storedForm = JSON.parse(localStorage.getItem("pbfForm") || "null");
        if (storedForm) setFormData(storedForm);

        const storedBarangList = JSON.parse(localStorage.getItem("barangList") || "null");
        if (storedBarangList) setBarangList(storedBarangList);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("barangList", JSON.stringify(barangList));
  }, [barangList]);

  const handleKembali = () => {
    if (id) {
      navigate(`/pbf-detail/${id}`);
    } else {
      localStorage.removeItem("pbfForm");
      localStorage.removeItem("barangList");
      navigate("/pbf-detail");
    }
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
    const updatedList = barangList.filter((item) => item.product?.id !== id);
    localStorage.setItem("barangList", JSON.stringify(updatedList));
    setBarangList(updatedList);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleTambahBarang = (item) => {
    setBarangList((prev) => [...prev, item]);
  };

  const calculateTotalPembelian = () => {
    return barangList.reduce((acc, item) => acc + item.quantity * item.purchase_price, 0);
  };

  const handleSave = async () => {
    try {
      const form = JSON.parse(localStorage.getItem("pbfForm"));
      const barangList = JSON.parse(localStorage.getItem("barangList"));

      if (!form || !barangList || barangList.length === 0) {
        setToast({
          message: "Mohon lengkapi form dan tambahkan setidaknya satu produk.",
          type: "error",
        });
        return;
      }

    const totalPurchase = calculateTotalPembelian();

    const formatDate = (date) => date ? new Date(date).toISOString().split("T")[0] : null;
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      order_date: formatDate(form.order_date),
      order_number: form.order_number,
      user_id:user?.id,
      transaction_code: form.order_number,
      receipt_date: formatDate(form.receipt_date),
      supplier_id: Number(form.supplier_id),
      invoice_number: form.invoice_number,
      transaction_type: form.transaction_type,
      payment_due_date: formatDate(form.payment_due_date),
      additional_notes: form.additional_notes || "",
      total_purchase: totalPurchase,
      payment_status: paymentStatus,
      details: barangList.map((item) => ({
        product_id: item.product.id,
        product_code: item.product.code || "",
        product_name: item.product.name || "",
        unit: item.product.unit?.name || "",
        quantity: item.quantity,
        purchase_price: item.purchase_price,
        total_price: item.quantity * item.purchase_price,
        batch_number: item.product_batch || "",
        expiry_date: formatDate(item.expiry),
      }))
    };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      if (id) {
          await apiClient.put(`/incoming-pbf/${id}`, payload);
          setToast({ message: "Transaksi berhasil diperbarui", type: "success" });
        } else {
          await apiClient.post("/incoming-pbf", payload);
          setToast({ message: "Barang masuk berhasil disimpan!", type: "success" });
      }

      localStorage.removeItem("pbfForm");
      localStorage.removeItem("barangList");
      navigate("/riwayat-pbf");

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
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Detail Pesanan Obat PBF" : "Detail Pesanan Obat PBF"}
        </h1>
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
            >
              Tambah Barang
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-black">Status Pembayaran:</label>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
              </Select>
            </div>
          </div>

        <div className="border border-gray-300 p-6 rounded-md bg-white min-h-[150px] w-full">
          {barangList.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-800 font-semibold font-[Open Sans] text-center">
                Mohon masukkan barang terlebih dahulu
              </p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={barangList} showIndex={true} />

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

        <PBFProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={(updatedList) => {
            setBarangList(updatedList);
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
          <button className="w-full bg-gray-200 border border-black text-black rounded-md py-2 hover:bg-gray-300 transition" onClick={handleKembali}>
            Kembali
          </button>
          <Button className="w-full" onClick={handleSave}>
            {id ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
