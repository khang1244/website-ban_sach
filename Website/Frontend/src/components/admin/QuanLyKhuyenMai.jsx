import React, { useState } from "react";
import {
  taoKhuyenMai,
  nhanTatCaKhuyenMai,
  capNhatKhuyenMai,
  xoaKhuyenMai,
} from "../../lib/khuyenmai-apis";
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
  const [editId, setEditId] = useState(null);

  // Hàm xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

    console.log("Ngày hết hạn:", ngayHetHan);

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
    napTatCaMaKhuyenMai();
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
    <div className="max-w-6xl mx-auto p-6">
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
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Quản lý mã khuyến mãi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tạo, chỉnh sửa và theo dõi các mã khuyến mãi.
        </p>
      </div>

      {/* form thêm mới hoặc chỉnh sửa mã khuyến mãi */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 mb-10"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Biểu mẫu</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái: Thông tin chính */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mã khuyến mãi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="khuyenMaiID"
                value={form.khuyenMaiID}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5
              text-slate-900 caret-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="VD: SALE20, FREESHIP"
                required
                disabled={editId !== null} // không cho phép chỉnh sửa mã khi đang ở chế độ chỉnh sửa
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mô tả <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="moTa"
                value={form.moTa}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5
              text-slate-900 caret-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Mô tả ngắn gọn điều kiện áp dụng"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số lượng
                </label>
                <input
                  type="number"
                  name="soLuong"
                  value={form.soLuong}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5
                text-slate-900 caret-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  min="0"
                  placeholder="VD: 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trạng thái
                </label>
                <div className="flex items-center h-[42px]">
                  <input
                    type="checkbox"
                    name="trangThai"
                    checked={form.trangThai}
                    onChange={(e) =>
                      setForm({ ...form, trangThai: e.target.checked })
                    }
                    className="h-5 w-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <span className="ml-2 text-slate-700 text-sm">
                    {form.trangThai ? "Đang hoạt động" : "Ngừng kích hoạt"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Điều kiện áp dụng */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Giá trị giảm
              </label>
              <input
                type="number"
                name="giaTriGiam"
                value={form.giaTriGiam}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5
              text-slate-900 caret-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                min="0"
                placeholder="VD: 20 hoặc 50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Giá cơ bản để giảm
              </label>
              <input
                type="number"
                name="giaCoBan"
                value={form.giaCoBan}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5
              text-slate-900 caret-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                min="0"
                placeholder="VD: 200000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ngày hết hạn <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="ngayHetHan"
                value={form.ngayHetHan}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5
              text-slate-900 caret-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 [color-scheme:light]"
                required
              />
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 flex items-center justify-end">
          <button
            type="submit"
            className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold shadow-sm
            ${
              editId
                ? "bg-cyan-50 text-black border border-cyan-600 hover:bg-cyan-100"
                : "bg-cyan-600 text-white hover:bg-cyan-700"
            }`}
          >
            {editId ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
      {/* LIST - Giao diện Chuyên nghiệp hơn */}
      <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-100">
        {/* Tiêu đề và Tổng quan */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            ✨ Danh sách mã khuyến mãi
          </h2>
          <span className="mt-2 sm:mt-0 text-md font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            Tổng cộng:{" "}
            <strong className="text-gray-900">{promos.length}</strong> mã
          </span>
        </div>

        {/* Bảng (Table) */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className="py-3 px-5 font-semibold w-10">#</th>
                <th className="py-3 px-5 font-semibold">Mã</th>
                <th className="py-3 px-5 font-semibold">Mô tả</th>
                <th className="py-3 px-5 font-semibold text-right">
                  Giá trị giảm
                </th>
                <th className="py-3 px-5 font-semibold text-right">
                  Giá cơ bản
                </th>
                <th className="py-3 px-5 font-semibold text-center">
                  Số lượng
                </th>
                <th className="py-3 px-5 font-semibold text-center">
                  Trạng thái
                </th>
                <th className="py-3 px-5 font-semibold">Hết hạn</th>
                <th className="py-3 px-5 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {promosHienThi &&
                promosHienThi.length > 0 &&
                promosHienThi.map((promo, idx) => (
                  <tr
                    key={promo.khuyenMaiID}
                    className="hover:bg-indigo-50/20 transition-colors duration-150 text-sm text-gray-700"
                  >
                    {/* STT */}
                    <td className="py-3 px-5 font-medium text-gray-900">
                      {(trangHienTai - 1) * promosMotTrang + idx + 1}
                    </td>
                    {/* Mã */}
                    <td className="py-3 px-5 font-mono text-indigo-600 tracking-wider">
                      {promo.khuyenMaiID}
                    </td>
                    {/* Mô tả */}
                    <td className="py-3 px-5 max-w-xs truncate">
                      {promo.moTa}
                    </td>
                    <td className="py-3 px-5 font-medium text-right text-green-600">
                      {promo.giaTriGiam}
                      {/* Logic: Nếu type là VNĐ, hiển thị ' VNĐ', ngược lại hiển thị '%' */}
                      {promo.type === "VNĐ" ? " VNĐ" : "%"}
                    </td>
                    {/* Giá cơ bản */}
                    <td className="py-3 px-5 text-right font-medium">
                      {promo.giaCoBan.toLocaleString("vi-VN")} VNĐ
                    </td>
                    {/* Số lượng */}
                    <td className="py-3 px-5 text-center">{promo.soLuong}</td>
                    {/* Trạng thái (Sử dụng Badge) */}
                    <td className="py-3 px-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium transition-colors duration-150 ${
                          promo.trangThai
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {promo.trangThai ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    {/* Hết hạn */}
                    <td className="py-3 px-5 font-light text-gray-500">
                      {formatDate(promo.ngayHetHan)}
                    </td>
                    {/* Hành động */}
                    <td className="py-3 px-5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="mr-2 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-150 shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(promo.khuyenMaiID)}
                        className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-150 shadow-sm"
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
    </div>
  );
}
export default QuanLyKhuyenMai;
