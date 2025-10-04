import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { FaSearch } from "react-icons/fa";

// Dữ liệu đơn hàng mẫu
const orders = [
  {
    id: "DH001",
    date: "2025-08-20",
    status: "Đã giao hàng",
    total: 320000,
    items: [
      { name: "Harry Potter và Hòn Đá Phù Thủy", quantity: 1 },
      { name: "Dế Mèn Phiêu Lưu Ký", quantity: 2 },
    ],
  },
  {
    id: "DH002",
    date: "2025-08-15",
    status: "Đang xử lý",
    total: 145000,
    items: [{ name: "Totto-chan bên cửa sổ", quantity: 1 }],
  },
];

function LichSuMuaHang() {
  return (
    <div className="bg-gradient-to-br min-h-screen w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Lịch Sử Đơn Hàng
        </h1>
        {orders.length === 0 ? (
          <div className="bg- rounded-xl shadow p-8 text-center">
            <p className="text-lg text-gray-700 mb-4">
              Bạn chưa có đơn hàng nào.
            </p>
            <Link
              to="/"
              className="text-blue-600 hover:underline font-semibold"
            >
              &larr; Mua sách ngay
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-black">
                  <th className="py-2">Mã đơn hàng</th>
                  <th className="py-2">Ngày đặt</th>
                  <th className="py-2">Sản phẩm</th>
                  <th className="py-2">Trạng thái</th>
                  <th className="py-2">Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b text-black hover:bg-[#f5f7fa]"
                  >
                    <td className="py-3 font-semibold text-[#00809D]">
                      {order.id}
                    </td>
                    <td className="py-3">{order.date}</td>
                    <td className="py-3">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="block text-gray-700">
                          {item.name}{" "}
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </span>
                      ))}
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          order.status === "Đã giao hàng"
                            ? "text-green-600 font-bold"
                            : "text-yellow-600 font-bold"
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 font-bold">
                      {order.total.toLocaleString()}đ
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/don-hang/${order.id}`}
                        className="flex items-center gap-2 bg-[#00809D] text-white px-4 py-2 rounded-full font-bold hover:bg-[#006b85] transition"
                      >
                        <FaSearch /> Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LichSuMuaHang;
