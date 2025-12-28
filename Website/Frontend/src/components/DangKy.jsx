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

  // Hàm hiển thị toast thông báo
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

  // Xử lý đăng ký
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
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

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Đăng Ký Tài Khoản
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Tạo tài khoản mới để bắt đầu mua sách
          </p>
        </div>

        <form className="space-y-4">
          {/* Tên người dùng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên người dùng
            </label>
            <input
              type="text"
              name="username"
              value={tenNguoiDung}
              onChange={(e) => setTenNguoiDung(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="Nhập tên người dùng"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="example@email.com"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={xacNhanMatKhau}
              onChange={(e) => setXacNhanMatKhau(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={soDienThoai}
              onChange={(e) => setSoDienThoai(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="0123456789"
            />
          </div>

          {/* Nút Đăng ký */}
          <button
            type="button"
            onClick={xuLyDangKy}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-6"
          >
            Đăng Ký
          </button>

          {/* Link đến đăng nhập */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
            <Link
              to="/dangnhap"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DangKy;
