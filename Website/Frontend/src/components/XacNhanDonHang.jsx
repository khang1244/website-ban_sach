import React from "react";
import { FaCheckCircle, FaHome, FaShoppingCart } from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function XacNhanDonHang() {
  return (
    <div className="bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] min-h-screen w-full flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col justify-center items-center py-16">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full flex flex-col items-center border border-[#e0eafc]">
          <FaCheckCircle className="text-green-500 text-6xl mb-4 drop-shadow" />
          <h1 className="text-3xl font-bold text-[#00809D] mb-2 text-center">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Cảm ơn bạn đã mua sách tại{" "}
            <span className="font-semibold text-[#00809D]">BookStore</span>.
            <br />
            Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý trong thời gian
            sớm nhất.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[#00809D] text-white py-3 rounded-full font-bold text-lg hover:bg-[#006b85] transition"
            >
              <FaHome /> Về trang chủ
            </Link>
            <Link
              to="/don-hang"
              className="flex items-center justify-center gap-2 bg-white border border-[#00809D] text-[#00809D] py-3 rounded-full font-bold text-lg hover:bg-[#e0eafc] transition"
            >
              <FaShoppingCart /> Xem đơn hàng của tôi
            </Link>
          </div>
          <div className="mt-6 text-gray-600 text-center text-sm">
            <p>
              Mọi thắc mắc vui lòng liên hệ{" "}
              <a
                href="mailto:support@bookstore.vn"
                className="text-blue-600 underline"
              >
                support@bookstore.vn
              </a>{" "}
              hoặc hotline{" "}
              <a href="tel:0123456789" className="text-blue-600 underline">
                0123 456 789
              </a>
              .
            </p>
            <p className="mt-2">
              Xem{" "}
              <a href="#" className="text-blue-600 underline">
                Chính sách đổi trả & hoàn tiền
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default XacNhanDonHang;