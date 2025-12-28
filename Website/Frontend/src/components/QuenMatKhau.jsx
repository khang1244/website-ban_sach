import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yeuCauNhanOTPCapNhatMatKhau } from "../lib/nguoi-dung-apis";

const QuenMatKhau = () => {
  const [email, setEmail] = useState(""); // State quản lý email
  const navigate = useNavigate(); // Khai báo useNavigate để chuyển hướng

  // Xử lý gửi yêu cầu nhận mã OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { status, message } = await yeuCauNhanOTPCapNhatMatKhau(email);
    if (status) {
      alert("Mã OTP đã được gửi đến email của bạn.");
      navigate("/nhapmaotp", { state: { email } });
    } else {
      alert(`Lỗi: ${message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-50">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-[450px] max-w-[90%] border border-gray-100">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Quên Mật Khẩu
        </h2>
        <p className="text-center text-gray-500 mb-6 border-b pb-4">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Địa chỉ Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition duration-150 placeholder-gray-400"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Gửi Yêu Cầu
          </button>
        </form>

        {/* Back to login link */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Đã nhớ mật khẩu?&nbsp;
          <Link
            to="/dangnhap"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition duration-200"
          >
            Quay lại Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default QuenMatKhau;
