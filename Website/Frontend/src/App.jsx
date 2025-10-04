import DangKy from "./components/DangKy";
import DangNhap from "./components/DangNhap";
import Homepage from "./components/homepage/homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuenMatKhau from "./components/QuenMatKhau";
import NhapMaOTP from "./components/NhapMaOTP";
import NhapMatKhauMoi from "./components/NhapMatKhauMoi";
import ChiTietSanPham from "./components/ChiTietSanPham";
import ThanhToan from "./components/ThanhToan";
import XacNhanDonHang from "./components/XacNhanDonHang";
import GioHang from "./components/GioHang";
import HoSoNguoiDung from "./components/HoSoNguoiDung";
import LichSuMuaHang from "./components/LichSuMuaHang";
import ChiTietDonHang from "./components/ChiTietDonHang";

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
        <Route path="/thanhtoan" element={<ThanhToan />} />
        <Route path="/xacnhandonhang" element={<XacNhanDonHang />} />
        <Route path="/giohang" element={<GioHang />} />
        <Route path="/hosonguoidung" element={<HoSoNguoiDung />} />
        <Route path="/lichsumuahang" element={<LichSuMuaHang />} />
        <Route path="/chitietdonhang" element={<ChiTietDonHang />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
