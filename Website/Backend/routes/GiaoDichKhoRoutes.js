import express from "express";
import {
  nhanTatCaGiaoDichKho,
  taoGiaoDichKho,
  xoaGiaoDichKho,
} from "../controller/giaoDichKhoController.js";

const router = express.Router();

// Nhận tất cả giao dịch kho
router.get("/", nhanTatCaGiaoDichKho);

// Tạo giao dịch kho mới
router.post("/", taoGiaoDichKho);

// Xóa giao dịch kho dựa trên ID
router.delete("/:maGiaoDich", xoaGiaoDichKho);

export default router;
