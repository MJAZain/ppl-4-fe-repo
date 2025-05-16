import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Button from "../components/buttonComp";
import DataTable from "../components/tableCompo";
import ActionMenu from "../components/ActionMenu";
import AddUnitModal from "../components/modal/addUnitModal";
import EditUnitModal from "../components/modal/editUnitModal";
import useSearch from "../hooks/useSearch";
import useUnitActions from "../hooks/useUnitAction";
import ConfirmDialog from "../components/ConfirmDialog";
import Sidebar from "../components/Sidebar";
import { apiClient } from "../config/api";

function AturSatuanPage() {
  const [units, setUnits] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { getUnitById, deleteUnit } = useUnitActions();

  const fetchUnits = async () => {
    try {
      const response = await apiClient.get("/units/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch units", error);
      throw error;
    }
    };

    useEffect(() => {
      const loadUnits = async () => {
        try {
          const data = await fetchUnits();

          if (Array.isArray(data)) {
            setUnits(data);
          } else if (Array.isArray(data?.data)) {
            setUnits(data.data);
          } else {
            console.error("Unexpected data format:", data);
            setUnits([]);
          }

        } catch (error) {
          console.error("Error loading units", error);
          setUnits([]); // fallback
        }
      };

      loadUnits();
    }, []);

  const handleEdit = (id) => {
    setEditId(id);
    setIsEditOpen(true);
  };

  const handleDeleteRequest = (unit) => {
    setDeleteTarget(unit);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUnit(deleteTarget.id);
      await fetchUnits();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleSuccess = () => {
    fetchUnits();
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const { searchTerm, setSearchTerm, filteredData } = useSearch(units, ["nama"]);

  const columns = [
    { header: "Satuan", accessor: "name" },
    { header: "Deskripsi", accessor: "description" },
    {
      header: "Aksi",
      accessor: "actions",
      isAction: true,
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "Edit", onClick: () => handleEdit(row.id) },
            { label: "Hapus", onClick: () => handleDeleteRequest(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-5 w-full">
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

        <AddUnitModal
          isOpen={isAddOpen}
          close={() => setIsAddOpen(false)}
          onSuccess={handleSuccess}
        />

        <EditUnitModal
          isOpen={isEditOpen}
          close={() => setIsEditOpen(false)}
          unitId={editId}
          onSuccess={handleSuccess}
        />

        <ConfirmDialog
          isOpen={isConfirmOpen}
          title={`Konfirmasi penghapusan ${deleteTarget?.nama}`}
          description={`Apakah Anda yakin ingin menghapus ${deleteTarget?.nama} dari daftar satuan?`}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}

export default AturSatuanPage;
