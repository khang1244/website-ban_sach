import express from "express";
import {
  nhanTatCaDonHang,
  taoDonHangMoi,
  capNhatTrangThaiDonHang,
  nhanDonHangTheoID,
  xoaDonHangTheoID,
} from "../controller/donHangController.js";

const router = express.Router();

// Tạo tuyến nhận tất cả đơn hàng
router.get("/", nhanTatCaDonHang);

// Tạo một đơn hàng mới
router.post("/", taoDonHangMoi);

// Cập nhật trạng thái đơn hàng
router.put("/:id", capNhatTrangThaiDonHang);

// Nhận đơn hàng theo ID
router.get("/:id", nhanDonHangTheoID);

// Xóa đơn hàng theo ID
router.delete("/:id", xoaDonHangTheoID);

export default router;
