import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MasterBarangPage from "./pages/MasterBarangPage";
import BarangMasukPage from './pages/BarangMasukPage';
import RegisterUserPage from "./pages/RegisterPage";
import AturSatuanPage from "./pages/AturSatuanPage";
import AturKategoriPage from "./pages/AturKategoriPage";
import AturUsersPage from "./pages/UserManagementPage";
import BarangMasukDetailPage from "./pages/BarangMasukDetail";

/* 
 
  <Route path="/barang-keluar" element={<BarangKeluarPage />} />
  <Route path="/laporan" element={<LaporanPage />} />
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterUserPage />} />
        <Route path="/dashboard" element={<MasterBarangPage />} />
        <Route path="/barang-masuk" element={<BarangMasukPage />} />
        <Route path="/barang-masuk-detail" element={<BarangMasukDetailPage />} />
        <Route path="/satuan" element={<AturSatuanPage />} />
        <Route path="/kategori" element={<AturKategoriPage />} />
        <Route path="/user" element={<AturUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
