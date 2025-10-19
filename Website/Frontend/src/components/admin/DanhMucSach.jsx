import React, { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiFolder,
} from "react-icons/fi";

function DanhMucSach() {
  const [categories, setCategories] = useState([
    "Truyện tranh",
    "Ngôn tình",
    "Phiêu lưu",
    "Kinh dị",
    "Sách giáo khoa",
    "Sách kỹ năng",
  ]);

  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Thêm danh mục (logic giữ nguyên)
  const handleAdd = (e) => {
    e.preventDefault();
    alert("Thêm danh mục: " + input);
    const danhMucDaDuocThem = categories.includes(input.trim());
    if (input.trim() && !danhMucDaDuocThem) {
      setCategories([...categories, input.trim()]);
      setInput("");
    }
  };

  // Xóa danh mục (logic giữ nguyên)
  const handleDelete = (idx) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  // Bắt đầu sửa (logic giữ nguyên)
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditValue(categories[idx]);
  };

  // Lưu sửa (logic giữ nguyên)
  const handleUpdate = (e) => {
    e.preventDefault();
    if (editValue.trim() && !categories.includes(editValue.trim())) {
      const danhMucDaDuocSua = [];
      for (let i = 0; i < categories.length - 1; i++) {
        if (i === editIndex) {
          danhMucDaDuocSua.push(editValue.trim());
        } else {
          danhMucDaDuocSua.push(categories[i]);
        }
      }
      setCategories(danhMucDaDuocSua);
      setEditIndex(null);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditValue("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md">
            <FiFolder className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Quản lý danh mục sách
            </h1>
            <p className="text-slate-500 text-sm">
              Thêm, sửa, xoá danh mục với giao diện mới gọn gàng, hiện đại.
            </p>
          </div>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-8">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow border border-slate-100 p-4 md:p-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Thêm danh mục mới
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: Văn học thiếu nhi"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-teal-700 active:bg-teal-800 transition"
            >
              <FiPlus className="text-lg" /> Thêm
            </button>
          </div>
        </div>
      </form>

      {/* List */}
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow border border-slate-100">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span role="img" aria-label="book">
              📚
            </span>{" "}
            Danh sách danh mục
          </h2>
          <div className="text-sm text-slate-500">
            Tổng: {categories.length} mục
          </div>
        </div>

        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2 bg-teal-700 text-white rounded-t-2xl">
          <div className="col-span-1 font-semibold">#</div>
          <div className="col-span-8 font-semibold">Tên danh mục</div>
          <div className="col-span-3 font-semibold text-center">Hành động</div>
        </div>

        {/* Items */}
        <ul className="divide-y divide-slate-100">
          {categories.map((cat, idx) => (
            <li key={idx} className="px-5 py-3 hover:bg-slate-50 transition">
              {editIndex === idx ? (
                <form
                  onSubmit={handleUpdate}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-1 text-slate-500 font-medium">
                    {idx + 1}
                  </div>
                  <div className="col-span-7">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700"
                    >
                      <FiSave /> Lưu
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300"
                    >
                      <FiX /> Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-1 text-slate-500 font-medium">
                    {idx + 1}
                  </div>
                  <div className="col-span-8">
                    <span className="inline-flex items-center gap-2 text-slate-800 font-medium">
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-500"></span>
                      {cat}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 border border-blue-200"
                    >
                      <FiEdit2 /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 font-medium hover:bg-rose-100 border border-rose-200"
                    >
                      <FiTrash2 /> Xóa
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}

          {categories.length === 0 && (
            <li className="px-5 py-10 text-center text-slate-500">
              Hiện chưa có danh mục nào. Hãy thêm danh mục đầu tiên nhé!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DanhMucSach;
