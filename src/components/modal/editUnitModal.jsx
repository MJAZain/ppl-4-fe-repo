import React, { useEffect, useState } from "react";
import Modal from "./modal";
import InputField from "../inputField";
import Button from "../buttonComp";
import useUnitActions from "../../hooks/useUnitAction";
import { apiClient } from "../../config/api";

export default function EditUnitModal({ isOpen, close, unitId, onSuccess }) {
  const [form, setForm] = useState({ nama: "", deskripsi: "" });
  const { getUnitById } = useUnitActions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unitId && isOpen) {
      (async () => {
        try {
          const data = await getUnitById(unitId);
          setForm({ nama: data.nama, deskripsi: data.deskripsi || "" });
        } catch {
          alert("Gagal mengambil data satuan");
        }
      })();
    }
  }, [unitId, isOpen, getUnitById]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await apiClient.put(`/units/${unitId}`, form);
        onSuccess();
      } catch (err) {
        alert(err.message || "Gagal mengedit satuan");
      } finally {
        setLoading(false);
      }
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Satuan</h2>
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
        <Button onClick={close} className="bg-gray-200 text-black">
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </Modal>
  );
}
