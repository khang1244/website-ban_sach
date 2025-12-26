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

// Lây giỏ hàng theo người dùng
router.get("/:nguoiDungID", layGioHangTheoNguoiDung);

// Đếm số lượng sản phẩm trong giỏ hàng
router.get("/dem-so-luong/:nguoiDungID", demSoLuongSanPhamTrongGioHang);

// Thêm sản phẩm vào giỏ hàng
router.post("/", themSanPhamVaoGioHang);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/:gioHangID/sach/:sachID", capNhatSoLuongSanPham);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:gioHangID/sach/:sachID", xoaSanPhamKhoiGioHang);

// Xóa toàn bộ sản phẩm trong giỏ hàng của người dùng khi đặt đơn thành công
router.delete("/toan-bo/:nguoiDungID", xoaToanBoGioHang);

// Lây giỏ hàng theo người dùng
router.get("/dem-so-luong/:nguoiDungID", demSoLuongSanPhamTrongGioHang);

export default router;
