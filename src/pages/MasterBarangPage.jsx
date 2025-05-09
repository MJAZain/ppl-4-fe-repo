import React, { useState } from "react";
import useBarangData from "../hooks/useBarangData";
import useSearch from "../hooks/useSearch";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/tableCompo";
import Button from "../components/buttonComp";
import AddBarangModal from "../components/modal/addBarangModal";

function PageBarang() {
  const { data, loading } = useBarangData();
  const [barangList, setBarangList] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { searchTerm, setSearchTerm, filteredData } = useSearch(data, [
    "nama",
    "sku",
    "kategori",
    "merk",
  ]);

  const columns = [
    { header: "Nama", accessor: "nama" },
    { header: "SKU", accessor: "sku" },
    { header: "Kategori", accessor: "kategori" },
    { header: "Stok", accessor: "stok" },
    { header: "Harga Beli", accessor: "hargaBeli" },
    { header: "Harga Jual", accessor: "hargaJual" },
    { header: "Kadaluarsa", accessor: "kadaluarsa"},
    { header: "Isi", accessor: "isi" },
    { header: "Merk", accessor: "merk" },
    { header: "Lokasi", accessor: "lokasi" },
    { header: "Satuan", accessor: "satuan" },
    { header: "Barcode", accessor: "barcode" },
  ];

  const handleAddBarang = (newItem) => {
    setBarangList((prev) => [...prev, newItem]);
  };

  if (loading) return <div className="text-center mt-6">Loading...</div>;

  return (
    <div className="p-10">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Tambah Barang</Button>
        <Button>Stock Opname</Button>
      </div>
      <div className="">
        <DataTable columns={columns} data={filteredData} showIndex={true} />
      </div>

      <AddBarangModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        onSubmit={handleAddBarang}
      />
    </div>
  );
}

export default PageBarang;
