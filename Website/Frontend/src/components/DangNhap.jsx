import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dangNhapTaiKhoan, dangNhapGoogle } from "../lib/nguoi-dung-apis.js";
import ThongBaoChay from "./admin/ThongBaoChay.jsx";
import { UserContext } from "../contexts/user-context";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function DangNhap() {
  // State để quản lý thông báo
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  // Hàm hiển thị thông báo
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(
      () => setToast({ show: false, type: "", title: "", message: "" }),
      3000
    );
  };
  const [email, setEmail] = useState(""); // State quản lý email
  const [password, setPassword] = useState(""); // State quản lý mật khẩu

  // Sử dụng user context
  const { setUser } = useContext(UserContext);

  // Khai báo useNavigate để chuyển hướng
  const router = useNavigate();

  // Xử lý sự kiện đăng nhập
  const xuLyDangNhap = async (e) => {
    e.preventDefault();

    // Gọi API để đăng nhập
    const { status, message, user } = await dangNhapTaiKhoan(email, password); //

    if (status) {
      // Đăng nhập thành công
      showToast("info", "Đăng nhập thành công", "Chào mừng bạn trở lại!");
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Chuyển avatar thành đối tượng trước khi lưu vào biến trạng thái user
      const newAvatar = user.avatar ? JSON.parse(user.avatar) : null;
      setUser({
        ...user,
        avatar: newAvatar,
      });

      // Delay chuyển hướng sau 3s (3000ms)
      setTimeout(() => {
        // Kiểm tra vai trò và chuyển hướng phù hợp
        if (user && user.vaiTro === "admin") {
          router("/admin");
        } else {
          router("/");
        }
      }, 3000);
    } else {
      showToast("error", "Đăng nhập thất bại", message);
    }
  };
  // Xử lý đăng nhập bằng Google
  const xuLyDangNhapGoogle = async (credentialResponse) => {
    try {
      // Giải mã JWT token từ Google
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user info:", decoded);

      // Tạo đối tượng user từ thông tin Google
      const googleUser = {
        tenNguoiDung: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        googleId: decoded.sub,
      };

      // Gọi API backend để xử lý đăng nhập Google
      const { status, message, user } = await dangNhapGoogle(googleUser);

      if (status) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Cập nhật user context: avatar có thể là chuỗi JSON hoặc object
        let newAvatar = null;
        if (user.avatar) {
          try {
            newAvatar =
              typeof user.avatar === "string"
                ? JSON.parse(user.avatar)
                : user.avatar;
          } catch (err) {
            console.warn("Không thể parse avatar từ backend:", err);
            newAvatar = { url: decoded.picture };
          }
        } else {
          newAvatar = { url: decoded.picture };
        }

        setUser({
          ...user,
          avatar: newAvatar,
        });

        alert("Đăng nhập Google thành công!");
        if (user && user.vaiTro === "admin") {
          router("/admin");
        } else {
          router("/");
        }
      } else {
        alert("Đăng nhập Google thất bại! " + message);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      alert("Đăng nhập Google thất bại!");
    }
  };
  return (
    // Toàn bộ khung nền
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {/* // Toast thông báo */}
      <ThongBaoChay
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() =>
          setToast({ show: false, type: "", title: "", message: "" })
        }
      />
      {/* Khối chính (Card): Dùng flex để chia 2 cột */}
      <div className="flex w-full max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500">
        {/* Left Section - Banner Chào mừng (Chỉ hiển thị trên Desktop/Tablet) */}
        <div className="hidden md:flex flex-col justify-center items-center w-full md:w-2/5 p-10 bg-gradient-to-br from-indigo-600 to-purple-800 text-white text-center">
          <svg
            className="w-16 h-16 mb-4 opacity-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <h2 className="text-3xl font-extrabold mb-3 tracking-wide">
            Chào mừng trở lại!
          </h2>
          <p className="text-sm opacity-80 max-w-xs">
            Đăng nhập để tiếp tục quản lý các đầu sách và đơn hàng của bạn một
            cách nhanh chóng.
          </p>
        </div>

        {/* // Phần bên phải - Form Đăng nhập */}
        <div className="w-full md:w-3/5 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Đăng Nhập
          </h2>

          <form className="w-full" onSubmit={xuLyDangNhap}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-600 font-medium mb-2 text-sm">
                Địa chỉ Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 placeholder-gray-400 transition-all duration-200 shadow-sm text-base"
                placeholder="tenban@email.com"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2 text-sm">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 placeholder-gray-400 transition-all duration-200 shadow-sm text-base"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {/* Link Quên mật khẩu */}
            <div className="flex justify-end w-full mb-8">
              <Link
                to="/quenmatkhau"
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition cursor-pointer"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Đăng nhập
            </button>
          </form>

          {/* Dòng phân cách */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">
              HOẶC
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Đăng nhập Google - sử dụng GoogleLogin từ @react-oauth/google */}
          <div className="w-full mt-4">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00a2c7] to-[#005f73] opacity-20 group-hover:opacity-30 blur-lg transition"></div>

              <div className="relative border rounded-xl bg-white hover:bg-[#f8feff] transition shadow-sm flex items-center justify-center px-4 py-2">
                <GoogleLogin
                  onSuccess={xuLyDangNhapGoogle}
                  onError={() => {
                    console.log("Đăng nhập Google thất bại");
                    alert("Đăng nhập Google thất bại!");
                  }}
                  useOneTap
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link
              to="/dangky"
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DangNhap;
