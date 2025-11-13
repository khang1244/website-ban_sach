import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { datLaiMatKhau } from "../lib/nguoi-dung-apis";

function NhapMatKhauMoi() {
  const [matKhauMoi, setMatKhauMoi] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  // use state from navigation
  const location = useLocation();
  const { userID } = location.state || {};
  const router = useNavigate();

  const xuLyDatLaiMatKhau = async () => {
    if (matKhauMoi === xacNhanMatKhau) {
      // Gọi API để đặt lại mật khẩu
      const { status, message } = await datLaiMatKhau(userID, matKhauMoi);
      if (!status) {
        alert(`Lỗi: ${message}`);
        return;
      }
      alert("Đặt lại mật khẩu thành công!");
      router("/dangnhap");
    } else {
      alert("Mật khẩu không khớp!");
    }
  };

  return (
    // Tạo giao diện nhập mật khẩu mới
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          xuLyDatLaiMatKhau(); // Gọi hàm xử lý khi form được submit
        }}
        className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm border-t-4 border-indigo-600"
      >
        <div className="flex flex-col items-center">
          {/* Icon khóa */}
          <svg
            className="w-12 h-12 text-indigo-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>

          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Đặt Lại Mật Khẩu
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Nhập mật khẩu mới mạnh mẽ cho tài khoản của bạn.
          </p>
        </div>

        {/* Mật Khẩu Mới */}
        <div className="mb-5">
          <label
            htmlFor="new-password"
            className="block text-gray-700 font-medium mb-2"
          >
            Mật Khẩu Mới
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="Mật khẩu (tối thiểu 8 ký tự)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none text-black transition duration-150 shadow-sm"
            value={matKhauMoi}
            onChange={(e) => setMatKhauMoi(e.target.value)}
            required
            minLength="8" // Thêm yêu cầu tối thiểu 8 ký tự
          />
        </div>

        {/* Xác Nhận Mật Khẩu */}
        <div className="mb-6">
          <label
            htmlFor="confirm-password"
            className="block text-gray-700 font-medium mb-2"
          >
            Xác Nhận Mật Khẩu
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={xacNhanMatKhau}
            onChange={(e) => setXacNhanMatKhau(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none text-black transition duration-150 shadow-sm"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit" // Đổi từ "button" sang "submit" để form hoạt động
          // Vô hiệu hóa nếu mật khẩu không khớp hoặc quá ngắn
          disabled={
            !matKhauMoi ||
            matKhauMoi !== xacNhanMatKhau ||
            matKhauMoi.length < 8
          }
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 shadow-lg ${
            !matKhauMoi ||
            matKhauMoi !== xacNhanMatKhau ||
            matKhauMoi.length < 8
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300/50"
          }`}
        >
          Đặt Lại Mật Khẩu
        </button>
      </form>
    </div>
  );
}

export default NhapMatKhauMoi;
