import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Button from "../components/buttonComp";
import DataTable from "../components/tableCompo";
import ActionMenu from "../components/ActionMenu";
import AddUnitModal from "../components/modal/addUnitModal";
import EditUnitModal from "../components/modal/editUnitModal";
import useSearch from "../hooks/useSearch";
import useUnitActions from "../hooks/useUnitAction";

function AturSatuanPage() {
  const [units, setUnits] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const { getUnitById, deleteUnit } = useUnitActions();

  const fetchUnits = async () => {
    try {
      const res = await fetch("/api/units", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUnits(data);
    } catch (err) {
      console.error("Failed to fetch units", err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleEdit = (id) => {
    setEditId(id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus satuan ini?")) {
      await deleteUnit(id);
      fetchUnits();
    }
  };

  const handleSuccess = () => {
    fetchUnits();
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const { searchTerm, setSearchTerm, filteredData } = useSearch(units, ["nama"]);

  const columns = [
    { header: "Satuan", accessor: "nama" },
    { header: "Deskripsi", accessor: "deskripsi" },
    {
      header: "Aksi",
      accessor: "actions",
      isAction: true,
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "Edit", onClick: () => handleEdit(row.id) },
            { label: "Hapus", onClick: () => handleDelete(row.id) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-center mb-6">Daftar Satuan</h1>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Cari Satuan"
      />

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddOpen(true)}>Tambah Satuan</Button>
      </div>

      <DataTable columns={columns} data={filteredData} showIndex={true} />

      <AddUnitModal isOpen={isAddOpen} close={() => setIsAddOpen(false)} onSuccess={handleSuccess} />
      <EditUnitModal isOpen={isEditOpen} close={() => setIsEditOpen(false)} unitId={editId} onSuccess={handleSuccess} />
    </div>
  );
}

export default AturSatuanPage;
