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
import KetQuaTimKiemSach from "./components/KetQuaTimKiem";
import AdminLayout from "./components/admin/AdminLayout";
import QuanLiChung from "./components/admin/QuanLiChung";
import QuanLiSach from "./components/admin/QuanLiSach";
import DanhMucSach from "./components/admin/DanhMucSach";

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
        <Route path="/ketquatimkiemsach" element={<KetQuaTimKiemSach />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<QuanLiChung />} />
          <Route path="sach" element={<QuanLiSach />} />
          <Route path="danhmucsach" element={<DanhMucSach />} />
          {/* // <Route path="donhang" element={<div>Quản lý đơn hàng</div>} />
          // <Route path="nguoidung" element={<div>Người dùng</div>} />
          // <Route path="binhluan" element={<div>Bình luận</div>} />
          // <Route path="khuyenmai" element={<div>Khuyến mãi</div>} />
          // <Route path="giaodichkho" element={<div>Giao dịch kho</div>} />
          // <Route path="tintuc" element={<div>Quản lý tin tức</div>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
