import React, { useEffect, useState } from "react";
import Modal from "./modal"
import InputField from "../inputField"
import { apiClient } from "../../config/api";
import Button from "../buttonComp";

export default function TambahBarangModal({ isOpen, onClose, onSave, initialData = null }) {
  const [selectedProduct, setSelectedProduct] = useState(initialData?.product || null);
  const [quantity, setQuantity] = useState(initialData?.quantity || "");
  const [price, setPrice] = useState(initialData?.price || "");

  const [productOptions, setProductOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);


  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/products/");
      setProductOptions(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProductOptions([]);
    }
  };

  if (isOpen) {
    fetchProducts();
  }
}, [isOpen]);

  const filteredProducts = productOptions.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
   const newItem = {
      product: selectedProduct,
      quantity: Number(quantity),
      price: Number(price),
    };

    const existing = JSON.parse(localStorage.getItem("barangList") || "[]");

    let updated;
    if (initialData) {
      updated = existing.map((item) =>
        item.product.id === initialData.product.id ? newItem : item
      );
    } else {
      updated = [...existing, newItem];
    }

    localStorage.setItem("barangList", JSON.stringify(updated));
    onSave(updated);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} close={onClose}>
      <h2 className="text-xl font-semibold mb-4">Tambah Barang</h2>

      <InputField
        label="Cari Produk"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Nama produk"
        className="w-full mb-2 h-10"
      />

      <div className="border p-2 rounded mb-4 max-h-40 overflow-y-auto">
        {filteredProducts.map((product) => (
  <li
    key={product.id}
    className="p-2 hover:bg-gray-100 cursor-pointer border-b"
    onClick={() => {
      setSelectedProduct(product);
      setSearchTerm(product.name);
    }}
  >
    <div className="font-medium">{product.name}</div>
    <div className="text-sm text-gray-600">{product.code} – {product.brand}</div>
  </li>
))}

      </div>

      <InputField
        label="Kuantitas"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Jumlah yang dibeli"
        className="w-full h-10"
      />

      <InputField
        label="Harga Total"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Harga total pembelian"
        className="w-full h-10"
      />

      <Button
        onClick={handleSave}
      >
        Simpan
      </Button>
    </Modal>
  );
}
