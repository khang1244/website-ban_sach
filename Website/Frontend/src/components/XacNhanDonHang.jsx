import React from "react";
import { FaCheckCircle, FaHome, FaShoppingCart } from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function XacNhanDonHang() {
  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4">
        {/* ĐIỀU CHỈNH: Trở lại max-w-sm để có sự cân đối tốt hơn */}
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border border-green-200">
          {/* Icon lớn hơn và viền bo tròn (tạo cảm giác 3D nhẹ) */}
          <div className="p-1 bg-white rounded-full shadow-lg mb-4">
            <FaCheckCircle className="text-green-500 text-6xl drop-shadow-sm" />
          </div>

          {/* Tiêu đề với emoji trang trọng */}
          <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center tracking-tight flex items-center gap-2">
            <span className="text-xl">🎉</span> Đặt hàng thành công!
          </h1>

          <p className="text-base text-gray-700 mb-6 text-center leading-relaxed">
            Cảm ơn bạn đã mua sách tại{" "}
            <span className="font-bold text-green-600">
              Tiệm sách HOÀNG KHANG
            </span>
            .
            <br />
            Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/"
              // Nút chính: Màu xanh đậm hơn, đổ bóng rõ ràng hơn
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-full font-bold text-base shadow-lg shadow-green-300 hover:bg-green-700 transition"
            >
              <FaHome /> Về Trang Chủ
            </Link>
            <Link
              to="/lichsumuahang"
              // Nút phụ: Viền tinh tế, không có đổ bóng nặng nề
              className="flex items-center justify-center gap-2 bg-white border border-green-600 text-green-600 py-3 rounded-full font-bold text-base hover:bg-green-50 transition"
            >
              <FaShoppingCart /> Xem Đơn Hàng
            </Link>
          </div>

          {/* Thông tin liên hệ: Bố cục rõ ràng, link nổi bật */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-gray-600 text-xs w-full text-center">
            <p className="mb-1">
              Hỗ trợ:{" "}
              <a
                href="mailto:support@bookstore.vn"
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                khangck23v7k512@vlvh.ctu.edu.vn
              </a>{" "}
              | Hotline:{" "}
              <a
                href="tel:0762835400"
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                0762 835 400
              </a>
            </p>
            <p className="mt-1">
              <a
                href="#"
                className="text-blue-600 underline font-medium hover:text-blue-800"
              >
                Chính sách Đổi trả & Hoàn tiền
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
