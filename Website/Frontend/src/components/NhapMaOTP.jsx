import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { kiemTraMaOTP } from "../lib/nguoi-dung-apis";

function NhapMaOTP() {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();
  const xuLyKiemTraMaOTP = async () => {
    // Gọi API để kiểm tra mã OTP
    const { status, message, userID } = await kiemTraMaOTP(email, otp);

    if (status) {
      alert("Nhập mã OTP thành công, vui lòng đặt lại mật khẩu mới.");
      navigate("/nhapmatkhaumoi", { state: { userID } });
    } else {
      alert(`Lỗi: ${message}`);
    }
  };

  return (
    // Tạo giao diện nhập mã OTP
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm border-t-4 border-blue-600">
        <div className="flex flex-col items-center">
          {/* Icon xác thực */}
          <svg
            className="w-12 h-12 text-blue-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinelineCap="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>

          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Xác Thực OTP
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Mã xác minh đã được gửi đến email: **{email}**. Vui lòng kiểm tra
            trong hộp thư.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            xuLyKiemTraMaOTP();
          }}
        >
          {/* OTP Input - Thay đổi để trông hiện đại hơn */}
          <div className="mb-6">
            <label
              htmlFor="otp-input"
              className="block text-gray-700 font-medium mb-2 text-center"
            >
              Nhập mã OTP 6 chữ số
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-3 text-center text-xl tracking-[1em] font-mono border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none text-gray-800 shadow-inner"
              // Dùng tracking-[1em] để tạo khoảng cách giữa các ký tự
              required
            />
          </div>
          <button
            type="submit" // Đổi từ "button" sang "submit" để form hoạt động
            // Thêm disabled nếu OTP không đủ 6 ký tự
            disabled={otp.length !== 6}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 shadow-md ${
              otp.length === 6
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-300/50"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Xác Nhận
          </button>
        </form>

        {/* Back to forgot password link */}
        <p className="text-sm text-center text-gray-600 mt-6">
          <Link
            to="/quenmatkhau"
            className="text-blue-600 hover:underline font-medium"
          >
            &larr; Quay lại quên mật khẩu
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NhapMaOTP;
