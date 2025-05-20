import React, { useEffect, useState } from "react";

export default function BarangMasukDetailPage() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("barangMasukForm");
    if (stored) {
      setFormData(JSON.parse(stored));
    }
  }, []);

  if (!formData) return <div>Loading data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Detail Barang Masuk</h1>
      <div className="space-y-2">
        <p><strong>Tanggal:</strong> {formData.date}</p>
        <p><strong>Nama Supplier:</strong> {formData.supplier}</p>
        <p><strong>No Faktur:</strong> {formData.no_faktur}</p>
      </div>
    </div>
  );
}
