import { useState } from "react";
import { Link } from "react-router-dom";

const QuenMatKhau = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-amber-500">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-[400px] ">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Quên Mật Khẩu
        </h2>

        <form>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
              placeholder-gray-500
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Gửi yêu cầu
          </button>
        </form>

        {/* Back to login link */}
        <p className="text-sm text-center text-gray-600 mt-4">
          <Link to="/dangnhap" className="text-blue-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default QuenMatKhau;
