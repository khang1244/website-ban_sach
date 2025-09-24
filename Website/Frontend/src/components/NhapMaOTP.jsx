import { useState } from "react";
import { Link } from "react-router-dom";

function NhapMaOTP() {
    const [otp, setOtp] = useState("");

    const xuLyKiemTraMaOTP = () => {
      // Kiểm tra mã OTP
      if (otp === "123456") {
        alert("Mã OTP hợp lệ!");
      } else {
        alert("Mã OTP không hợp lệ!");
      }
    };

    return(
        // Tạo giao diện nhập mã OTP
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[400px] ">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Nhập Mã OTP
            </h2>

            <form>
              {/* OTP Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Mã OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Nhập mã OTP của bạn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="button"
                onClick={xuLyKiemTraMaOTP}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Xác Nhận
              </button>
            </form>

            {/* Back to forgot password link */}
            <p className="text-sm text-center text-gray-600 mt-4">
              <Link to="/quenmatkhau" className="text-blue-600 hover:underline">
                Quay lại quên mật khẩu
              </Link>
            </p>
          </div>
        </div>
    )
}

export default NhapMaOTP;