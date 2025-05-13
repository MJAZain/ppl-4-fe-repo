import React, { useState, useEffect } from "react";
import useBarangData from "../hooks/useBarangData";
import useSearch from "../hooks/useSearch";
import useUnitActions from "../hooks/useMasterAction";

import ActionMenu from "../components/ActionMenu";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/tableCompo";
import Button from "../components/buttonComp";
import AddBarangModal from "../components/modal/addBarangModal";
import EditBarangModal from "../components/modal/editBarangModal";
import Sidebar from "../components/Sidebar";


function MasterBarangPage() {
  const { data, loading } = useBarangData();
  const [barangList, setBarangList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const { getUnitById, deleteUnit } = useUnitActions();

  useEffect(() => {
    setBarangList(data);
  }, [data]);

  const handleEdit = (id) => {
    setEditId(id);
    setEditOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus data?");
    if (!confirm) return;

    try {
      await deleteUnit(id);
      setBarangList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  const handleEditSuccess = () => {
    setEditOpen(false);
  };

  const { searchTerm, setSearchTerm, filteredData } = useSearch(barangList, [
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
    { header: "Kadaluarsa", accessor: "kadaluarsa" },
    { header: "Isi", accessor: "isi" },
    { header: "Merk", accessor: "merk" },
    { header: "Lokasi", accessor: "lokasi" },
    { header: "Satuan", accessor: "satuan" },
    { header: "Barcode", accessor: "barcode" },
    {
      header: "Pilih Aksi",
      accessor: "actions",
      isAction: true,
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "Edit", onClick: () => handleEdit(row.id) },
            { label: "Delete", onClick: () => handleDelete(row.id) },
          ]}
        />
      ),
    },
  ];

  const handleAddBarang = (newItem) => {
    setBarangList((prev) => [...prev, newItem]);
  };

  if (loading) return <div className="text-center mt-6">Loading...</div>;

  return (
    <div className="p-0 m-0">

      <Sidebar />

      <div className="p-5 fixed">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <div className="flex gap-4 mb-4">
          <Button onClick={() => setIsModalOpen(true)}>Tambah Barang</Button>
          <Button>Stock Opname</Button>
        </div>

        <DataTable columns={columns} data={filteredData} showIndex={true} />
      </div>
      

      <AddBarangModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        onSubmit={handleAddBarang}
      />

      <EditBarangModal
        isOpen={isEditOpen}
        close={() => setEditOpen(false)}
        unitId={editId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

export default MasterBarangPage;
