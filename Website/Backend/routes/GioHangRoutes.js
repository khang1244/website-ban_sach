import express from "express";
import {
  capNhatSoLuongSanPham,
  layGioHangTheoKhachHang,
  themSanPhamVaoGioHang,
  xoaSanPhamKhoiGioHang,
  xoaToanBoGioHang,
  demSoLuongSanPhamTrongGioHang,
} from "../controller/gioHangController.js";
const router = express.Router();

router.get("/:khachHangID", layGioHangTheoKhachHang);

router.get("/dem-so-luong/:khachHangID", demSoLuongSanPhamTrongGioHang);

router.post("/", themSanPhamVaoGioHang);

router.put("/:chiTietGioHangID", capNhatSoLuongSanPham);

router.delete("/:chiTietGioHangID", xoaSanPhamKhoiGioHang);

router.delete("/toan-bo/:khachHangID", xoaToanBoGioHang);

router.get("/dem-so-luong/:khachHangID", demSoLuongSanPhamTrongGioHang);

export default router;
