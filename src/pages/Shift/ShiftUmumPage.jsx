import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Button from "../components/buttonComp";
import InputField from "../components/inputField";
import Toast from "../components/toast";

const formFields = [
  { label: "Tanggal Shift", key: "shift_date", placeholder: "Tanggal Shift" },
  { label: "Petugas Pembuka", key: "opening_officer_id", placeholder: "Pilih Petugas Pembuka", type: "select" }, 
  { label: "Waktu Mulai Shift", key: "opening_time", placeholder: "Jam Mulai Shift" }, 
  { label: "Saldo Kas Awal", key: "opening_balance", placeholder: "Saldo Kas Awal" }, 
  { label: "Petugas Penutup", key: "closing_officer_id", placeholder: "Pilih Petugas Pembuka", type: "select" },
  { label: "Jenis Shift", key: "status", placeholder: "Pilih Jenis Shift", type: "select" },   
];

export default function ShiftUmumPage() {
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleNext = () => {
    const allFilled = Object.values(form).every((val) => val.trim() !== "");
    if (!allFilled) {
      setToast({
        message: "Mohon isi semua field.",
        type: "error",
      });
      return;
    }
    localStorage.setItem("shiftForm", JSON.stringify(form));
    navigate("/shift-detail");
  };


  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="bg-white min-h-screen">
        <Sidebar />
      </div>

      <div className="bg-white max-w-xl mx-auto w-full p-6 mt-10 border rounded-md border-gray-300 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Shift</h1>

      <div className="pr-2">
        <div className="gap-4 w-full">
          {formFields.map(({ label, key, placeholder, type, optionsKey }) => {
            const isTextArea = key.includes("description");

            if (type === "select") {
              const optionsRaw = {
                brands,
                drugCategories,
                units,
                categories,
                storageLocations,
              }[optionsKey];
              const options = Array.isArray(optionsRaw) ? optionsRaw : [];

              return (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{label}</label>
                  <select
                    value={form[key]}
                    onChange={handleChange(key)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Pilih {label}</option>
                    {options.map((opt) => (
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
                    value={form[key]}
                    onChange={handleChange(key)}
                    placeholder={placeholder}
                    rows={4}
                    className="border border-gray-300 rounded-md px-3 py-2 resize-none"
                  />
                </div>
              );
            }

            return (
              <InputField
                key={key}
                label={label}
                value={form[key]}
                onChange={handleChange(key)}
                placeholder={placeholder}
                type={type || "text"}
              />
            );
          })}
        </div>
      </div>


        <div className="mt-6">
          <Button className="w-full" onClick={handleNext}>
            Selanjutnya
          </Button>
        </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}        
      </div>
    </div>
  );
}
