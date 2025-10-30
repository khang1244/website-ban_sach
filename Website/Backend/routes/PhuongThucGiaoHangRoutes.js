import express from "express";
import {
  layTatCaPhuongThucGiaoHang,
  taoPhuongThucGiaoHang,
  capNhatPhuongThucGiaoHang,
  xoaPhuongThucGiaoHang,
  xoaVinhVienPhuongThucGiaoHang,
  kichHoatPhuongThucGiaoHang,
} from "../controller/phuongThucGiaoHangController.js";

const router = express.Router();

// Lấy tất cả phương thức giao hàng
router.get("/", layTatCaPhuongThucGiaoHang);

// Tạo phương thức giao hàng mới
router.post("/", taoPhuongThucGiaoHang);

// Cập nhật phương thức giao hàng
router.put("/:id", capNhatPhuongThucGiaoHang);

// Xóa phương thức giao hàng (soft delete)
router.delete("/:id", xoaPhuongThucGiaoHang);

// Xóa vĩnh viễn phương thức giao hàng (hard delete)
router.delete("/vinh-vien/:id", xoaVinhVienPhuongThucGiaoHang);

// Kích hoạt lại phương thức giao hàng
router.patch("/kich-hoat/:id", kichHoatPhuongThucGiaoHang);

export default router;
