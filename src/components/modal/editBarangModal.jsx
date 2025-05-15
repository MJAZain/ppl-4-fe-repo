import Modal from "./modal";
import InputField from "../inputField";
import Button from "../buttonComp";
import axios from "axios";
import React, { useEffect, useState } from "react";

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

function EditBarangModal({ isOpen, close, productId, onSuccess }) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const numericFields = ["stok", "hargaBeli", "hargaJual", "isi"];

  useEffect(() => {
    if (productId) {
      setLoading(true);
      axios
        .get(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setForm(res.data))
        .catch((err) => alert("Gagal mengambil data"))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/products/${productId}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onSuccess();
      close();
    } catch (err) {
      alert("Gagal mengedit data");
    }
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Barang</h2>

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
        <Button onClick={() => setForm(initialFormState)} className="bg-gray-200 text-black border-none">
          Reset
        </Button>
        <Button onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
}

export default EditBarangModal;
