import React, { useState } from "react";
import InputField from "../components/inputField";
import Button from "../components/buttonComp";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function BarangMasukPage() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    namaBatch: "",
    namaSupplier: "",
    noTelepon: "",
    alamat: "",
    jenisPesanan: "",
  });

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleNext = () => {
    const allFilled = Object.values(form).every((val) => val.trim() !== "");
    if (!allFilled) {
      alert("Mohon isi semua field.");
      return;
    }

    navigate("/");
    console.log("Data form:", form);
  };

  return (
    <div className="flex">
        
        <Sidebar />
        <div className="bg-white max-w-xl mx-auto w-full p-5 border rounded-md border-gray-300 translate-y-7">
            <h1 className="text-2xl font-bold text-center mb-6">Barang Masuk</h1>

            <div className="space-y-5">
            <InputField
            label="Nama Batch"
            value={form.namaBatch}
            onChange={handleChange("namaBatch")}
            placeholder="Masukkan Nama Batch"
            className="w-full h-10"
            />
            <InputField
            label="Nama Supplier"
            value={form.namaSupplier}
            onChange={handleChange("namaSupplier")}
            placeholder="Masukkan Nama Supplier"
            className="w-full h-10"
            />
            <InputField
            label="No. Telepon"
            value={form.noTelepon}
            onChange={handleChange("noTelepon")}
            placeholder="Masukkan No. Telepon"
            type="tel"
            className="w-full h-10"
            />
            <InputField
            label="Alamat"
            value={form.alamat}
            onChange={handleChange("alamat")}
            placeholder="Masukkan Alamat"
            className="w-full h-20"
            />
            <InputField
            label="Jenis Pesanan"
            value={form.jenisPesanan}
            onChange={handleChange("jenisPesanan")}
            placeholder="Masukkan Jenis Pesanan"
            className="w-full h-20"
            />
            </div>

            <div className="mt-6 text-center">
                <Button className="w-full" onClick={handleNext}>Selanjutnya</Button>
            </div>
        </div>
    </div>
  );
}
