import express from "express";
import {
  layTatCaPhieuXuat,
  layPhieuXuatTheoID,
  taoPhieuXuat,
} from "../controller/phieuXuatController.js";

const router = express.Router();

// Route lấy tất cả phiếu xuất
router.get("/", layTatCaPhieuXuat);

// Route lấy phiếu xuất theo ID
router.get("/:id", layPhieuXuatTheoID);

// Route tạo phiếu xuất mới
router.post("/", taoPhieuXuat);

export default router;
