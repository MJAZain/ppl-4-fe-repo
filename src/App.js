import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MasterBarangPage from "./pages/MasterBarangPage";
import BarangMasukPage from './pages/BarangMasukPage';
import RegisterUserPage from "./pages/RegisterPage";
import AturSatuanPage from "./pages/AturSatuanPage";

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
        <Route path="/satuan" element={<AturSatuanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
