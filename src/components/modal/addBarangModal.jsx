import React, { useState, useEffect } from "react";
import Modal from "./modal";
import InputField from "../inputField";
import Button from "../buttonComp";
import { apiClient } from "../../config/api";
import Toast from "../toast";

const initialFormState = {
  name: "",
  code: "",
  barcode: "",
  category_id: "",
  unit_id: "",
  package_content: "",
  purchase_price: "",
  selling_price: "",
  wholesale_price: "",
  stock_buffer: "",
  storage_location: "",
  brand: "",
};


function AddBarangModal({ isOpen, close, onSubmit }) {
  const [form, setForm] = useState(initialFormState);
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await apiClient.get("/categories/");
        setCategories(res.data.data); // assuming res.data is an array
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    // Fetch units
    const fetchUnits = async () => {
      setLoadingUnits(true);
      try {
        const res = await apiClient.get("/units/");
        setUnits(res.data.data);
      } catch (err) {
        console.error("Failed to fetch units", err);
      } finally {
        setLoadingUnits(false);
      }
    };

    if (isOpen) {
      fetchCategories();
      fetchUnits();
    }
  }, [isOpen]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
  const allFilled = Object.values(form).every(val => val.toString().trim() !== "");
  if (!allFilled) {
    alert("Please fill in all fields.");
    return;
  }

  // Prepare payload with correct types and keys
  const payload = {
      ...form,
      category_id: Number(form.category_id),
      unit_id: Number(form.unit_id),
      package_content: Number(form.package_content),
      purchase_price: Number(form.purchase_price),
      selling_price: Number(form.selling_price),
      wholesale_price: Number(form.wholesale_price),
      stock_buffer: Number(form.stock_buffer),
    };

    try {
      await apiClient.post("/products/", payload);

      setToast({ message: "Barang berhasil ditambahkan.", type: "success" });
      setForm(initialFormState);
      close();
      onSubmit?.();
    } catch (error) {
      if (error.response) {
        setToast({ message: error.response.data.message || "Gagal menambahkan barang.", type: "error" });
        console.error("Error submitting barang:", error.response.data);
      } else {
        setToast({ message: "Gagal menambahkan barang.", type: "error" });
        console.error("Error submitting barang:", error);
      }
    }
  };

  const numericFields = [
    "stok_buffer",
    "selling_price",
    "purchase_price",
    "wholesale_price",
  ];

  return (
    <Modal isOpen={isOpen} close={close}>
      <h2 className="text-xl font-semibold mb-4 text-center">Tambah Barang</h2>

      <div className="grid grid-cols-2 max-h-[60vh] overflow-y-auto pr-2 gap-5">
        {Object.keys(initialFormState).map((key) => {
          // For category_id and unit_id render select dropdown
          if (key === "category_id") {
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-1 font-medium">Category</label>
                {loadingCategories ? (
                  <p>Loading categories...</p>
                ) : (
                  <select
                    value={form.category_id}
                    onChange={handleChange(key)}
                    className="w-full h-10 border rounded px-2"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          }

          if (key === "unit_id") {
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-1 font-medium">Unit</label>
                {loadingUnits ? (
                  <p>Loading units...</p>
                ) : (
                  <select
                    value={form.unit_id}
                    onChange={handleChange(key)}
                    className="w-full h-10 border rounded px-2"
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          }

          // Default input field for others
          return (
            <InputField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChange={handleChange(key)}
              placeholder={`Masukkan ${key}`}
              type={numericFields.includes(key) ? "number" : "text"}
              className="w-full h-10"
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 pr-5 max-h-[60vh] overflow-y-auto gap-5 py-5">
        <Button
          onClick={() => setForm(initialFormState)}
          className="bg-gray-200 text-black border-none"
        >
          Reset
        </Button>
        <Button onClick={handleSubmit}>Simpan</Button>
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

export default AddBarangModal;
