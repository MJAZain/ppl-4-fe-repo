import React, { useState, useEffect } from "react";
import useSearch from "../../hooks/useSearch";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../../config/api";
import { PlusIcon } from "@heroicons/react/24/solid";

import ActionMenu from "../../components/ActionMenu";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/tableCompo";
import Sidebar from "../../components/Sidebar";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/toast";

import KaryawanModal from "./KaryawanModal";
import useKaryawanActions from "./useKaryawanActions";

function AturKaryawanPage() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalUser, setModalUser] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const navigate = useNavigate();
  const { getUserById, deleteUser, reactivateUser, deactivateUser } = useKaryawanActions();

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users/");
      return response.data;
    } catch (err) {
      setToast({ message: "Data gagal diambil", type: "error" });
      console.error("Fetch error:", err);
      return [];
    }
  };

  const reloadUsers = async () => {
    const data = await fetchUsers();
    const items = Array.isArray(data) ? data : data?.data || [];
    setUserList(items);
  };

  useEffect(() => {
    reloadUsers().finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setModalUser(null);
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      const user = await getUserById(id);
      setModalUser(user);
      setModalMode("edit");
      setModalOpen(true);
    } catch (err) {
      setToast({ message: "Data karyawan gagal diambil", type: "error" });
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(deleteTargetId.id);
      await reloadUsers();
      setToast({ message: "Karyawan berhasil dinonaktifkan", type: "success" });
    } catch (err) {
      alert("Gagal menonaktifkan karyawan.");
    } finally {
      setIsConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

    const handleActivateRequest = async (id) => {
    try {
        await reactivateUser(id);
        setToast({ message: "User berhasil diaktifkan.", type: "success" });

        const data = await fetchUsers();
        if (Array.isArray(data)) {
        setUserList(data);
        } else if (Array.isArray(data?.data)) {
        setUserList(data.data);
        }
    } catch (err) {
        setToast({
        message: err.response?.data?.message || err.message || "Gagal mengaktifkan user.",
        type: "error",
        });
    }
    };

  const handleDeactivateRequest = async (id) => {
    console.log("Deactivating user ID:", id);

    try {
      await deactivateUser(id);
      setToast({ message: "User berhasil dinonaktifkan.", type: "success" });

      const data = await fetchUsers();
      if (Array.isArray(data)) {
        setUserList(data);
      } else if (Array.isArray(data?.data)) {
        setUserList(data.data);
      }
    } catch (err) {
      console.error("Deactivation error:", err);
      setToast({
        message: err.response?.data?.message || err.message || "Gagal menonaktifkan user.",
        type: "error",
      });
    }
  };

  const handleModalSuccess = async () => {
    await reloadUsers();
    setToast({
      message:
        modalMode === "edit"
          ? "Data berhasil diperbarui"
          : "Data berhasil ditambahkan",
      type: "success",
    });
    setModalOpen(false);
    setModalUser(null);
  };

  const { searchTerm, setSearchTerm, filteredData } = useSearch(userList, [
    "full_name",
    "specialty",
    "email",
  ]);

const columns = [
    { header: "Nama", accessor: "full_name" },
    { header: "Peran", accessor: "role" },
    { header: "Nomor HP", accessor: "phone" },
    { header: "NIP", accessor: "nip"},
    { header: "Email", accessor: "email" },
    {
        header: "Status",
        accessor: "active",
        render: (row) => (
            <span
            className={`px-2 py-1 rounded text-xs font-semibold
                ${row.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
            {row.active ? "Aktif" : "Nonaktif"}
            </span>
        )
    },
    {
        header: "Pilih Aksi",
        accessor: "actions",
        isAction: true,
        render: (row) => {
            const baseActions = [
            { label: "Edit", onClick: () => openEditModal(row.id)},
            { label: "Hapus", onClick: () => handleDeleteRequest(row) },
            ];

            const statusAction = row.active
            ? { label: "Non-Aktifkan", onClick: () => handleDeactivateRequest(row.id) }
            : { label: "Aktifkan", onClick: () => handleActivateRequest(row.id) };

            return <ActionMenu actions={[...baseActions, statusAction]} />;
        },
    }
  ];

  if (loading) return <div className="text-center mt-6">Loading...</div>;

  return (
    <div className="flex">
      <div className="bg-white min-h-screen">
        <Sidebar />
      </div>

      <div className="p-5 w-full py-10">
        <h1 className="text-2xl font-bold mb-6">Daftar Karyawan</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <div className="border-1 rounded-md border-gray-300 bg-white p-5">
          <div className="flex gap-4 mb-4">
            <button
              onClick={openAddModal}
              className="flex items-center text-blue-700 font-semibold space-x-1 bg-transparent border border-blue-700 py-2 px-4 rounded-md"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Tambah Karyawan</span>
            </button>
          </div>

          <div className="max-w-[1121px]">
            <DataTable columns={columns} data={filteredData} showIndex={true} />
          </div>
        </div>
      </div>

      <KaryawanModal
        isOpen={modalOpen}
        close={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        karyawan={modalUser}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        description="Apakah Anda yakin ingin menghapus karyawan ini?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default AturKaryawanPage;
