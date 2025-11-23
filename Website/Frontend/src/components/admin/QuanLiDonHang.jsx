import React, { useState } from "react";
import { useEffect } from "react";
import {
  capNhatTrangThaiDonHang,
  layTatCaDonHang,
  xoaDonHangTheoID,
  layDonHangTheoID,
} from "../../lib/don-hang-apis";
import { layTatCaPhuongThucGiaoHang } from "../../lib/phuong-thuc-giao-hang-apis.js";

const STATUS_OPTIONS = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

function QuanLiDonHang() {
  const [selectedOrder, setSelectedOrder] = useState(null); // Để mở modal khi nhấn vào "Xem"
  const [searchQuery, setSearchQuery] = useState(""); // Để lưu giá trị tìm kiếm
  const [userOrder, setUserOrder] = useState([]);
  // Tạo biến trạng thái lưu dữ liệu chi tiết đơn hàng
  const [duLieuDonHang, setDuLieuDonHang] = useState(null);

  // Tạo biến trạng thái lưu danh sách phương thức giao hàng
  const [shippingMethods, setShippingMethods] = useState([]);
  // --- CẤU HÌNH PHÂN TRANG ---
  // Số đơn hàng hiển thị mỗi trang (theo yêu cầu: 4)
  const donHangMotTrang = 4; // 4 đơn hàng/trang
  // Trang hiện tại (1-based)
  const [trangHienTai, setTrangHienTai] = useState(1); // Trang đang hiển thị
  // Helper function để định dạng lại ngày tháng
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  // Update order status
  const handleStatusChange = async (donHangID, newStatus) => {
    const updatedOrders = userOrder.map((order) => {
      if (order.donHangID === donHangID) {
        return { ...order, trangThai: newStatus };
      } else {
        return order;
      }
    });
    setUserOrder(updatedOrders);

    // Gọi API để cập nhật trạng thái đơn hàng trên server
    const phanHoiTuSever = await capNhatTrangThaiDonHang(donHangID, newStatus);

    if (phanHoiTuSever && phanHoiTuSever.success) {
      alert("Cập nhật trạng thái đơn hàng thành công!");
    } else {
      alert(
        "Lỗi khi cập nhật trạng thái đơn hàng trên server:",
        phanHoiTuSever.message
      );
    }
  };
  useEffect(() => {
    async function napDuLieuDonHang() {
      const res = await layTatCaDonHang();
      console.log("Đơn hàng lấy từ server:", res);
      // Tùy cấu trúc trả về:
      setUserOrder(Array.isArray(res) ? res : res.data || []);
    }
    napDuLieuDonHang();
  }, []);
  useEffect(() => {
    const napDonHang = async () => {
      const duLieuDonHang = await layDonHangTheoID(selectedOrder?.donHangID);
      if (duLieuDonHang && duLieuDonHang.success) {
        // Xử lý dữ liệu đơn hàng nhận được từ server
        console.log("Dữ liệu đơn hàng:", duLieuDonHang.data);
        setDuLieuDonHang(duLieuDonHang.data);
      }
    };
    napDonHang();
  }, [selectedOrder]);

  // Nạp danh sách phương thức giao hàng từ server
  useEffect(() => {
    const napPhuongThucGiaoHang = async () => {
      // Giả sử gọi API để lấy danh sách phương thức giao hàng
      const response = await layTatCaPhuongThucGiaoHang();
      if (response && response.success) {
        console.log("Danh sách phương thức giao hàng:", response.data);

        setShippingMethods(response.data);
      }
    };
    napPhuongThucGiaoHang();
  }, []);
  // Mở modal chi tiết đơn hàng
  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng đã chọn để hiển thị trong modal
  };

  // Đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = userOrder.filter((order) => {
    const q = searchQuery.trim();
    if (!q) return true; // không nhập gì -> hiện tất cả
    return String(order.donHangID) === q; // tìm chính xác mã
    // Nếu muốn tìm "chứa" thay vì "chính xác": dùng includes(q)
  });

  // --- Tính phân trang từ filteredOrders ---
  // Tổng số trang dựa trên số phần tử và số phần tử/trang
  const tongTrang = Math.max(
    1,
    Math.ceil(filteredOrders.length / donHangMotTrang)
  ); // Tổng trang

  // Nếu bộ lọc thay đổi, reset về trang 1 để tránh trang vượt quá tổng
  useEffect(() => {
    setTrangHienTai(1); // Khi tìm kiếm thay đổi, quay về trang 1
  }, [searchQuery]);

  // Lấy danh sách đơn hàng hiển thị cho trang hiện tại
  const donHangHienThi = filteredOrders.slice(
    (trangHienTai - 1) * donHangMotTrang, // start index
    trangHienTai * donHangMotTrang // end index
  );

  // Xóa đơn hàng
  const handleDeleteOrder = (id) => {
    const updatedOrders = userOrder.filter((order) => order.donHangID !== id);
    setUserOrder(updatedOrders);
    // Gọi API để xóa đơn hàng trên server nếu cần thiết
    alert("Đơn hàng đã được xóa.");
    xoaDonHangTheoID(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#f7f9fc]">
      <h1 className="text-3xl font-bold mb-6 text-[#004C61]">
        Quản lý đơn hàng
      </h1>

      {/* Tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng (Tên hoặc SĐT)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#004C61] text-black"
        />
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#004C61]">
          Danh sách đơn hàng
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-[#F0F4F8]">
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  #
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Khách hàng
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  SĐT
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Địa chỉ
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Ngày đặt
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Tổng tiền
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Trạng thái
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Chi tiết
                </th>
                <th className="py-3 px-5 text-sm text-gray-600 font-medium">
                  Xóa
                </th>
              </tr>
            </thead>
            <tbody>
              {userOrder &&
                userOrder.length > 0 &&
                // Duyệt các đơn hàng đã được cắt theo trang
                donHangHienThi.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-[#F9FAFB] transition-colors duration-300 text-black"
                  >
                    <td className="py-3 px-5 text-sm font-medium">
                      {/* Mã đơn hàng hiển thị theo thứ tự tổng, không chỉ index trong trang */}
                      MĐH {(trangHienTai - 1) * donHangMotTrang + idx + 1}
                    </td>
                    <td className="py-3 px-5 text-sm">{order.tenKhachHang}</td>
                    <td className="py-3 px-5 text-sm">{order.soDienThoaiKH}</td>
                    <td className="py-3 px-5 text-sm">
                      {order.diaChiGiaoHang}
                    </td>
                    <td className="py-3 px-5 text-sm">
                      {formatDate(order.ngayDat)}
                    </td>
                    <td className="py-3 px-5 text-sm">
                      {order.tongTien.toLocaleString()} VNĐ
                    </td>
                    <td className="py-3 px-5 text-sm">
                      <select
                        value={order.trangThai}
                        onChange={(e) =>
                          handleStatusChange(order.donHangID, e.target.value)
                        }
                        className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#004C61]"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-5 text-sm">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-[#004C61] hover:text-[#007A99] font-semibold"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                    <td className="py-3 px-5 text-sm">
                      <button
                        onClick={() => handleDeleteOrder(order.donHangID)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* --- Phân trang đơn giản --- */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {trangHienTai} / {tongTrang}
          </div>
          <div className="flex items-center gap-2 text-black">
            <button
              onClick={() => setTrangHienTai(Math.max(1, trangHienTai - 1))}
              disabled={trangHienTai === 1}
              className={`px-3 py-1 rounded-md border ${
                trangHienTai === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Trước
            </button>
            {/* Hiển thị các nút trang (nếu nhiều trang có thể tối giản) */}
            {Array.from({ length: tongTrang }).map((_, i) => (
              <button
                key={i}
                onClick={() => setTrangHienTai(i + 1)}
                className={`px-3 py-1 rounded-md border ${
                  trangHienTai === i + 1
                    ? "bg-[#004C61] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setTrangHienTai(Math.min(tongTrang, trangHienTai + 1))
              }
              disabled={trangHienTai === tongTrang}
              className={`px-3 py-1 rounded-md border ${
                trangHienTai === tongTrang
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-2xl font-bold text-[#004C61] mb-4">
              Chi tiết đơn hàng
            </h3>
            <div className="mb-4">
              <strong>Khách hàng: </strong>
              {selectedOrder.tenKhachHang}
            </div>
            <div className="mb-4">
              <strong>SĐT: </strong>
              {selectedOrder.soDienThoaiKH}
            </div>
            <div className="mb-4">
              <strong>Địa chỉ: </strong>
              {selectedOrder.diaChiGiaoHang}
            </div>
            <div className="mb-3">
              <strong> Chi phí vận chuyển: </strong>
              <span className="">
                {shippingMethods
                  ?.find(
                    (m) =>
                      m.phuongThucGiaoHangID ===
                      duLieuDonHang?.phuongThucGiaoHangID
                  )
                  ?.phiGiaoHang.toLocaleString() + "đ"}
              </span>
            </div>
            <div className="mb-4">
              <table className="w-full text-left  text-black">
                <thead>
                  <tr className="border-b text-black">
                    <th className="py-2">Sản phẩm</th>
                    <th className="py-2">Số lượng</th>
                    <th className="py-2">Đơn giá</th>
                    <th className="py-2">Tạm tính</th>
                  </tr>
                </thead>
                <tbody>
                  {duLieuDonHang &&
                    duLieuDonHang.Saches.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 font-semibold text-[#00809D]">
                          {item.tenSach}
                        </td>
                        <td className="py-3">{item.DonHang_Sach.soLuong}</td>
                        <td className="py-3">
                          {item.DonHang_Sach.donGia.toLocaleString()}đ
                        </td>
                        <td className="py-3">
                          {(
                            item.DonHang_Sach.donGia * item.DonHang_Sach.soLuong
                          ).toLocaleString()}
                          đ
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mb-4">
              <strong>Tổng tiền: </strong>
              {selectedOrder.tongTien.toLocaleString()} VNĐ
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-[#004C61] text-white rounded-md hover:bg-[#007A99]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLiDonHang;
