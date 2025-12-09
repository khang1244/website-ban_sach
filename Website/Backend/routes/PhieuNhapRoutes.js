import express from "express";
import {
  layTatCaPhieuNhap,
  layPhieuNhapTheoID,
  taoPhieuNhap,
  layTonKho,
  layTonKhoTheoSach,
} from "../controller/phieuNhapController.js";

const router = express.Router();

// Route lấy tất cả phiếu nhập
router.get("/", layTatCaPhieuNhap);

// Route lấy tồn kho
router.get("/ton-kho", layTonKho);

// Route lấy tồn kho theo 1 sách cụ thể
router.get("/ton-kho/:sachID", layTonKhoTheoSach);

// Route lấy phiếu nhập theo ID (phải đặt sau các route cụ thể)
router.get("/:id", layPhieuNhapTheoID);

// Route tạo phiếu nhập mới
router.post("/", taoPhieuNhap);

export default router;
