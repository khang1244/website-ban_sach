import express from "express";
import {
  capNhatMaKhuyenMai,
  nhanTatCaMaKhuyenMai,
  taoMaKhuyenMai,
  xoaMaKhuyenMai,
  nhanMaKhuyenMaiTheoID,
} from "../controller/khuyenMaiController.js";

const router = express.Router();

// Nhận tất cả khuyến mãi
router.get("/", nhanTatCaMaKhuyenMai);

// Tạo khuyến mãi mới
router.post("/", taoMaKhuyenMai);

// Cập nhật khuyến mãi
router.put("/:khuyenMaiID", capNhatMaKhuyenMai);

// Xóa khuyến mãi
router.delete("/:khuyenMaiID", xoaMaKhuyenMai);

// Nhận khuyến mãi theo ID
router.get("/:khuyenMaiID", nhanMaKhuyenMaiTheoID);

export default router;
