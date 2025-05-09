import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MasterBarangPage from "./pages/MasterBarangPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/master-barang" element={<MasterBarangPage />} />
      </Routes>
    </Router>
  );
}

export default App;
