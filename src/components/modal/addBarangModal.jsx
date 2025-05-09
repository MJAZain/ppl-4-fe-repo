import React, { useState } from "react";
import Modal from "./modal";
import InputField from "../inputField";
import Button from "../buttonComp";

const initialFormState = {
  nama: "",
  sku: "",
  kategori: "",
  stok: "",
  hargaBeli: "",
  hargaJual: "",
  kadaluarsa: "",
  isi: "",
  merk: "",
  lokasi: "",
  satuan: "",
  barcode: "",
};

function AddBarangModal({ isOpen, close, onSubmit }) {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = () => {
    const allFilled = Object.values(form).every((val) => val.trim() !== "");
    if (!allFilled) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit(form);
    setForm(initialFormState);
    close();
  };

  const numericFields = ["stok", "hargaBeli", "hargaJual", "isi"];

  return (
    <Modal isOpen={isOpen} close={close}>
      <h2 className="text-xl font-semibold mb-4 text-center">Tambah Barang</h2>

      <div className="grid grid-cols-2 max-h-[60vh] overflow-y-auto pr-2 gap-5">
        {Object.keys(initialFormState).map((key) => (
            <InputField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={form[key]}
                onChange={handleChange(key)}
                placeholder={`Masukkan ${key}`}
                type={numericFields.includes(key) ? "number" : "text"}
                className="w-full h-10"
            />
        ))}

      </div>
      <div className="grid grid-cols-2 pr-5 max-h-[60vh] overflow-y-auto gap-5 py-5">
        <Button onClick={close} className="bg-gray-200 text-black border-none">
          Batal
        </Button>
        <Button onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}

export default AddBarangModal;
