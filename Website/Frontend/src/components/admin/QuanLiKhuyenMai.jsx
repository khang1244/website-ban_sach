import React, { useState } from "react";

// Demo/mock data for promo codes
const initialPromos = [
  {
    id: 1,
    code: "SALE20",
    description: "Giảm 20% cho đơn hàng trên 200k",
    discount: 20,
    type: "%",
    expiry: "2025-12-31",
  },
  {
    id: 2,
    code: "FREESHIP",
    description: "Miễn phí vận chuyển cho đơn từ 100k",
    discount: 0,
    type: "Freeship",
    expiry: "2025-10-01",
  },
];

const DISCOUNT_TYPES = ["%", "VNĐ", "Freeship"];

function QuanLiKhuyenMai() {
  const [promos, setPromos] = useState(initialPromos);
  const [form, setForm] = useState({
    id: null,
    code: "",
    description: "",
    discount: 0,
    expiry: "",
    giaCoBanDeGiam: 0,
  });
  const [editId, setEditId] = useState(null);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add or update promo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      const danhSachMaKhuyenMaiDaCapNhat = promos.map((p) => {
        if (p.id === editId) {
          return { ...form, id: editId };
        } else {
          return p;
        }
      });
      setPromos(danhSachMaKhuyenMaiDaCapNhat);
      setEditId(null);
    } else {
      setPromos([...promos, { ...form, id: Date.now() }]);
    }
    setForm({
      id: null,
      code: "",
      description: "",
      discount: 0,
      type: "%",
      expiry: "",
    });
  };

  // Edit promo
  const handleEdit = (promo) => {
    setForm({ ...promo });
    setEditId(promo.id);
  };

  // Delete promo
  const handleDelete = (id) => {
    setPromos(promos.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Quản lý mã khuyến mãi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tạo, chỉnh sửa và theo dõi các mã khuyến mãi.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 mb-10"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Biểu mẫu</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mã khuyến mãi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 
            text-slate-900 caret-slate-900 placeholder:text-slate-400 
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="VD: SALE20, FREESHIP"
              required
            />

            <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">
              Mô tả <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 
            text-slate-900 caret-slate-900 placeholder:text-slate-400 
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giá trị giảm
            </label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 
            text-slate-900 caret-slate-900 placeholder:text-slate-400 
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              min="0"
              placeholder="VD: 20 hoặc 50000"
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ngày hết hạn <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 
              text-slate-900 caret-slate-900 placeholder:text-slate-400 
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giá cơ bản để giảm
            </label>
            <input
              type="number"
              name="giaCoBanDeGiam"
              value={form.giaCoBanDeGiam}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 
            text-slate-900 caret-slate-900 placeholder:text-slate-400 
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              min="0"
              placeholder="VD: 200000"
            />

            <button
              type="submit"
              className="mt-4 inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-black px-5 py-2.5 rounded-xl font-semibold shadow-sm"
            >
              {editId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
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
                <th className="py-3 px-4">Giá trị</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Hết hạn</th>
                <th className="py-3 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo, idx) => (
                <tr
                  key={promo.id}
                  className="border-t border-slate-200/60 odd:bg-slate-50/60 hover:bg-slate-100/50"
                >
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 ring-1 ring-slate-200 font-mono font-semibold text-slate-900">
                      {promo.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {promo.description}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {promo.discount}
                    {promo.type === "%"
                      ? "%"
                      : promo.type === "VNĐ"
                      ? " VNĐ"
                      : ""}
                  </td>
                  <td className="py-3 px-4 text-slate-800">{promo.type}</td>
                  <td className="py-3 px-4 text-slate-800">{promo.expiry}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="text-cyan-700 hover:text-cyan-900 hover:underline mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-rose-700 hover:text-rose-900 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {promos.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 px-4 text-center text-slate-500"
                  >
                    Chưa có mã khuyến mãi nào. Hãy thêm mới ở biểu mẫu phía
                    trên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default QuanLiKhuyenMai;
