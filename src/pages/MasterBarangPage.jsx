import React, { useState, useEffect } from "react";
import useBarangData from "../hooks/useBarangData";
import useSearch from "../hooks/useSearch";
import useProductActions from "../hooks/useProductsAction";

import ActionMenu from "../components/ActionMenu";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/tableCompo";
import Button from "../components/buttonComp";
import AddBarangModal from "../components/modal/addBarangModal";
import EditBarangModal from "../components/modal/editBarangModal";
import Sidebar from "../components/Sidebar";
import ConfirmDialog from "../components/ConfirmDialog";


function MasterBarangPage() {
  const { data, loading } = useBarangData();
  const [barangList, setBarangList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);


  const { getProductById, deleteProduct } = useProductActions();

  useEffect(() => {
    setBarangList(data);
  }, [data]);

  const handleEdit = async (id) => {
  try {
      const product = await getProductById(id);
      setEditId(id);
      setEditOpen(true);
    } catch (err) {
      alert("Gagal mengambil data produk.");
    }
  };

  const handleDeleteRequest = (id) => {
  setDeleteTargetId(id);
  setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(deleteTargetId);
      setBarangList((prev) => prev.filter((item) => item.id !== deleteTargetId));
    } catch (err) {
      alert("Gagal menghapus data.");
    } finally {
      setIsConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTargetId(null);
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
    { header: "Nama", accessor: "name" },
    { header: "SKU", accessor: "code" },
    { header: "Barcode", accessor: "barcode" },
    { header: "Kategori", accessor: "category_id" },
    { header: "Satuan", accessor: "unit_id" },
    { header: "Isi", accessor: "package_content" },
    { header: "Harga Beli", accessor: "purchase_price" },
    { header: "Harga Jual", accessor: "selling_price" },
    { header: "Harga Grosir", accessor: "wholesale_price" },
    { header: "Stok Buffer", accessor: "stock_buffer" },
    { header: "Lokasi", accessor: "storage_location" },
    { header: "Merk", accessor: "brand" },
    {
      header: "Pilih Aksi",
      accessor: "actions",
      isAction: true,
      render: (item) => (
        <ActionMenu
          actions={[
            { label: "Edit", onClick: () => handleEdit(item.id) },
            { label: "Delete", onClick: () => handleDeleteRequest(item.id) },
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
    <div className="flex">
      
      <Sidebar />
      
      <div className="p-5 w-full">
        <h1 className="text-2xl font-bold mb-6">Daftar Barang</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <div className=" border-1 rounded-md border-gray-300 bg-white p-5">
          <div className="flex gap-4 mb-4">
            <Button onClick={() => setIsModalOpen(true)}>Tambah Barang</Button>
            <Button>Stock Opname</Button>
          </div>

        <DataTable columns={columns} data={filteredData} showIndex={true} />
        </div>
     </div>
      

      <AddBarangModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        onSubmit={handleAddBarang}
      />

      <EditBarangModal
        isOpen={isEditOpen}
        close={() => setEditOpen(false)}
        productId={editId}
        onSuccess={handleEditSuccess}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        description="Apakah Anda yakin ingin menghapus obat ini?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default MasterBarangPage;
