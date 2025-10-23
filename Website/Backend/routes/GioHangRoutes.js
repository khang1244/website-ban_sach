import express from "express";
import {
  capNhatSoLuongSanPham,
  layGioHangTheoNguoiDung,
  themSanPhamVaoGioHang,
  xoaSanPhamKhoiGioHang,
  xoaToanBoGioHang,
  demSoLuongSanPhamTrongGioHang,
} from "../controller/gioHangController.js";
const router = express.Router();

router.get("/:nguoiDungID", layGioHangTheoNguoiDung);

router.get("/dem-so-luong/:nguoiDungID", layGioHangTheoNguoiDung);

router.post("/", themSanPhamVaoGioHang);

router.put("/:chiTietGioHangID", capNhatSoLuongSanPham);

router.delete("/:chiTietGioHangID", xoaSanPhamKhoiGioHang);

router.delete("/toan-bo/:nguoiDungID", xoaToanBoGioHang);

router.get("/dem-so-luong/:nguoiDungID", demSoLuongSanPhamTrongGioHang);

export default router;
