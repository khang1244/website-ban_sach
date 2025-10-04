import { Link } from "react-router-dom";
import { useState } from "react";
function DangNhap() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const xuLyDangNhap = () => {
    // Để xử lý sau
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-amber-100 to-pink-100">
      <form className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
          Đăng Nhập
        </h2>

        {/* Email */}
        <div className="mb-5 w-full">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
            placeholder="Nhập email..."
          />
        </div>

        {/* Password */}
        <div className="mb-5 w-full">
          <label className="block text-gray-700 font-semibold mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 transition"
            placeholder="Nhập mật khẩu..."
          />
        </div>

        {/* Forgot password */}
        <div className="flex justify-end w-full mb-5">
          <Link
            to="/quenmatkhau"
            className="text-sm text-blue-600 hover:underline font-semibold"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit button */}
        <button
          onClick={xuLyDangNhap}
          type="button"
          className="w-full bg-gradient-to-r from-blue-500 to-amber-400 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-amber-500 transition duration-300 shadow-md"
        >
          Đăng nhập
        </button>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link
            to="/dangky"
            className="text-blue-600 hover:underline font-semibold"
          >
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
}

export default DangNhap;
