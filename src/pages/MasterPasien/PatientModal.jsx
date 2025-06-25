import React, { useState, useEffect } from "react";
import Modal from "../../components/modal/modal";
import InputField from "../../components/inputField";
import Button from "../../components/buttonComp";
import { apiClient } from "../../config/api";
import Toast from "../../components/toast";
import { getFriendlyErrorMessage } from "../../utils/errorHandler";

const fields = [
  { accessor: "full_name", label: "Nama Pasien" },
  { accessor: "gender", label: "Jenis Kelamin", type:"select", options:["Pria", "Wanita"] },
  { accessor: "place_of_birth", label: "Tempat Lahir" },
  { accessor: "date_of_birth", label: "Tanggal Lahir", type: "date" },
  { accessor: "address", label: "Alamat" },
  { accessor: "phone_number", label: "No. Hp", type: "phone" },
  { accessor: "patient_type", label: "Jenis Pasien" },
  { accessor: "identity_number", label: "NIK", type:"phone" },
  { accessor: "guarantor_name", label: "Nama Penjamin" },
  {
    accessor: "status",
    label: "Status",
    type: "select",
    options: ["Aktif", "Tidak Aktif"],
  },
];

export default function PatientModal({
  isOpen,
  close,
  onSuccess,
  mode = "add",
  patient = null,
}) {
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
    if (mode === "edit" && patient) {
      const base = generateInitialFormState();
      setForm({ ...base, ...patient });
    } else {
      setForm(generateInitialFormState());
    }
  }, [mode, patient]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    const allFilled = Object.values(form).every(
      (val) => val?.toString().trim() !== ""
    );
    if (!allFilled) {
      setToast({ message: "Semua kolom harus diisi.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit" && patient?.id) {
        await apiClient.put(`/patients/${patient.id}`, form);
        setToast({ message: "Pasien berhasil diperbarui!", type: "success" });
      } else {
        await apiClient.post("/patients/", form);
        setToast({ message: "Pasien berhasil ditambahkan!", type: "success" });
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
        {mode === "edit" ? "Edit Pasien" : "Tambah Pasien"}
      </h2>

      <div className="max-h-[60vh] overflow-y-auto pr-2 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {fields.map(({ accessor, label, type, options }) => {
            if (type === "select") {
              return (
                <div key={accessor} className="flex flex-col mb-4">
                  <label className="text-sm font-medium mb-1">{label}</label>
                  <select
                    value={form[accessor]}
                    onChange={handleChange(accessor)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Pilih {label} </option>
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
                label={label}
                value={form[accessor]}
                onChange={handleChange(accessor)}
                placeholder={label}
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
