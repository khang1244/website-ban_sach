import { useState } from "react";
import { Link } from "react-router-dom";

function DangNhap() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const xuLyDangNhap = () => {
    console.log("Đăng nhập với email:", email);
  };

  const xuLyDangNhapGoogle = () => {
    console.log("Đăng nhập bằng Google được nhấn.");
  };

  return (
    // Toàn bộ khung nền
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
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

          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              xuLyDangNhap();
            }}
          >
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 placeholder-gray-400 transition-all duration-200 shadow-sm text-base"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 placeholder-gray-400 transition-all duration-200 shadow-sm text-base"
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

          {/* Đăng nhập Google - Tối ưu hóa giao diện */}
          <button
            type="button"
            onClick={xuLyDangNhapGoogle}
            className="w-full flex items-center justify-center space-x-3 border-2 border-gray-200 bg-white text-gray-700 py-3 rounded-xl font-semibold shadow-inner hover:bg-indigo-50 hover:border-indigo-300 transition duration-300 transform hover:-translate-y-0.5"
          >
            {/* Biểu tượng Google (Inline SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-6 h-6"
            >
              <path
                fill="#FFC107"
                d="M43.61 20.08l-4.22.42A19.95 19.95 0 0 1 24 44c-11.05 0-20-8.95-20-20S12.95 4 24 4c5.15 0 9.8 1.96 13.38 5.16l-3.08 3.08A15.93 15.93 0 0 0 24 8c-8.84 0-16 7.16-16 16s7.16 16 16 16c4.66 0 8.84-2.02 11.77-5.26z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.6l-2.7 2.15C4.85 18.97 4 21.43 4 24c0 2.57.85 5.03 2.3 7.25l2.7-2.15C7.57 27.53 7 25.8 7 24s.57-3.53 1.3-5.05z"
              />
              <path
                fill="#4CAF50"
                d="M43.61 20.08l-4.22.42c.11.83.17 1.68.17 2.5s-.06 1.67-.17 2.5l4.22.42c.18-.9.27-1.83.27-2.78s-.09-1.88-.27-2.78z"
              />
              <path
                fill="#1976D2"
                d="M24 8c3.96 0 7.58 1.62 10.13 4.25l-4.22 4.22c-1.46-1.12-3.32-1.8-5.91-1.8-3.38 0-6.4 1.77-8.28 4.6l-4.22-4.22C14.1 9.62 18.72 8 24 8z"
              />
            </svg>
            <span className="text-gray-700">Đăng nhập bằng Google</span>
          </button>

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
