import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { dangKyTaiKhoan, kiemTraEmailTonTai } from "../lib/nguoi-dung-apis.js";
import ThongBaoChay from "./admin/ThongBaoChay.jsx";

function DangKy() {
  const [tenNguoiDung, setTenNguoiDung] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(
      () => setToast({ show: false, type: "", title: "", message: "" }),
      4000
    ); // Ẩn sau 4 giây
  };
  // Sử dụng useNavigate để chuyển hướng
  const navigate = useNavigate();

  // Kiểm tra sự khớp mật khẩu
  const kiemTraMatKhau = () => {
    if (matKhau !== xacNhanMatKhau) {
      showToast("error", "Lỗi", "Mật khẩu không khớp!");
      return false;
    }
    return true;
  };

  // Kiểm tra email đã tồn tại trong cơ sở dữ liệu
  const kiemTraEmailTonTaiCheck = async () => {
    try {
      const result = await kiemTraEmailTonTai(email);

      if (result.message === "Email này đã được đăng ký!") {
        showToast("error", "Lỗi", "Email này đã được đăng ký!");
        return false; // Email is already registered
      } else if (result.message === "Email hợp lệ") {
        return true; // Email is valid
      } else {
        showToast("error", "Lỗi", "Có lỗi xảy ra khi kiểm tra email!");
        return false; // Some error occurred
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra email:", error);
      showToast("error", "Lỗi", "Lỗi máy chủ khi kiểm tra email.");
      return false;
    }
  };

  const xuLyDangKy = async () => {
    // Kiểm tra xem mật khẩu có khớp không
    if (!kiemTraMatKhau()) return;
    // Kiểm tra xem email có trùng không
    const isEmailValid = await kiemTraEmailTonTaiCheck();
    if (!isEmailValid) return;

    // Gửi yêu cầu đăng ký
    await dangKyTaiKhoan({
      tenNguoiDung,
      email,
      matKhau,
      soDienThoai,
    });
    showToast("success", "Thành công", "Đăng ký thành công!");

    // Sau khi thông báo 4 giây, chuyển hướng đến trang đăng nhập
    setTimeout(() => {
      navigate("/dangnhap");
    }, 3000); // Đợi 3 giây trước khi chuyển hướng
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-amber-100 to-pink-100">
      {/* Toast */}
      <ThongBaoChay
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() =>
          setToast({ show: false, type: "", title: "", message: "" })
        }
      />
      <div className="bg-white shadow-xl rounded-2xl px-6 py-8 w-full max-w-4xl flex">
        {/* Phần bên trái */}
        <div className="w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-amber-400 rounded-l-2xl">
          <h2 className="text-3xl font-bold text-white text-center">
            Chào mừng đến với chúng tôi!
          </h2>
        </div>

        {/* Phần form đăng ký bên phải */}
        <div className="w-1/2 flex flex-col justify-center p-8">
          <form className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Đăng Ký
            </h2>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                value={tenNguoiDung}
                onChange={(e) => setTenNguoiDung(e.target.value)}
                required
                className="w-full px-3 py-2 border text-black border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
                placeholder="Tên người dùng"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border text-black border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                required
                className="w-full px-3 py-2 border text-black border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
                placeholder="Mật khẩu"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={xacNhanMatKhau}
                onChange={(e) => setXacNhanMatKhau(e.target.value)}
                required
                className="w-full px-3 py-2 border text-black border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                required
                className="w-full px-3 py-2 border text-black border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
                placeholder="Số điện thoại"
              />
            </div>

            <button
              type="button"
              onClick={xuLyDangKy}
              className="w-full bg-gradient-to-r from-blue-500 to-amber-400 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-amber-500 transition duration-300 shadow"
            >
              Đăng ký
            </button>

            <div className="mt-3 text-center">
              <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
              <Link
                to="/dangnhap"
                className="text-blue-600 hover:underline font-medium text-sm"
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DangKy;
