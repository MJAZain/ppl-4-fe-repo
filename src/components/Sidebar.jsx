import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showMaster, setShowMaster] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleMasterDropdown = () => setShowMaster((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative">
      {/* Hamburger Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="p-3 m-2 text-gray-700 hover:text-black"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-4">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold translate-x-20">EIMS</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`block px-4 py-2 rounded hover:bg-gray-100 ${
              isActive("/dashboard") ? "bg-gray-200" : ""
            }`}
          >
            Dashboard
          </Link>

          {/* Master Barang Dropdown */}
          <button
            onClick={toggleMasterDropdown}
            className="flex items-center justify-between w-full px-4 py-2 mt-2 rounded hover:bg-gray-100"
          >
            <span>Master Barang</span>
            {showMaster ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showMaster && (
            <div className="ml-4">
              <Link
                to="/barang-masuk"
                className={`block px-4 py-1 hover:bg-gray-100 rounded ${
                  isActive("/barang-masuk") ? "bg-gray-200" : ""
                }`}
              >
                Barang Masuk
              </Link>
              <Link
                to="/barang-keluar"
                className={`block px-4 py-1 hover:bg-gray-100 rounded ${
                  isActive("/barang-keluar") ? "bg-gray-200" : ""
                }`}
              >
                Barang Keluar
              </Link>
            </div>
          )}

          {/* Laporan Keuangan */}
          <Link
            to="/laporan-keuangan"
            className={`block px-4 py-2 mt-2 rounded hover:bg-gray-100 ${
              isActive("/laporan-keuangan") ? "bg-gray-200" : ""
            }`}
          >
            Laporan Keuangan
          </Link>

          {/*  */}
          <Link
            to="/satuan"
            className={`block px-4 py-2 mt-2 rounded hover:bg-gray-100 ${
              isActive("/satuan") ? "bg-gray-200" : ""
            }`}
          >
            Atur Satuan
          </Link>

          {/*  */}
          <Link
            to="/kategori"
            className={`block px-4 py-2 mt-2 rounded hover:bg-gray-100 ${
              isActive("/kategori") ? "bg-gray-200" : ""
            }`}
          >
            Atur Kategori
          </Link>

          {/* Logout */}
          <button
            className="block px-4 py-2 mt-6 text-red-600 hover:text-red-800"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
