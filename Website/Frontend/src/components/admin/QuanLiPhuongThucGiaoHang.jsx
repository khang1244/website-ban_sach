import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaShippingFast, // Icon chính cho giao hàng
  FaLayerGroup, // Icon cho trạng thái mặc định
  FaSearch, // Icon tìm kiếm
  FaMoneyBillWave, // Icon cho phí giao hàng
  FaClock, // Icon cho thời gian giao hàng
} from "react-icons/fa";
import {
  layTatCaPhuongThucGiaoHang,
  taoPhuongThucGiaoHang,
  capNhatPhuongThucGiaoHang,
  xoaPhuongThucGiaoHang,
  kichHoatPhuongThucGiaoHang,
  xoaVinhVienPhuongThucGiaoHang,
} from "../../lib/phuong-thuc-giao-hang-apis"; // Giữ nguyên imports API
import ThongBaoChay from "../../components/admin/ThongBaoChay"; // đường dẫn tuỳ vị trí file

/**
 * Component quản lý phương thức giao hàng
 * Cho phép admin thêm, sửa, xóa và quản lý các phương thức giao hàng
 */
function QuanLiPhuongThucGiaoHang() {
  // GIỮ NGUYÊN TẤT CẢ LOGIC VÀ STATE CỦA BẠN
  const [phuongThucGiaoHangs, setPhuongThucGiaoHangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    tenPhuongThuc: "",
    phiGiaoHang: "",
    thoiGianGiaoHang: "",
    trangThai: "active",
    macDinh: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadPhuongThucGiaoHangs = async () => {
    try {
      setLoading(true);
      const response = await layTatCaPhuongThucGiaoHang();
      if (response.success) {
        setPhuongThucGiaoHangs(response.data);
        setError("");
      } else {
        setError("Không thể tải danh sách phương thức giao hàng");
      }
    } catch (err) {
      console.error("Lỗi khi tải phương thức giao hàng:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhuongThucGiaoHangs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      tenPhuongThuc: "",
      phiGiaoHang: "",
      thoiGianGiaoHang: "",
      trangThai: "active",
      macDinh: false,
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData({
      tenPhuongThuc: item.tenPhuongThuc,
      phiGiaoHang: item.phiGiaoHang.toString(),
      thoiGianGiaoHang: item.thoiGianGiaoHang,
      trangThai: item.trangThai,
      macDinh: item.macDinh,
    });
    setEditingItem(item);
    setShowModal(true);
  };
  // Xử lí đóng modal
  const handleCancel = () => {
    setShowModal(false);
    resetForm();
    setError(""); // Xóa lỗi khi đóng modal
  };

  // Xử lí submit form thêm/sửa phương thức giao hàng
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    // Validate dữ liệu
    if (!formData.tenPhuongThuc.trim()) {
      setError("Vui lòng nhập tên phương thức giao hàng");
      return;
    }

    if (
      !formData.phiGiaoHang ||
      parseFloat(formData.phiGiaoHang) < 0 ||
      isNaN(parseFloat(formData.phiGiaoHang))
    ) {
      setError("Vui lòng nhập phí giao hàng hợp lệ (số không âm)");
      return;
    }

    if (!formData.thoiGianGiaoHang.trim()) {
      setError("Vui lòng nhập thời gian giao hàng");
      return;
    }

    try {
      setLoading(true); // Bật loading khi gửi dữ liệu
      setError(""); // Xóa lỗi cũ
      let response;

      if (editingItem) {
        // Cập nhật phương thức giao hàng
        response = await capNhatPhuongThucGiaoHang(
          editingItem.phuongThucGiaoHangID,
          formData
        );
      } else {
        // Thêm phương thức giao hàng mới
        response = await taoPhuongThucGiaoHang(formData);
      }

      if (response.success) {
        setSuccessMessage(
          editingItem
            ? showToast(
                "success",
                "Thành công",
                "Cập nhật phương thức giao hàng thành công!"
              )
            : showToast(
                "success",
                "Thành công",
                "Thêm phương thức giao hàng mới thành công!"
              )
        );
        setShowModal(false);
        resetForm();
        await loadPhuongThucGiaoHangs(); // Tải lại danh sách

        // Ẩn thông báo thành công sau 3 giây
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Có lỗi xảy ra khi lưu");
      }
    } catch (err) {
      console.error("Lỗi khi lưu phương thức giao hàng:", err);
      setError("Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  //Xử lí xóa vĩnh viễn phương thức giao hàng khỏi database
  const handleDeleteXoaVinhVien = async (id) => {
    if (
      !window.confirm(
        "Xóa vĩnh viễn phương thức giao hàng này sẽ không thể khôi phục lại. Bạn có chắc chắn muốn tiếp tục?"
      )
    )
      return;
    try {
      setLoading(true);
      const response = await xoaVinhVienPhuongThucGiaoHang(id);
      if (response.success) {
        showToast(
          "success",
          "Thành công",
          "Xóa phương thức giao hàng thành công!"
        );
        await loadPhuongThucGiaoHangs();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else setError(response.message || "Có lỗi xảy ra khi xoá vĩnh viễn");
    } catch (err) {
      console.error("Lỗi xoá vĩnh viễn:", err);
      setError("Có lỗi xảy ra khi xoá vĩnh viễn");
    } finally {
      setLoading(false);
    }
  };

  /* Xử lý kích hoạt/vô hiệu hóa phương thức giao hàng*/
  const handleToggleStatus = async (item) => {
    try {
      setLoading(true);
      let response;

      if (item.trangThai === "active") {
        // Vô hiệu hóa
        response = await xoaPhuongThucGiaoHang(item.phuongThucGiaoHangID);
      } else {
        // Kích hoạt lại
        response = await kichHoatPhuongThucGiaoHang(item.phuongThucGiaoHangID);
      }

      if (response.success) {
        setSuccessMessage(
          item.trangThai === "active"
            ? showToast(
                "success",
                "Thành công",
                "Đã vô hiệu hóa phương thức giao hàng!"
              )
            : showToast(
                "success",
                "Thành công",
                "Đã kích hoạt phương thức giao hàng!"
              )
        );
        await loadPhuongThucGiaoHangs();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Có lỗi xảy ra khi thay đổi trạng thái");
      }
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái:", err);
      setError("Có lỗi xảy ra khi thay đổi trạng thái");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lọc danh sách phương thức giao hàng theo từ khóa tìm kiếm và trạng thái
   */
  const filteredPhuongThucGiaoHangs = phuongThucGiaoHangs.filter((item) => {
    const matchesSearch =
      item.tenPhuongThuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.thoiGianGiaoHang.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Định dạng tiền tệ VND
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // thông báo chạy khi thêm, sửa, xóa
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(
      () => setToast({ show: false, type: "", title: "", message: "" }),
      3000
    );
  };
  // GIAO DIỆN NGƯỜI DÙNG
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Toast */}
      <ThongBaoChay
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() =>
          setToast({ show: false, type: "", title: "", message: "" })
        }
      />
      {/* Header và nút thêm */}
      <div className="flex justify-between items-start md:items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-3">
          <FaShippingFast className="text-3xl text-blue-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản Lý Phương Thức Giao Hàng
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Thêm, sửa, vô hiệu hóa và quản lý các lựa chọn giao hàng cho cửa
              hàng.
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 transition duration-300 transform hover:scale-105"
          disabled={loading}
          title="Thêm Phương Thức Giao Hàng Mới"
        >
          <FaPlus />
          <span className="hidden md:inline">Thêm Phương Thức</span>
        </button>
      </div>
      {/* Thông báo */}
      {(error || successMessage) && (
        <div
          className={`px-4 py-3 rounded-xl mb-4 font-medium ${
            error
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {error || successMessage}
        </div>
      )}
      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
          {/* Tìm kiếm */}
          <div className="flex-1 relative text-gray-800">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phương thức hoặc thời gian giao hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="flex items-center space-x-3 text-gray-800">
            <label className="text-base font-medium text-gray-700 whitespace-nowrap">
              Trạng thái:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã vô hiệu hóa</option>
            </select>
          </div>
        </div>
      </div>
      {/* Bảng danh sách phương thức giao hàng */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : filteredPhuongThucGiaoHangs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            <FaTimes className="mx-auto text-4xl mb-2" />
            Không có phương thức giao hàng nào được tìm thấy.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên Phương Thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phí Giao Hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thời Gian
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mặc Định
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPhuongThucGiaoHangs.map((item) => (
                  <tr
                    key={item.phuongThucGiaoHangID}
                    className="hover:bg-blue-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <FaShippingFast className="mr-3 text-blue-500" />
                        {item.tenPhuongThuc}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800 font-semibold">
                        {formatCurrency(item.phiGiaoHang)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 italic">
                        {item.thoiGianGiaoHang}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${
                          item.trangThai === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.trangThai === "active"
                          ? "Hoạt động"
                          : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.macDinh ? (
                        <FaLayerGroup
                          className="text-xl text-yellow-600 mx-auto"
                          title="Phương thức mặc định"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        {/* Nút chỉnh sửa */}
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition duration-150"
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="text-lg" />
                        </button>

                        {/* Nút bật/tắt trạng thái */}
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`p-2 rounded-full transition duration-150 ${
                            item.trangThai === "active"
                              ? "text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200"
                              : "text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200"
                          }`}
                          title={
                            item.trangThai === "active"
                              ? "Vô hiệu hóa"
                              : "Kích hoạt"
                          }
                        >
                          {item.trangThai === "active" ? (
                            <FaToggleOn className="text-lg" />
                          ) : (
                            <FaToggleOff className="text-lg" />
                          )}
                        </button>

                        {/* Nút xóa vĩnh viễn */}
                        <button
                          onClick={() =>
                            handleDeleteXoaVinhVien(item.phuongThucGiaoHangID)
                          }
                          className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-100 hover:bg-red-200 transition duration-150"
                          title="Xóa Vĩnh Viễn"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Footer thống kê */}
      <div className="mt-8 text-base text-gray-700 bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <span className="font-semibold">Tổng cộng:</span>{" "}
        {filteredPhuongThucGiaoHangs.length} phương thức giao hàng
        {searchTerm && (
          <span className="text-sm italic text-gray-500">
            {" "}
            (đã lọc từ {phuongThucGiaoHangs.length} phương thức)
          </span>
        )}
      </div>
      {/* Modal thêm/sửa phương thức giao hàng (Sử dụng cấu trúc Modal chuyên nghiệp hơn) */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-200 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-900 flex items-center">
              <FaEdit className="mr-3 text-blue-600" />
              {editingItem
                ? "Chỉnh Sửa Phương Thức Giao Hàng"
                : "Thêm Phương Thức Giao Hàng Mới"}
            </h2>

            {/* Hiển thị lỗi ngay trong modal */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tên phương thức */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <FaShippingFast className="mr-2" /> Tên Phương Thức{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="tenPhuongThuc"
                  value={formData.tenPhuongThuc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
                  placeholder="Ví dụ: Giao hàng nhanh (24h), Tiết kiệm (3-5 ngày)..."
                  required
                />
              </div>

              {/* Phí giao hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <FaMoneyBillWave className="mr-2" /> Phí Giao Hàng (VND){" "}
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="phiGiaoHang"
                  value={formData.phiGiaoHang}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              {/* Thời gian giao hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <FaClock className="mr-2" /> Thời Gian Giao Hàng{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="thoiGianGiaoHang"
                  value={formData.thoiGianGiaoHang}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
                  placeholder="Ví dụ: 1-2 ngày, 3-5 ngày làm việc..."
                  required
                />
              </div>

              {/* Trạng thái và Mặc định */}
              <div className="grid grid-cols-2 gap-4">
                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng Thái
                  </label>
                  <select
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white shadow-sm"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Vô hiệu hóa</option>
                  </select>
                </div>

                {/* Mặc định */}
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    name="macDinh"
                    checked={formData.macDinh}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700 select-none">
                    Đặt làm Mặc định
                  </label>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-medium shadow-sm"
                >
                  <span className="flex items-center">
                    <FaTimes className="mr-2" /> Hủy
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : editingItem ? (
                    <>
                      <FaCheck className="mr-2" /> Cập nhật
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Thêm mới
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLiPhuongThucGiaoHang;
