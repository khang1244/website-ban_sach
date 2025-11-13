import express from "express";
import {
  capNhatMatKhau,
  capNhatThongTinNguoiDung,
  dangKy,
  dangNhap,
  layThongTinNguoiDung,
  thayDoiTrangThaiTaiKhoan,
  xoaTaiKhoanNguoiDung,
  kiemTraEmailTonTai,
  dangNhapGoogle,
  yeuCauNhanOTPCapNhatMatKhau,
  kiemTraMaOTP,
} from "../controller/nguoiDungController.js";
const router = express.Router();

//tuyến xử lý đăng ký
router.post("/dang-ky", dangKy);
//tuyến xử lý đăng nhập
router.post("/dang-nhap", dangNhap);
//tuyến xử lý đăng nhập google
router.post("/dang-nhap-google", dangNhapGoogle);
//tuyến xử lý thay đổi trạng thái tài khoản
router.post("/thay-doi-trang-thai/:nguoiDungID", thayDoiTrangThaiTaiKhoan);

router.get("/:id", layThongTinNguoiDung); // Lấy thông tin người dùng theo ID

router.put("/:id", capNhatThongTinNguoiDung); // Cập nhật thông tin người dùng theo ID

router.put("/cap-nhat-mat-khau/:id", capNhatMatKhau); // Cập nhật mật khẩu người dùng theo ID

router.delete("/:id", xoaTaiKhoanNguoiDung); // Xóa tài khoản người dùng theo ID

router.post("/kiemTraEmail", kiemTraEmailTonTai); // Kiểm tra email tồn tại

router.post("/nhan-otp", yeuCauNhanOTPCapNhatMatKhau); // Yêu cầu nhận OTP để cập nhật mật khẩu

router.post("/kiem-tra-otp", kiemTraMaOTP); // Kiểm tra OTP để cập nhật mật khẩu

export default router;
