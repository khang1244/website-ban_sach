import React, { useState } from "react";

// Demo/mock data for orders
const initialOrders = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Lê Lợi, Q.1, TP.HCM",
    date: "2025-09-10",
    total: 250000,
    status: "Chờ xác nhận",
    items: [
      { name: "Thần Đồng Đất Phương Nam", qty: 2, price: 100000 },
      { name: "Truyện tranh", qty: 1, price: 50000 },
    ],
  },
  {
    id: 2,
    customer: "Trần Thị B",
    phone: "0912345678",
    address: "456 Nguyễn Trãi, Q.5, TP.HCM",
    date: "2025-09-11",
    total: 180000,
    status: "Đang giao",
    items: [
      { name: "Ngôn tình", qty: 1, price: 80000 },
      { name: "Kinh dị", qty: 2, price: 50000 },
    ],
  },
];

const STATUS_OPTIONS = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

function QuanLiDonHang() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null); // Để mở modal khi nhấn vào "Xem"
  const [searchQuery, setSearchQuery] = useState(""); // Để lưu giá trị tìm kiếm

  // Update order status
  const handleStatusChange = (id, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === id) {
        return { ...order, status: newStatus };
      } else {
        return order;
      }
    });
    setOrders(updatedOrders);
  };

  // Mở modal chi tiết đơn hàng
  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng đã chọn để hiển thị trong modal
  };

  // Đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Tìm kiếm đơn hàng theo tên hoặc số điện thoại
  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery)
  );

  // Xóa đơn hàng
  const handleDeleteOrder = (id) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    setOrders(updatedOrders);
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
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-[#F9FAFB] transition-colors duration-300 text-black"
                >
                  <td className="py-3 px-5 text-sm font-medium">{idx + 1}</td>
                  <td className="py-3 px-5 text-sm">{order.customer}</td>
                  <td className="py-3 px-5 text-sm">{order.phone}</td>
                  <td className="py-3 px-5 text-sm">{order.address}</td>
                  <td className="py-3 px-5 text-sm">{order.date}</td>
                  <td className="py-3 px-5 text-sm">
                    {order.total.toLocaleString()} VNĐ
                  </td>
                  <td className="py-3 px-5 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
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
                      onClick={() => handleDeleteOrder(order.id)}
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
              {selectedOrder.customer}
            </div>
            <div className="mb-4">
              <strong>SĐT: </strong>
              {selectedOrder.phone}
            </div>
            <div className="mb-4">
              <strong>Địa chỉ: </strong>
              {selectedOrder.address}
            </div>
            <div className="mb-4">
              <strong>Sản phẩm:</strong>
              <ul className="list-disc ml-5">
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>
                    {item.name} x {item.qty} ({item.price.toLocaleString()} VNĐ)
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <strong>Tổng tiền: </strong>
              {selectedOrder.total.toLocaleString()} VNĐ
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
