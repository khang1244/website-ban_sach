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
import DoiMatKhau from "./components/DoiMatKhau";
import LichSuMuaHang from "./components/LichSuMuaHang";
import ChiTietDonHang from "./components/ChiTietDonHang";
import KetQuaTimKiemSach from "./components/KetQuaTimKiem";
import AdminLayout from "./components/admin/AdminLayout";
import QuanLyChung from "./components/admin/QuanLyChung";
import QuanLySach from "./components/admin/QuanLySach";
import QuanLyDanhMuc from "./components/admin/QuanLyDanhMuc";
import QuanLyKhuyenMai from "./components/admin/QuanLyKhuyenMai";
import QuanLyPhuongThucGiaoHang from "./components/admin/QuanLyPhuongThucGiaoHang";
import QuanLyDonHang from "./components/admin/QuanLyDonHang";
import QuanLyNguoiDung from "./components/admin/QuanLyNguoiDung";
import QuanLyBinhLuan from "./components/admin/QuanLyBinhLuan";
import QuanLyTonKho from "./components/admin/QuanLyTonKho";
import BaoVeTuyenDuong from "./components/bao-ve/BaoVeTuyenDuong";

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
        <Route path="/chitietsanpham/:sachID" element={<ChiTietSanPham />} />
        <Route path="/thanhtoan" element={<ThanhToan />} />
        <Route path="/xacnhandonhang" element={<XacNhanDonHang />} />
        <Route path="/giohang" element={<GioHang />} />
        <Route path="/hosonguoidung" element={<HoSoNguoiDung />} />
        <Route path="/doimatkhau" element={<DoiMatKhau />} />
        <Route path="/lichsumuahang" element={<LichSuMuaHang />} />
        <Route path="/chitietdonhang/:id" element={<ChiTietDonHang />} />
        <Route path="/ketquatimkiemsach" element={<KetQuaTimKiemSach />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <BaoVeTuyenDuong chiChoAdmin={true}>
              <AdminLayout />
            </BaoVeTuyenDuong>
          }
        >
          <Route index element={<QuanLyChung />} />
          <Route path="sach" element={<QuanLySach />} />
          <Route path="danhmucsach" element={<QuanLyDanhMuc />} />
          <Route path="khuyenmai" element={<QuanLyKhuyenMai />} />
          <Route
            path="phuongthucgiaohang"
            element={<QuanLyPhuongThucGiaoHang />}
          />
          <Route path="donhang" element={<QuanLyDonHang />} />
          <Route path="nguoidung" element={<QuanLyNguoiDung />} />
          <Route path="binhluan" element={<QuanLyBinhLuan />} />
          <Route path="tonkho" element={<QuanLyTonKho />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
