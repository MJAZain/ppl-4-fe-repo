import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Button from "../components/buttonComp";
import InputField from "../components/inputField";

const initialFormState = {
  date: "",
  supplier: "",
  no_faktur: "",
};

const labelMap = {
  date: "Tanggal",
  supplier: "Nama Supplier",
  no_faktur: "NSFP",
};

export default function BarangMasukPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleNext = () => {
  const allFilled = Object.values(form).every((val) => val.trim() !== "");
  if (!allFilled) {
    alert("Mohon isi semua field.");
    return;
  }

  localStorage.setItem("barangMasukForm", JSON.stringify(form)); // ✅ Save to localStorage
  navigate("/barang-masuk-detail");
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="bg-white max-w-xl mx-auto w-full p-6 mt-10 border rounded-md border-gray-300 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Barang Masuk</h1>

        {/* Dynamically render input fields */}
        <div className="space-y-4">
          {Object.keys(form).map((key) => (
            <InputField
              key={key}
              label={labelMap[key] || key}
              value={form[key]}
              onChange={handleChange(key)}
              placeholder={`Masukkan ${labelMap[key] || key}`}
              className="w-full h-10"
            />
          ))}
        </div>

        <div className="mt-6">
          <Button className="w-full" onClick={handleNext}>
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
