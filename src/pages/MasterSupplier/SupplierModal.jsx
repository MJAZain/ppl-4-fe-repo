import React, { useState, useEffect } from "react";
import Modal from "../../components/modal/modal";
import InputField from "../../components/inputField";
import Button from "../../components/buttonComp";
import { apiClient } from "../../config/api";
import Toast from "../../components/toast";
import { getFriendlyErrorMessage } from "../../utils/errorHandler";

const fields = [
  { header: "Nama Supplier", accessor: "name" },
  { header: "Jenis Supplier", accessor: "type", type:"select", options:["PBF", "Non-PBF"]},
  { header: "Alamat Supplier", accessor: "address" },
  { header: "Nomor Supplier", accessor: "phone", type: "phone" },
  { header: "Email", accessor: "email" },
  { header: "Nama Kontak Person", accessor: "contact_person" },
  { header: "Nomor Kontak Person", accessor: "contact_number", type: "phone" },
  { header: "Provinsi", accessor: "province_id" },
  { header: "Kota", accessor: "city_id" },
  { header: "Status", accessor: "status", type:"select", options:["Aktif", "Tidak Aktif"] },
];

export default function SupplierModal({ isOpen, close, onSuccess, mode = "add", supplier = null }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({});

  const generateInitialFormState = () => {
    const state = {};
    fields.forEach(({ accessor }) => {
      state[accessor] = "";
    });
    return state;
  };

  useEffect(() => {
    if (mode === "edit" && supplier) {
      const base = generateInitialFormState();
      const populated = { ...base, ...supplier };

      fields.forEach(({ accessor }) => {
        if (typeof populated[accessor] === "object" && populated[accessor] !== null) {
          populated[accessor] = populated[accessor].id;
        }
      });

      setForm(populated);
    } else {
      setForm(generateInitialFormState());
    }
  }, [mode, supplier]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    const allFilled = Object.values(form).every((val) => val?.toString().trim() !== "");
    if (!allFilled) {
      setToast({ message: "Semua kolom harus diisi.", type: "error" });
      return;
    }

    const payload = { ...form };
    setLoading(true);
    try {
      if (mode === "edit" && supplier?.id) {
        await apiClient.put(`/suppliers/${supplier.id}`, payload);
        setToast({ message: "Supplier berhasil diperbarui!", type: "success" });
      } else {
        await apiClient.post("/suppliers/", payload);
        setToast({ message: "Supplier berhasil ditambahkan!", type: "success" });
      }

      onSuccess();
      close();
    } catch (err) {
      const message = getFriendlyErrorMessage(err);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} contentClassName="w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center py-5">
        {mode === "edit" ? "Edit Supplier" : "Tambah Supplier"}
      </h2>
      <div className="max-h-[60vh] overflow-y-auto pr-2 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {fields.map(({ header, accessor, type, options }) => {
            const isTextArea = accessor.includes("address");
            if (isTextArea) {
              return (
                <div key={accessor} className="flex flex-col col-span-full">
                  <label className="text-sm font-medium mb-1">{header}</label>
                  <textarea
                    value={form[accessor]}
                    onChange={handleChange(accessor)}
                    placeholder={header}
                    rows={3}
                    className="border border-gray-300 rounded-md px-3 py-2 resize-none bg-[var(--neutral-200,#E5E5E5)]"
                  />
                </div>
              );
            }

            if (type === "select") {
              return (
                <div key={accessor} className="flex flex-col mb-4">
                  <label className="text-sm font-medium mb-1">{header}</label>
                  <select
                    value={form[accessor]}
                    onChange={handleChange(accessor)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Pilih {header} </option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <InputField
                key={accessor}
                label={header}
                value={form[accessor]}
                onChange={handleChange(accessor)}
                placeholder={header}
                type={type || "text"}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Menyimpan..." : mode === "edit" ? "Update" : "Simpan"}
        </Button>
        <button
          onClick={() => setForm(generateInitialFormState())}
          className="w-full bg-gray-200 border border-black text-black rounded-md py-2 hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Modal>
  );
}
