import React, { useState } from "react";
import Modal from "./modal";
import InputField from "../inputField";
import Button from "../buttonComp";
import { apiClient } from "../../config/api";

const initialFormState = {
  nama: "",
  deskripsi: "",
};

export default function AddUnitModal({ isOpen, close, onSuccess }) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    const allFilled = Object.values(form).every((val) => val.trim() !== "");
    if (!allFilled) {
      alert("Semua field harus diisi.");
      return;
    }

    setLoading(true);
    try {
        await apiClient.post("/units/", form);
        onSuccess();
        setForm(initialFormState);
      } catch (err) {
        alert(err.message || "Gagal menambahkan satuan");
      } finally {
        setLoading(false);
      }
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <h2 className="text-xl font-semibold mb-4 text-center">Tambah Satuan</h2>
      <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-2">
        <InputField
          label="Nama"
          value={form.nama}
          onChange={handleChange("nama")}
          placeholder="Masukkan nama satuan"
        />
        <InputField
          label="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange("deskripsi")}
          placeholder="Masukkan deskripsi"
        />
      </div>
      <div className="grid grid-cols-2 gap-5 py-5 pr-2">
        <Button
          onClick={() => {
            setForm(initialFormState);
            close();
          }}
          className="bg-gray-200 text-black"
        >
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </Modal>
  );
}
