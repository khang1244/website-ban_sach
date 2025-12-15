import express from "express";
import {
  layDiaChiTheoKhachHang,
  taoDiaChi,
  xoaDiaChi,
  datDiaChiMacDinh,
} from "../controller/diaChiController.js";

const router = express.Router(); // Khởi tạo router

router.get("/khachHangID/:khachHangID", layDiaChiTheoKhachHang); // Lấy địa chỉ theo khách hàng
router.post("/", taoDiaChi); // Tạo địa chỉ mới
router.delete("/:diaChiID", xoaDiaChi); // Xóa địa chỉ theo ID
router.put("/:diaChiID/macDinh", datDiaChiMacDinh); // Đặt địa chỉ mặc định

export default router;
