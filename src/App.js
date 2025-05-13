import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MasterBarangPage from "./pages/MasterBarangPage";

/* 
 <Route path="/barang-masuk" element={<BarangMasukPage />} />
  <Route path="/barang-keluar" element={<BarangKeluarPage />} />
  <Route path="/laporan" element={<LaporanPage />} />
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<MasterBarangPage />} />
        
       
      </Routes>
    </Router>
  );
}

export default App;
