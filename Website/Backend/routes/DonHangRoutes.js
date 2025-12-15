import express from "express";
import {
  nhanTatCaDonHang,
  taoDonHangMoi,
  capNhatTrangThaiDonHang,
  nhanDonHangTheoID,
  xoaDonHangTheoID,
  nhanDonHangCuaKhachHang,
  traHang,
} from "../controller/donHangController.js";

const router = express.Router();

// Tạo tuyến nhận tất cả đơn hàng
router.get("/", nhanTatCaDonHang);

// Nhận đơn hàng của một tài khoản người dùng
router.get("/khachHang/:khachHangID", nhanDonHangCuaKhachHang);
// Tạo một đơn hàng mới
router.post("/", taoDonHangMoi);

// Trả hàng
router.post("/tra-hang", traHang);

// Cập nhật trạng thái đơn hàng
router.put("/:id", capNhatTrangThaiDonHang);

// Nhận đơn hàng theo ID
router.get("/:id", nhanDonHangTheoID);

// Xóa đơn hàng theo ID
router.delete("/:id", xoaDonHangTheoID);

export default router;
