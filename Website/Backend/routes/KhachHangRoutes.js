import express from "express";
import {
  capNhatMatKhau,
  capNhatThongTinKhachHang,
  dangKy,
  dangNhap,
  layThongTinKhachHang,
  thayDoiTrangThaiTaiKhoan,
  xoaTaiKhoanKhachHang,
  kiemTraEmailTonTai,
  dangNhapGoogle,
  yeuCauNhanOTPCapNhatMatKhau,
  kiemTraMaOTP,
  layTatCaKhachHang,
} from "../controller/khachHangController.js";
const router = express.Router();

//tuyến xử lý đăng ký
router.post("/dang-ky", dangKy);
//tuyến xử lý đăng nhập
router.post("/dang-nhap", dangNhap);
//tuyến xử lý đăng nhập google
router.post("/dang-nhap-google", dangNhapGoogle);
//tuyến xử lý thay đổi trạng thái tài khoản
router.post("/thay-doi-trang-thai/:khachHangID", thayDoiTrangThaiTaiKhoan);
router.get("/", layTatCaKhachHang); // Lấy tất cả khách hàng

router.get("/:khachHangID", layThongTinKhachHang); // Lấy thông tin khách hàng theo ID

router.put("/:khachHangID", capNhatThongTinKhachHang); // Cập nhật thông tin khách hàng theo ID

router.put("/cap-nhat-mat-khau/:khachHangID", capNhatMatKhau); // Cập nhật mật khẩu khách hàng theo ID
router.delete("/:khachHangID", xoaTaiKhoanKhachHang); // Xóa tài khoản khách hàng theo ID

router.post("/kiemTraEmail", kiemTraEmailTonTai); // Kiểm tra email tồn tại

router.post("/nhan-otp", yeuCauNhanOTPCapNhatMatKhau); // Yêu cầu nhận OTP để cập nhật mật khẩu

router.post("/kiem-tra-otp", kiemTraMaOTP); // Kiểm tra OTP để cập nhật mật khẩu

export default router;
