
import DangKy from './components/DangKy';
import DangNhap from './components/DangNhap';
import Homepage from './components/homepage/homepage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuenMatKhau from './components/QuenMatKhau';
import NhapMaOTP from './components/NhapMaOTP';
import NhapMatKhauMoi from './components/NhapMatKhauMoi';
import ChiTietSanPham from './components/ChiTietSanPham';

function App() {

  return (
  
   <BrowserRouter>
      {" "}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dangnhap" element={<DangNhap />} />
        <Route path="/dangky" element={<DangKy />} />
        <Route path="/quenmatkhau" element={<QuenMatKhau />} />
        <Route path="/nhapmaotp" element={<NhapMaOTP />} />
        <Route path="/nhapmatkhaumoi" element={<NhapMatKhauMoi />} />
        <Route path="/chitietsanpham" element={<ChiTietSanPham />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
