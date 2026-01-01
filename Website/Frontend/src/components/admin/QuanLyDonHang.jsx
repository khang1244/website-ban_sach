import React, { useState, useEffect, useCallback } from "react";
import {
  capNhatTrangThaiDonHang,
  layTatCaDonHang,
  layDonHangTheoID,
} from "../../lib/don-hang-apis";
import ThongBaoChay from "./ThongBaoChay";

const STATUS_OPTIONS = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã trả hàng",
  "Đã hủy",
];

function QuanLyDonHang() {
  const [selectedOrder, setSelectedOrder] = useState(null); // Để mở modal khi nhấn vào "Xem"
  const [filterStatus, setFilterStatus] = useState(""); // Để lưu trạng thái lọc
  const [userOrder, setUserOrder] = useState([]);
  // Tạo biến trạng thái lưu dữ liệu chi tiết đơn hàng
  const [duLieuDonHang, setDuLieuDonHang] = useState(null);
  const [thongBao, setThongBao] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const hienThongBao = useCallback((type, title, message) => {
    setThongBao({ show: true, type, title, message });
    setTimeout(() => {
      setThongBao({ show: false, type: "info", title: "", message: "" });
    }, 3000);
  }, []);

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

  // Lấy ảnh đầu tiên của sách trong đơn
  const getFirstImage = (hinhAnhs) => {
    if (Array.isArray(hinhAnhs) && hinhAnhs.length > 0) {
      return hinhAnhs[0]?.url || null;
    }
    return null;
  };
  // Xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (donHangID, newStatus) => {
    const trangThaiCu = userOrder;
    const updatedOrders = userOrder.map((order) => {
      if (order.donHangID === donHangID) {
        return { ...order, trangThai: newStatus };
      } else {
        return order;
      }
    });
    setUserOrder(updatedOrders);

    try {
      const phanHoiTuSever = await capNhatTrangThaiDonHang(
        donHangID,
        newStatus
      );

      if (phanHoiTuSever && phanHoiTuSever.success) {
        hienThongBao(
          "success",
          "Thành công",
          "Cập nhật trạng thái đơn hàng thành công!"
        );
      } else {
        setUserOrder(trangThaiCu);
        hienThongBao(
          "error",
          "Thất bại",
          phanHoiTuSever?.message || "Không thể cập nhật trạng thái đơn hàng."
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      setUserOrder(trangThaiCu);
      hienThongBao(
        "error",
        "Có lỗi",
        "Không thể cập nhật trạng thái đơn hàng, thử lại sau nhé!"
      );
    }
  };
  // Lấy danh sách đơn hàng từ server khi component được gắn vào DOM
  useEffect(() => {
    async function napDuLieuDonHang() {
      try {
        const res = await layTatCaDonHang();
        setUserOrder(Array.isArray(res) ? res : res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        hienThongBao(
          "error",
          "Có lỗi",
          "Không thể tải danh sách đơn hàng, vui lòng thử lại!"
        );
      }
    }
    napDuLieuDonHang();
  }, []);
  // Lấy chi tiết đơn hàng khi selectedOrder thay đổi
  useEffect(() => {
    const napDonHang = async () => {
      const duLieuDonHang = await layDonHangTheoID(selectedOrder?.donHangID);
      if (duLieuDonHang && duLieuDonHang.success) {
        setDuLieuDonHang(duLieuDonHang.data);
      }
    };
    napDonHang();
  }, [selectedOrder]);

  // Mở modal chi tiết đơn hàng
  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng đã chọn để hiển thị trong modal
  };

  // Reload danh sách đơn hàng từ server
  const reloadDonHang = async () => {
    try {
      const res = await layTatCaDonHang();
      setUserOrder(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải lại đơn hàng:", error);
      hienThongBao(
        "error",
        "Có lỗi",
        "Không thể tải lại danh sách đơn hàng, thử lại sau nhé!"
      );
    }
  };

  // Đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
    // Reload danh sách đơn hàng khi đóng modal để cập nhật trạng thái mới
    reloadDonHang();
  };
  // --- Lọc đơn hàng theo trạng thái ---
  const filteredOrders = userOrder.filter((order) => {
    if (!filterStatus) return true; // không lọc -> hiện tất cả
    return order.trangThai === filterStatus; // lọc theo trạng thái
  });

  // --- Phân trang gom gọn ---
  const donHangLoc = filteredOrders;
  const tongSoDonHang = donHangLoc.length;
  const tongSoTrang = Math.max(1, Math.ceil(tongSoDonHang / donHangMotTrang));
  const trangDangXem = Math.min(trangHienTai, tongSoTrang);
  const viTriBatDau = (trangDangXem - 1) * donHangMotTrang;
  const donHangTrongTrang = donHangLoc.slice(
    viTriBatDau,
    viTriBatDau + donHangMotTrang
  );

  // Điều chỉnh trang khi bộ lọc hoặc dữ liệu đổi
  useEffect(() => {
    setTrangHienTai(1);
  }, [filterStatus]);
  useEffect(() => {
    if (trangHienTai > tongSoTrang) setTrangHienTai(tongSoTrang);
  }, [trangHienTai, tongSoTrang]);

  const chuyenTrang = (trang) => {
    if (trang >= 1 && trang <= tongSoTrang) setTrangHienTai(trang);
  };
  // Helper function để định dạng tiền tệ
  const formatMoney = (value) =>
    typeof value === "number"
      ? value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
      : "-";

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#f7f9fc]">
      <ThongBaoChay
        show={thongBao.show}
        type={thongBao.type}
        title={thongBao.title}
        message={thongBao.message}
        onClose={() =>
          setThongBao({ show: false, type: "info", title: "", message: "" })
        }
      />
      <h1 className="text-3xl font-bold mb-6 text-[#004C61]">
        Quản Lý Đơn Hàng
      </h1>

      {/* Bộ lọc theo trạng thái */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          Lọc theo:
        </span>
        <div className="flex-1 flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#004C61] text-black bg-white font-medium transition-all duration-200 hover:border-gray-300"
          >
            <option value="">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {donHangTrongTrang && donHangTrongTrang.length > 0 ? (
                // Duyệt các đơn hàng đã được cắt theo trang
                donHangTrongTrang.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-[#F9FAFB] transition-colors duration-300 text-black"
                  >
                    <td className="py-3 px-5 w-16 text-sm font-medium">
                      {/* Mã đơn hàng hiển thị theo thứ tự tổng, không chỉ index trong trang */}
                      # {order.donHangID}
                    </td>
                    <td className="py-3 px-5 text-sm">{order.tenNguoiDung}</td>
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
                        disabled={
                          order.trangThai === "Đã hủy" ||
                          order.trangThai === "Đã trả hàng"
                        }
                        className={`border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#004C61] ${
                          order.trangThai === "Đã hủy" ||
                          order.trangThai === "Đã trả hàng"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="py-8 px-5 text-center text-gray-500"
                  >
                    Không có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* --- Phân trang đơn giản --- */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {trangDangXem} / {tongSoTrang}
          </div>
          <div className="flex items-center gap-2 text-black">
            <button
              onClick={() => chuyenTrang(trangDangXem - 1)}
              disabled={trangDangXem === 1}
              className={`px-3 py-1 rounded-md border ${
                trangDangXem === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Trước
            </button>
            {/* Hiển thị các nút trang (nếu nhiều trang có thể tối giản) */}
            {Array.from({ length: tongSoTrang }).map((_, i) => (
              <button
                key={i}
                onClick={() => chuyenTrang(i + 1)}
                className={`px-3 py-1 rounded-md border ${
                  trangDangXem === i + 1
                    ? "bg-[#004C61] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => chuyenTrang(trangDangXem + 1)}
              disabled={trangDangXem === tongSoTrang}
              className={`px-3 py-1 rounded-md border ${
                trangDangXem === tongSoTrang
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
              {selectedOrder.tenNguoiDung}
            </div>
            <div className="mb-4">
              <strong>SĐT: </strong>
              {selectedOrder.soDienThoaiKH}
            </div>
            <div className="mb-4">
              <strong>Địa chỉ: </strong>
              {selectedOrder.diaChiGiaoHang}
            </div>
            <div className="mb-4 text-black">
              <strong> Mã giảm giá: </strong>
              <span className="">
                {duLieuDonHang?.tienGiam && duLieuDonHang?.tienGiam !== ""
                  ? "-" + duLieuDonHang.tienGiam.toLocaleString() + "đ"
                  : "Không sử dụng"}
              </span>
            </div>
            <div className="mb-4 text-black">
              <strong> Phương thức thanh toán: </strong>
              <span className="">{duLieuDonHang?.phuongThucThanhToan}</span>
            </div>
            <div className="mb-4 text-black">
              <strong className="">Phí vận chuyển: </strong>
              <span>
                {formatMoney(
                  duLieuDonHang?.PhuongThucGiaoHang?.phiGiaoHang || 0
                )}{" "}
                đ
                {duLieuDonHang?.PhuongThucGiaoHang?.tenPhuongThuc && (
                  <span className="text-gray-600">
                    {" "}
                    ({duLieuDonHang.PhuongThucGiaoHang.tenPhuongThuc})
                  </span>
                )}
              </span>
            </div>
            <div className="mb-4">
              <table className="w-full text-left  text-black">
                <thead>
                  <tr className="border-b text-black">
                    <th className="py-2">Ảnh</th>
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
                        <td className="py-3 w-16">
                          <div className="w-13 h-15 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center">
                            {getFirstImage(item.hinhAnhs) ? (
                              <img
                                src={getFirstImage(item.hinhAnhs)}
                                alt={item.tenSach}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            )}
                          </div>
                        </td>
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

export default QuanLyDonHang;
