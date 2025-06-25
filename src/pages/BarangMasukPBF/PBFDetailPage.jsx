import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/buttonComp";
import InputField from "../../components/inputField";
import Toast from "../../components/toast";
import { apiClient } from "../../config/api";

const formFields = [
  { label: "Tanggal Pesanan", key: "order_date", placeholder: "Tanggal Pemesanan", type: "date" },
  { label: "Tanggal Barang Masuk", key: "receipt_date", placeholder: "Tanggal Barang Masuk", type: "date" },
  { label: "Nama Supplier / PBF", key: "supplier_id", type: "select", optionsKey: "supplier" },
  { label: "Nomor Faktur", key: "invoice_number", placeholder: "Nomor Faktur", type: "phone"},
  {
    label: "Jenis Transaksi",
    key: "transaction_type",
    type: "select",
    options: ["Cash", "Kredit", "Konsinyasi"],
  },
  { label: "Tanggal Jatuh Tempo Pembayaran", key: "payment_due_date", placeholder: "Tanggal Jatuh Tempo", type: "date" },
  { label: "Catatan", key: "additional_notes", placeholder: "Catatan Tambahan" },
];

export default function PBFDetailPage() {
  const [toast, setToast] = useState(null);
  const [supplier, setSupplier] = useState([]);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const supplierRes = await apiClient.get("/suppliers/");
        const allSuppliers = supplierRes?.data?.data || [];
        const pbfSuppliers = allSuppliers.filter(supplier => supplier.type === "PBF");
        setSupplier(pbfSuppliers);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchDropdowns();
  }, []);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const generateKodeTransaksi = () => {
    const timestamp = Date.now();
    return `PBF-${timestamp}`;
  };

  const today = new Date().toISOString().split("T")[0];

  const handleNext = () => {
    const requiredKeys = formFields
      .filter((field) => field.key !== "note")
      .map((field) => field.key);

    const allFilled = requiredKeys.every((key) => form[key] && form[key].toString().trim() !== "");

    if (!allFilled) {
      setToast({
        message: "Mohon isi semua field wajib.",
        type: "error",
      });
      return;
    }

    const fullForm = {
      ...form,
      order_number: generateKodeTransaksi(),
    };

    localStorage.setItem("pbfForm", JSON.stringify(fullForm));
    console.log("pbfForm:", JSON.stringify(fullForm, null, 2));
    navigate("/pbf-list");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="bg-white min-h-screen">
        <Sidebar />
      </div>
      <div className="bg-white max-w-xl mx-auto w-full p-6 mt-10 border rounded-md border-gray-300 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Form Barang Masuk PBF</h1>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {formFields.map(({ label, key, placeholder, type, optionsKey, options }) => {
              const isTextArea = key === "additional_notes";

              if (type === "select") {
                let selectOptions = [];

                if (optionsKey === "supplier") {
                  selectOptions = supplier.map((sup) => ({
                    id: sup.id,
                    name: sup.name,
                  }));
                } else if (Array.isArray(options)) {
                  selectOptions = options.map((val) => ({
                    id: val,
                    name: val,
                  }));
                }

                return (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">{label}</label>
                    <select
                      value={form[key] || ""}
                      onChange={handleChange(key)}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Pilih {label}</option>
                      {selectOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (isTextArea) {
                return (
                  <div key={key} className="flex flex-col col-span-full">
                    <label className="text-sm font-medium mb-1">{label}</label>
                    <textarea
                      value={form[key] || ""}
                      onChange={handleChange(key)}
                      placeholder={placeholder}
                      rows={4}
                      className="border border-gray-300 rounded-md px-3 py-2 resize-none bg-[var(--neutral-200,#E5E5E5)]"
                    />
                  </div>
                );
              }

              return (
                <InputField
                  key={key}
                  label={label}
                  value={form[key] || ""}
                  onChange={handleChange(key)}
                  placeholder={placeholder}
                  type={type || "text"}
                  min={type === "date" ? today : undefined}
                />
              );
            })}
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mt-6">
          <Button className="w-full" onClick={handleNext}>
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
