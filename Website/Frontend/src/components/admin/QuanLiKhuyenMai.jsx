import React, { useState } from "react";
import {
  taoKhuyenMai,
  nhanTatCaKhuyenMai,
  capNhatKhuyenMai,
  xoaKhuyenMai,
} from "../../lib/khuyenmai-apis";
import { useEffect } from "react";
import ThongBaoChay from "../../components/admin/ThongBaoChay"; // đường dẫn tuỳ vị trí file

function QuanLiKhuyenMai() {
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
    setPromos(promos.filter((p) => p.khuyenMaiID !== id)); // Cập nhật giao diện ngay lập tức
    // Gọi API để xóa mã khuyến mãi
    await xoaKhuyenMai(id);
    setPromos(promos.filter((p) => p.khuyenMaiID !== id));
    showToast("info", "Đã xóa", "Khuyến mãi đã được xóa!");
  };

  // lấy tất cả mã khuyến mãi trong bảng khuyến mãi
  useEffect(() => {
    const napTatCaMaKhuyenMai = async () => {
      const data = await nhanTatCaKhuyenMai();
      setPromos(data);
    };
    napTatCaMaKhuyenMai();
  }, []);

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
      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60">
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách mã khuyến mãi
          </h2>
          <span className="text-sm text-slate-500">
            Tổng cộng: <strong>{promos.length}</strong> mã
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-sm text-slate-600">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Mã</th>
                <th className="py-3 px-4">Mô tả</th>
                <th className="py-3 px-4">Giá trị giảm</th>
                <th className="py-3 px-4">Giá cơ bản</th>
                <th className="py-3 px-4">Số lượng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Hết hạn</th>
                <th className="py-3 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {promos &&
                promos.length > 0 &&
                promos.map((promo, idx) => (
                  <tr
                    key={promo.id}
                    className=" border-b hover:bg-gray-50 text-black"
                  >
                    <td className="py-2 px-3 font-bold">{idx + 1}</td>
                    <td className="py-2 px-3">{promo.khuyenMaiID}</td>
                    <td className="py-2 px-3">{promo.moTa}</td>
                    <td className="py-2 px-3">
                      {promo.giaTriGiam}
                      {promo.type === "%"
                        ? "%"
                        : promo.type === "VNĐ"
                        ? " VNĐ"
                        : ""}
                    </td>
                    <td className="py-2 px-3">{promo.giaCoBan}</td>
                    <td className="py-2 px-3">{promo.soLuong}</td>
                    <td className="py-2 px-3">
                      {promo.trangThai ? "Hoạt động" : "Không hoạt động"}
                    </td>
                    <td className="py-2 px-3">
                      {formatDate(promo.ngayHetHan)}
                    </td>
                    <td className="py-2 px-3 ">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="text-blue-600 mr-2 border w-15 rounded-2xl border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(promo.khuyenMaiID)}
                        className="text-red-600 mr-2 border w-15 rounded-2xl border-blue-600 hover:bg-red-600 hover:text-white"
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
    </div>
  );
}
export default QuanLiKhuyenMai;
