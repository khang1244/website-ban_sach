import React, { useState } from "react";
import {
  taoKhuyenMai,
  nhanTatCaKhuyenMai,
  capNhatKhuyenMai,
  xoaKhuyenMai,
} from "../../lib/khuyenmai-apis";
import { layTatCaDonHang } from "../../lib/don-hang-apis";
import { useEffect } from "react";
import ThongBaoChay from "../../components/admin/ThongBaoChay"; // đường dẫn tuỳ vị trí file

function QuanLyKhuyenMai() {
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
  // trạng thái danh sách mã khuyến mãi
  const [promos, setPromos] = useState([]);
  // lưu các mã khuyến mãi đã được sử dụng trong đơn hàng
  const [usedPromoIds, setUsedPromoIds] = useState([]);
  // --- PHÂN TRANG giống QuanLyDonHang ---
  const promosMotTrang = 4; // số mục mỗi trang
  const [trangHienTai, setTrangHienTai] = useState(1);
  // trạng thái biểu mẫu
  const [form, setForm] = useState({
    khuyenMaiID: "",
    moTa: "",
    giaTriGiam: 0,
    ngayHetHan: "",
    giaCoBan: 0,
    trangThai: true,
    soLuong: 0,
    typeof: "%",
  });
  const [editId, setEditId] = useState(null); // lưu ID của mã khuyến mãi đang chỉnh sửa

  // Hàm xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Hàm xử lý gửi form (thêm hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Cập nhật khuyến mãi
    if (editId) {
      // Cập nhật giao diện ngay lập tức
      const danhSachMaKhuyenMaiDaCapNhat = promos.map((p) => {
        if (p.khuyenMaiID === editId) {
          return { ...form, khuyenMaiID: editId };
        } else {
          return p;
        }
      });
      // Gọi API để cập nhật khuyến mãi
      await capNhatKhuyenMai(editId, { ...form });
      setPromos(danhSachMaKhuyenMaiDaCapNhat);
      showToast("success", "Thành công", "Cập nhật khuyến mãi thành công!");
      setEditId(null);
    } else {
      // thêm khuyến mãi mới
      setPromos([...promos, { ...form }]); // giúp cập nhật giao diện ngay lập tức
      // Gọi API để tạo khuyến mãi
      await taoKhuyenMai({ ...form });
      setPromos([...promos, { ...form }]);
      showToast("success", "Thành công", "Thêm khuyến mãi mới thành công!");
    }
    setForm({
      khuyenMaiID: "",
      moTa: "",
      giaTriGiam: 0,
      ngayHetHan: "",
      giaCoBan: 0,
      trangThai: true,
      soLuong: 0,
      typeof: "%",
    });
  };

  // Hàm chỉnh sửa mã khuyến mãi
  const handleEdit = (promo) => {
    const ngayHetHan = new Date(promo.ngayHetHan); // Thu Sep 25 2025 07:00:00 GMT+0700 (Indochina Time)
    const formattedDate = ngayHetHan.toISOString().split("T")[0]; // Định dạng lại ngày thành "YYYY-MM-DD"
    setForm({ ...promo, ngayHetHan: formattedDate });

    setEditId(promo.khuyenMaiID);
  };

  // Xóa mã khuyến mãi
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) return;
    setPromos(promos.filter((p) => p.khuyenMaiID !== id)); // Cập nhật giao diện ngay lập tức
    // Gọi API để xóa mã khuyến mãi
    await xoaKhuyenMai(id);
    setPromos(promos.filter((p) => p.khuyenMaiID !== id));
    showToast("success", "Thành công", "Khuyến mãi đã được xóa!");
  };

  // lấy tất cả mã khuyến mãi trong bảng khuyến mãi
  useEffect(() => {
    const napTatCaMaKhuyenMai = async () => {
      const data = await nhanTatCaKhuyenMai();
      setPromos(data);
    };
    // Lấy tất cả đơn hàng để xác định mã khuyến mãi đã dùng
    const napDonHang = async () => {
      const res = await layTatCaDonHang();
      if (res && res.success && Array.isArray(res.data)) {
        // Lấy danh sách mã khuyến mãi đã dùng (loại bỏ null/undefined)
        const used = res.data.map((dh) => dh.khuyenMaiID).filter(Boolean);
        setUsedPromoIds(used);
      }
    };
    napTatCaMaKhuyenMai();
    napDonHang();
  }, []);

  // Khi `promos` thay đổi, đảm bảo trang hiện tại không vượt quá tổng trang
  useEffect(() => {
    const tongTrang = Math.max(1, Math.ceil(promos.length / promosMotTrang));
    setTrangHienTai((prev) => Math.min(prev, tongTrang));
  }, [promos]);

  // Hàm định dạng ngày tháng từ ISO sang dd/mm/yyyy
  const formatDate = (isoDate) => {
    if (!isoDate) return "";

    // 1. Tách chuỗi tại ký tự 'T' để loại bỏ phần giờ và múi giờ
    // Ví dụ: "2025-10-03T00:00:00.000Z" sẽ thành ["2025-10-03", "00:00:00.000Z"]
    const datePart = isoDate.split("T")[0];

    // 2. Tách phần ngày-tháng-năm (đã được làm sạch)
    const [year, month, day] = datePart.split("-");

    // 3. Trả về định dạng mong muốn
    return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
  };

  // tính toán phân trang
  const tongTrang = Math.max(1, Math.ceil(promos.length / promosMotTrang));
  const promosHienThi = promos.slice(
    (trangHienTai - 1) * promosMotTrang,
    trangHienTai * promosMotTrang
  );

  return (
    <div className="w-full space-y-6">
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

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Quản Lý Khuyến Mãi
          </h1>
        </div>
      </div>

      {/* Form thêm mới hoặc chỉnh sửa mã khuyến mãi */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-500 to-purple-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {editId ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
            {/* Cột trái: Thông tin chính */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mã khuyến mãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="khuyenMaiID"
                  value={form.khuyenMaiID}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                  placeholder="VD: SALE20, FREESHIP"
                  required
                  disabled={editId !== null}
                />
                {editId && (
                  <p className="text-xs text-slate-500 mt-1">
                    Không thể thay đổi mã khi đang chỉnh sửa
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="moTa"
                  value={form.moTa}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Mô tả ngắn gọn điều kiện áp dụng"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="soLuong"
                    value={form.soLuong}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Trạng thái
                  </label>
                  <div className="flex items-center h-[42px] border border-slate-300 rounded-lg px-4 bg-slate-50">
                    <input
                      type="checkbox"
                      name="trangThai"
                      checked={form.trangThai}
                      onChange={(e) =>
                        setForm({ ...form, trangThai: e.target.checked })
                      }
                      className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-slate-700 text-sm font-medium">
                      {form.trangThai
                        ? "✓ Đang hoạt động"
                        : "⊘ Ngừng kích hoạt"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Điều kiện áp dụng */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Loại giảm giá
                </label>
                <select
                  name="typeof"
                  value={form.typeof}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="%">Phần trăm (%)</option>
                  <option value="VNĐ">Số tiền (VNĐ)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Giá trị giảm
                </label>
                <input
                  type="number"
                  name="giaTriGiam"
                  value={form.giaTriGiam}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {form.typeof === "%"
                    ? "Nhập phần trăm giảm (VD: 20 = 20%)"
                    : "Nhập số tiền giảm (VD: 50000 = 50,000 VNĐ)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Giá cơ bản để áp dụng (VNĐ)
                </label>
                <input
                  type="number"
                  name="giaCoBan"
                  value={form.giaCoBan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Đơn hàng tối thiểu để áp dụng mã
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ngày hết hạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="ngayHetHan"
                  value={form.ngayHetHan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({
                    khuyenMaiID: "",
                    moTa: "",
                    giaTriGiam: 0,
                    ngayHetHan: "",
                    giaCoBan: 0,
                    trangThai: true,
                    soLuong: 0,
                    typeof: "%",
                  });
                  setEditId(null);
                }}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-sm hover:shadow-md transition-all"
            >
              {editId ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi mới"}
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách mã khuyến mãi */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Danh sách mã khuyến mãi
            </h2>
            <div className="text-sm text-slate-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
              <span className="font-medium text-purple-700">
                {promos.length} mã khuyến mãi
              </span>
            </div>
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mã
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Giá trị giảm
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Giá cơ bản
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Hết hạn
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {promosHienThi && promosHienThi.length > 0 ? (
                promosHienThi.map((promo, idx) => (
                  <tr
                    key={promo.khuyenMaiID}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {(trangHienTai - 1) * promosMotTrang + idx + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono text-purple-600 font-semibold tracking-wider">
                        {promo.khuyenMaiID}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-700 max-w-xs">
                        {promo.moTa}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {promo.giaTriGiam.toLocaleString()}
                        {promo.type === "VNĐ" || promo.typeof === "VNĐ"
                          ? " ₫"
                          : "%"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-slate-700">
                        {promo.giaCoBan.toLocaleString("vi-VN")} ₫
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-slate-700 font-medium">
                        {promo.soLuong}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          promo.trangThai
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {promo.trangThai ? "✓ Hoạt động" : "⊘ Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {formatDate(promo.ngayHetHan)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(promo)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(promo.khuyenMaiID)}
                          disabled={usedPromoIds.includes(promo.khuyenMaiID)}
                          className={`px-3 py-1.5 text-xs font-semibold border rounded-lg transition-all
                            ${
                              usedPromoIds.includes(promo.khuyenMaiID)
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                                : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                            }
                          `}
                          title={
                            usedPromoIds.includes(promo.khuyenMaiID)
                              ? "Mã đã được sử dụng trong đơn hàng, không thể xóa"
                              : "Xóa"
                          }
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <div className="text-slate-400">
                      <svg
                        className="mx-auto h-12 w-12 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium">
                        Chưa có mã khuyến mãi
                      </p>
                      <p className="text-sm mt-1">
                        Hãy thêm mã khuyến mãi mới để bắt đầu
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {tongTrang > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Hiển thị{" "}
                <span className="font-semibold text-slate-900">
                  {(trangHienTai - 1) * promosMotTrang + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(trangHienTai * promosMotTrang, promos.length)}
                </span>{" "}
                của{" "}
                <span className="font-semibold text-slate-900">
                  {promos.length}
                </span>{" "}
                mã
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTrangHienTai(Math.max(1, trangHienTai - 1))}
                  disabled={trangHienTai === 1}
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                    trangHienTai === 1
                      ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-purple-500"
                  }`}
                >
                  ← Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: tongTrang }).map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === tongTrang ||
                      (page >= trangHienTai - 1 && page <= trangHienTai + 1)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => setTrangHienTai(page)}
                          className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                            trangHienTai === page
                              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-purple-500"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === trangHienTai - 2 ||
                      page === trangHienTai + 2
                    ) {
                      return (
                        <span key={i} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() =>
                    setTrangHienTai(Math.min(tongTrang, trangHienTai + 1))
                  }
                  disabled={trangHienTai === tongTrang}
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                    trangHienTai === tongTrang
                      ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-purple-500"
                  }`}
                >
                  Tiếp →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default QuanLyKhuyenMai;
