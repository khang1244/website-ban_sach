import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiFolder,
} from "react-icons/fi";
import {
  taoDanhMucSachMoi,
  xoaDanhMucSach,
  capNhatDanhMucSach,
  nhanTatCaDanhMucSach,
} from "../../lib/danh-muc-sach-apis";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import ThongBaoChay from "../../components/admin/ThongBaoChay"; // đường dẫn tuỳ vị trí file

function QuanLyDanhMuc() {
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
  const [categories, setCategories] = useState([]);
  // lưu các danh mục đã được sử dụng ở sách
  const [usedCategoryIds, setUsedCategoryIds] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  // --- PHÂN TRANG ---
  const danhMucMotTrang = 4; // số mục trên mỗi trang (giống quản lý đơn hàng)
  const [trangHienTai, setTrangHienTai] = useState(1);

  // Hàm lấy tên danh mục dù là object hay string
  const getCatName = (cat) =>
    typeof cat === "string" ? cat : cat?.tenDanhMuc || "";

  // hàm xử lý khi nhấn nút thêm
  const handleAdd = async (e) => {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;

    // categories là mảng object: {danhMucSachID, tenDanhMuc}
    const isDup = categories.some(
      (c) => (c.tenDanhMuc || c)?.toLowerCase() === name.toLowerCase()
    );
    if (isDup) {
      showToast("warning", "Chú ý", `Danh mục "${name}" đã tồn tại!`);
      return;
    }

    try {
      setInput(""); // clear input ngay cho mượt
      const created = await taoDanhMucSachMoi(name); // <- lấy object có ID
      setCategories((prev) => [...prev, created]); // <- append object => hiện ID liền
      showToast("success", "Thành công", `Thêm danh mục "${name}" thành công!`);
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      showToast("error", "Lỗi", "Không thể thêm danh mục, thử lại nhé!");
    }
  };

  // hàm xử lý khi nhấn nút xóa
  const handleDelete = async (idx) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này?"
    );
    if (!confirmDelete) return;

    const tenDanhMuc = getCatName(categories[idx]);
    const danhMucID = categories[idx]?.danhMucSachID;

    console.log("Đang xóa danh mục:", { idx, danhMucID, tenDanhMuc });

    try {
      // Gọi API xóa TRƯỚC
      await xoaDanhMucSach(danhMucID);

      // Sau khi xóa thành công, cập nhật UI
      setCategories(categories.filter((_, i) => i !== idx));

      showToast(
        "success",
        "Thành công",
        "Xóa danh mục " + tenDanhMuc + " thành công!"
      );
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      showToast(
        "error",
        "Lỗi",
        "Có lỗi xảy ra khi xóa danh mục. Vui lòng thử lại!"
      );
    }
  };

  // hàm xử lý khi nhấn nút sửa
  const handleEdit = async (idx) => {
    setEditIndex(idx);
    setEditValue(getCatName(categories[idx]));
  };
  // hàm xử lý khi lưu
  const handleLuu = async (e) => {
    e.preventDefault();
    showToast("success", "Thành công", "Cập nhật danh mục thành công!");
  };

  // hàm xử lý khi lưu cập nhật danh mục
  const handleUpdate = async (e) => {
    e.preventDefault();
    const value = editValue.trim();
    if (!value) return;

    const danhMucID = categories[editIndex]?.danhMucSachID;

    try {
      // Gọi API cập nhật TRƯỚC
      await capNhatDanhMucSach(danhMucID, {
        tenDanhMuc: value,
      });

      // Sau khi cập nhật thành công, cập nhật UI
      const danhMucDaDuocSua = categories.map((cat, i) =>
        i === editIndex ? { ...cat, tenDanhMuc: value } : cat
      );
      setCategories(danhMucDaDuocSua);

      showToast("success", "Thành công", "Cập nhật danh mục thành công!");

      // Đóng chế độ sửa
      setEditIndex(null);
      setEditValue("");
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      showToast(
        "error",
        "Lỗi",
        "Cập nhật danh mục thất bại, vui lòng thử lại!"
      );
    }
  };

  // Load tất cả danh mục và lấy danh mục đã dùng ở sách khi component mount
  useEffect(() => {
    const napTatCaDanhMucSach = async () => {
      const data = await nhanTatCaDanhMucSach();
      if (data) setCategories(data);
    };
    // Lấy tất cả sách để xác định danh mục đã dùng
    const napTatCaSach = async () => {
      const sachList = await nhanTatCaCacQuyenSach();
      if (Array.isArray(sachList)) {
        const used = sachList.map(s => s.danhMucSachID).filter(Boolean);
        setUsedCategoryIds(used);
      }
    };
    napTatCaDanhMucSach();
    napTatCaSach();
  }, []);

  // Nếu số lượng danh mục thay đổi, đảm bảo trang hiện tại hợp lệ
  useEffect(() => {
    const tong = Math.max(1, Math.ceil(categories.length / danhMucMotTrang));
    if (trangHienTai > tong) setTrangHienTai(tong);
  }, [categories, trangHienTai]);

  // hàm xử lý khi hủy sửa
  const handleCancel = () => {
    setEditIndex(null);
    setEditValue("");
    showToast("success", "Thành công", "Hủy sửa thành công!");
  };

  // Tính phân trang cho danh mục
  const tongTrang = Math.max(1, Math.ceil(categories.length / danhMucMotTrang));
  const danhMucHienThi = categories.slice(
    (trangHienTai - 1) * danhMucMotTrang,
    trangHienTai * danhMucMotTrang
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans">
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-linear-to-br from-indigo-600 to-teal-500 text-white shadow-lg">
            <FiFolder className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Quản lý danh mục sách
            </h1>
          </div>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 md:p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Thêm danh mục mới
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: Văn học thiếu nhi"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold shadow hover:bg-indigo-700 active:bg-indigo-800 transition"
            >
              <FiPlus className="text-lg" /> Thêm
            </button>
          </div>
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 pt-5 pb-3 flex items-center justify-between bg-linear-to-r from-slate-50 to-white">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            Danh sách danh mục
          </h2>
          <div className="text-sm text-slate-500">
            Tổng: {categories.length} mục
          </div>
        </div>

        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 bg-slate-800 text-white">
          <div className="col-span-1 font-semibold text-sm">#</div>
          <div className="col-span-8 font-semibold text-sm">Tên danh mục</div>
          <div className="col-span-3 font-semibold text-sm text-center">
            Hành động
          </div>
        </div>

        {/* Items */}
        <ul className="divide-y divide-slate-100">
          {categories && categories.length > 0 ? (
            danhMucHienThi.map((cat, idx) => {
              const globalIdx = (trangHienTai - 1) * danhMucMotTrang + idx;
              return (
                <li
                  key={cat.danhMucSachID ?? globalIdx}
                  className="px-6 py-3 hover:bg-slate-50 transition"
                >
                  {editIndex === globalIdx ? (
                    <form
                      onSubmit={handleUpdate}
                      className="grid grid-cols-12 gap-3 items-center"
                    >
                      <div className="col-span-1 text-slate-500 font-medium">
                        {cat.danhMucSachID}
                      </div>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="col-span-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleLuu(globalIdx)}
                          type="submit"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition"
                        >
                          <FiSave /> Lưu
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
                        >
                          <FiX /> Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-1 text-slate-500 font-medium">
                        {cat.danhMucSachID}
                      </div>
                      <div className="col-span-8">
                        <span className="inline-flex items-center gap-2 text-slate-800 font-medium">
                          <span className="inline-block w-2 h-2 rounded-full bg-teal-500"></span>
                          {getCatName(cat) || "-"}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(globalIdx)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 border border-blue-200 transition"
                        >
                          <FiEdit2 /> Sửa
                        </button>
                          <button
                            onClick={() => handleDelete(globalIdx)}
                            disabled={usedCategoryIds.includes(cat.danhMucSachID)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition
                              ${usedCategoryIds.includes(cat.danhMucSachID)
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'}
                            `}
                            title={usedCategoryIds.includes(cat.danhMucSachID) ? 'Danh mục đã được sử dụng ở sách, không thể xóa' : 'Xóa'}
                          >
                            <FiTrash2 /> Xóa
                          </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          ) : (
            <li className="px-5 py-10 text-center text-slate-500">
              Hiện chưa có danh mục nào. Hãy thêm danh mục đầu tiên nhé!
            </li>
          )}
        </ul>

        {/* Pagination controls */}
        <div className="px-6 py-4">
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
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
    </div>
  );
}

export default QuanLyDanhMuc;
