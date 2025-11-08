import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { FaSearch } from "react-icons/fa";
import { useEffect } from "react";
import { nhanDonHangCuaMotNguoiDung } from "../lib/don-hang-apis.js";

function LichSuMuaHang() {
  // Biến trạng thái để lưu trữ danh sách đơn hàng của người dùng
  const [userOrders, setUserOrders] = React.useState([]);

  // Helper function để định dạng lại ngày tháng
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    // Gọi hàm có sẵn trong file don-hang-apis.js để lấy đơn hàng của người dùng từ server
    async function napDuLieuDonHangCuaNguoiDung() {
      // Lấy ID người dùng từ localStorage
      const user = localStorage.getItem("user");
      const nguoiDungID = JSON.parse(user).nguoiDungID;

      const donHang = await nhanDonHangCuaMotNguoiDung(nguoiDungID);
      console.log("Đơn hàng lấy từ server:", donHang);
      setUserOrders(donHang);
    }
    napDuLieuDonHangCuaNguoiDung();
  }, []);
  return (
    <div className="bg-gradient-to-br min-h-screen w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Lịch Sử Đơn Hàng
        </h1>
        {userOrders.length === 0 ? (
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
          <div className="bg-white rounded-xl shadow-xl p-8 text-black">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-black">
                  <th className="py-2">Mã ĐH</th>
                  <th className="py-2">Ngày đặt</th>
                  <th className="py-2">Sản phẩm</th>
                  <th className="py-2">Trạng thái</th>
                  <th className="py-2">Tổng tiền</th>
                  <th className="py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {userOrders &&
                  userOrders.length > 0 &&
                  userOrders.map((order) => (
                    <tr
                      key={order.donHangID}
                      className="border-b hover:bg-[#f5f7fa]"
                    >
                      <td className="py-3 font-semibold text-[#00809D]">
                        {order.donHangID}
                      </td>
                      <td className="py-3">{formatDate(order.createdAt)}</td>
                      <td className="py-3">
                        {order.Saches.map((item, idx) => (
                          <div key={idx}>
                            {item.tenSach} (x{item.DonHang_Sach.soLuong})
                          </div>
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
                          {order.trangThai}
                        </span>
                      </td>
                      <td className="py-3 font-bold">
                        {order.tongTien.toLocaleString()}đ
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/chitietdonhang/${order.donHangID}`}
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
