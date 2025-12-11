import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
// Thêm các icons cần thiết cho giao diện chuyên nghiệp hơn
import {
  FaSearch,
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useEffect } from "react";
import { nhanDonHangCuaMotNguoiDung } from "../lib/don-hang-apis.js";

function LichSuMuaHang() {
  // Biến trạng thái để lưu trữ danh sách đơn hàng của người dùng
  const [userOrders, setUserOrders] = React.useState([]);

  // Helper function định dạng ngày + giờ
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString)
      .toLocaleString("vi-VN", options)
      .replace(",", "");
  }

  // Helper function để lấy icon và màu sắc trạng thái (tách màu rõ ràng)
  function getStatusStyle(status = "") {
    const s = (status || "").toLowerCase();

    if (s.includes("hủy") || s.includes("cancel")) {
      return {
        icon: FaShoppingBag,
        color: "text-rose-600",
        bgColor: "bg-rose-100",
        label: status || "Đã hủy",
      };
    }

    if (s.includes("đã giao") || s.includes("hoàn thành")) {
      return {
        icon: FaCheckCircle,
        color: "text-emerald-700",
        bgColor: "bg-emerald-100",
        label: status || "Đã giao hàng",
      };
    }

    if (s.includes("đang giao") || s.includes("vận chuyển")) {
      return {
        icon: FaTruck,
        color: "text-sky-700",
        bgColor: "bg-sky-100",
        label: status || "Đang giao hàng",
      };
    }

    if (s.includes("xử lý") || s.includes("chờ") || s.includes("xác nhận")) {
      return {
        icon: FaClock,
        color: "text-amber-700",
        bgColor: "bg-amber-100",
        label: status || "Đang xử lý",
      };
    }

    return {
      icon: FaBoxOpen,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
      label: status || "Đang cập nhật",
    };
  }

  useEffect(() => {
    // Gọi hàm có sẵn trong file don-hang-apis.js để lấy đơn hàng của người dùng từ server
    async function napDuLieuDonHangCuaNguoiDung() {
      try {
        // Lấy ID người dùng từ localStorage
        const user = localStorage.getItem("user");
        if (!user) return; // Xử lý trường hợp chưa đăng nhập

        const nguoiDungID = JSON.parse(user).nguoiDungID;

        const donHang = await nhanDonHangCuaMotNguoiDung(nguoiDungID);
        console.log("Đơn hàng lấy từ server:", donHang);
        setUserOrders(donHang);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
      }
    }
    napDuLieuDonHangCuaNguoiDung();
  }, []);

  // BẮT ĐẦU PHẦN SỬA ĐỔI GIAO DIỆN CHUYÊN NGHIỆP TRONG RETURN
  return (
    // Đổi background nhẹ nhàng, chuyên nghiệp hơn
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Theo dõi tất cả các đơn hàng bạn đã đặt.
          </p>
        </header>

        {userOrders.length === 0 ? (
          // Thiết kế lại giao diện rỗng (Empty State) - Đẹp và trực quan hơn
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center max-w-lg mx-auto">
            <FaShoppingBag className="w-16 h-16 text-[#00809D] mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-6">
              Bạn chưa có đơn hàng nào. Hãy khám phá những cuốn sách tuyệt vời!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#00809D] hover:bg-[#006b85] transition-colors duration-200"
            >
              &larr; Mua sách ngay
            </Link>
          </div>
        ) : (
          // SỬ DỤNG GIAO DIỆN CARD HOẶC BẢNG NÂNG CẤP
          // Dùng bảng cho màn hình lớn, nhưng style lại để đẹp và dễ đọc hơn
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Mã ĐH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              {/* Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {userOrders.map((order) => {
                  const status = getStatusStyle(order.trangThai);
                  return (
                    <tr
                      key={order.donHangID}
                      className="hover:bg-[#f7fafc] transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#00809D]">
                        #{order.donHangID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-sm">
                        {order.Saches.slice(0, 2).map(
                          (
                            item,
                            idx // Hiển thị tối đa 2 sản phẩm
                          ) => (
                            <div key={idx} className="truncate">
                              {item.tenSach} (x{item.DonHang_Sach.soLuong})
                            </div>
                          )
                        )}
                        {order.Saches.length > 2 && (
                          <div className="text-xs italic text-gray-500 mt-1">
                            ... và {order.Saches.length - 2} sản phẩm khác.
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${status.bgColor} ${status.color}`}
                        >
                          <status.icon className="w-3 h-3 mr-1.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        {order.tongTien.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/chitietdonhang/${order.donHangID}`}
                          className="flex items-center justify-center gap-2 bg-[#00809D] text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-md hover:bg-[#006b85] transition duration-200"
                        >
                          <FaSearch className="w-3 h-3" /> Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Giao diện Card cho Mobile (md:hidden) */}
            <div className="space-y-4 p-4 md:hidden">
              {userOrders.map((order) => {
                const status = getStatusStyle(order.trangThai);
                return (
                  <div
                    key={order.donHangID}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                  >
                    <div className="flex justify-between items-start mb-3 border-b pb-3">
                      <h3 className="text-lg font-bold text-[#00809D]">
                        Đơn hàng #{order.donHangID}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${status.bgColor} ${status.color}`}
                      >
                        <status.icon className="w-3 h-3 mr-1.5" />
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                        **Ngày đặt:** {formatDate(order.createdAt)}
                      </p>
                      <p className="flex items-center font-bold text-red-600">
                        <FaMoneyBillWave className="w-4 h-4 mr-2 text-red-500" />
                        **Tổng tiền:** {order.tongTien.toLocaleString()}đ
                      </p>
                      <p className="pt-2 text-gray-500 border-t mt-3">
                        **Sản phẩm:** {order.Saches.length} loại
                      </p>
                      <ul className="list-disc list-inside ml-2">
                        {order.Saches.slice(0, 1).map((item, idx) => (
                          <li key={idx}>
                            {item.tenSach} (x{item.DonHang_Sach.soLuong})
                          </li>
                        ))}
                        {order.Saches.length > 1 && (
                          <li className="text-xs italic text-gray-500">
                            ... và {order.Saches.length - 1} sản phẩm khác.
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <Link
                        to={`/chitietdonhang/${order.donHangID}`}
                        className="w-full text-center flex items-center justify-center gap-2 bg-[#00809D] text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:bg-[#006b85] transition duration-200"
                      >
                        <FaSearch className="w-4 h-4" /> Xem Chi Tiết
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LichSuMuaHang;
