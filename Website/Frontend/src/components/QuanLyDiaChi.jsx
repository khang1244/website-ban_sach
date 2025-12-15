import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import {
  layDiaChiTheoKhachHang,
  taoDiaChi,
  xoaDiaChi,
  datMacDinhDiaChi,
} from "../lib/dia-chi-apis";
import { FaPlus, FaCheckCircle, FaTrash, FaEdit, FaHome } from "react-icons/fa";
import tinhTP from "../lib/du-Lieu-TinhTP";
import { nhanDanhSachXaPhuong } from "../lib/dia-chi-apis";

// Trang quản lý địa chỉ: cho phép thêm, chỉnh sửa (thay mới), đặt mặc định, xóa.
// Checkout sẽ chỉ cho phép thêm mới + chọn mặc định, còn chỉnh sửa/xóa nằm tại đây.
function QuanLyDiaChi() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    diaChiCuThe: "",
    tinhThanhPho: "",
    xaPhuong: "",
    macDinh: false,
  });
  const [wards, setWards] = useState([]);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        console.error(
          "User data in localStorage bị hỏng, xóa và yêu cầu đăng nhập lại",
          err
        );
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const list = await layDiaChiTheoKhachHang(user.khachHangID);
      setAddresses(list || []);
      const def = (list || []).find((a) => a.macDinh);
      setSelectedId(def?.diaChiID || list?.[0]?.diaChiID || null);
    } catch (err) {
      console.error("Không tải được địa chỉ:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để quản lý địa chỉ");
      navigate("/dangnhap");
      return;
    }
    loadAddresses();
  }, [user, navigate, loadAddresses]);

  const resetForm = () => {
    setForm({
      diaChiCuThe: "",
      tinhThanhPho: "",
      xaPhuong: "",
      macDinh: false,
    });
    setWards([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const diaChiCuThe = form.diaChiCuThe?.trim();
    if (!diaChiCuThe) {
      alert("Vui lòng nhập địa chỉ đầy đủ");
      return;
    }

    const wardName =
      wards.find((w) => w.code == parseInt(form.xaPhuong))?.name || "";
    const provinceName =
      tinhTP.find((t) => t.code == form.tinhThanhPho)?.name || "";
    const diaChiText = `${diaChiCuThe}${wardName ? ", " + wardName : ""}${
      provinceName ? ", " + provinceName : ""
    }`;

    // Nếu đang sửa và địa chỉ cũ là mặc định, giữ mặc định trừ khi khách hàng bỏ chọn.
    const old = addresses.find((a) => a.diaChiID === editingId);
    const shouldBeDefault =
      form.macDinh || addresses.length === 0 || !!old?.macDinh;

    try {
      const res = await taoDiaChi({
        khachHangID: user.khachHangID,
        diaChi: diaChiText,
        macDinh: shouldBeDefault,
      });

      const newId = res?.address?.diaChiID;
      if (shouldBeDefault && newId) {
        await datMacDinhDiaChi(newId);
      }

      // Nếu là thao tác "sửa", xóa địa chỉ cũ sau khi đã thêm địa chỉ mới
      if (editingId) {
        await xoaDiaChi(editingId);
      }

      await loadAddresses();
      resetForm();
      alert(editingId ? "Đã cập nhật địa chỉ" : "Đã thêm địa chỉ mới");
    } catch (err) {
      console.error("Lỗi khi lưu địa chỉ:", err);
      alert("Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    try {
      await xoaDiaChi(id);
      await loadAddresses();
    } catch (err) {
      console.error("Lỗi khi xóa địa chỉ:", err);
      alert("Không thể xóa địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await datMacDinhDiaChi(id);
      await loadAddresses();
    } catch (err) {
      console.error("Lỗi khi đặt mặc định:", err);
      alert("Không thể đặt mặc định. Vui lòng thử lại.");
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr.diaChiID);
    setForm({
      diaChiCuThe: addr.diaChi || "",
      tinhThanhPho: "",
      xaPhuong: "",
      macDinh: !!addr.macDinh,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Khi chọn tỉnh/thành, nạp danh sách xã/phường
  useEffect(() => {
    const wardsList = nhanDanhSachXaPhuong(form.tinhThanhPho || 0);
    setWards(wardsList);
    // reset xã/phường khi đổi tỉnh
    setForm((f) => ({ ...f, xaPhuong: "" }));
  }, [form.tinhThanhPho]);

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6 text-[#0b3b4c]">
          <FaHome />
          <h1 className="text-2xl font-bold">Quản lý địa chỉ</h1>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Chỉnh sửa và xóa địa chỉ được thực hiện tại đây. Trang thanh toán chỉ
          cho phép thêm địa chỉ mới và chọn mặc định.
        </p>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#cfdef3]">
          <h2 className="text-lg font-semibold text-[#0b3b4c] mb-4">
            {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Tỉnh / Thành phố
                </label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#00809D]"
                  value={form.tinhThanhPho}
                  onChange={(e) =>
                    setForm({ ...form, tinhThanhPho: e.target.value })
                  }
                >
                  <option value="">Chọn tỉnh / thành</option>
                  {tinhTP.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Xã / Phường
                </label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#00809D]"
                  value={form.xaPhuong}
                  onChange={(e) =>
                    setForm({ ...form, xaPhuong: e.target.value })
                  }
                  disabled={!form.tinhThanhPho}
                >
                  <option value="">Chọn xã / phường</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Địa chỉ cụ thể
              </label>
              <textarea
                className="border rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#00809D]"
                rows={3}
                value={form.diaChiCuThe}
                onChange={(e) =>
                  setForm({ ...form, diaChiCuThe: e.target.value })
                }
                placeholder="Ví dụ: 123 Nguyễn Trãi, Phường 7, Quận 5, TP.HCM"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="accent-[#00809D]"
                checked={form.macDinh}
                onChange={(e) =>
                  setForm({ ...form, macDinh: e.target.checked })
                }
              />
              Đặt làm địa chỉ mặc định
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#00809D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#006b85] transition"
              >
                <FaPlus /> {editingId ? "Lưu địa chỉ" : "Thêm địa chỉ"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border text-gray-700"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-[#cfdef3]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0b3b4c]">
              Địa chỉ đã lưu
            </h2>
            {loading && (
              <span className="text-xs text-gray-500">Đang tải...</span>
            )}
          </div>

          {addresses.length === 0 ? (
            <p className="text-sm text-gray-600">Chưa có địa chỉ nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.diaChiID}
                  onClick={() => setSelectedId(addr.diaChiID)}
                  role="button"
                  tabIndex={0}
                  className={`group p-4 border rounded-xl bg-[#f9fcff] shadow-sm flex flex-col gap-2 hover:shadow-md transition ${
                    selectedId === addr.diaChiID
                      ? "border-[#00809D] ring-2 ring-[#00809D]/30"
                      : "border-[#cfdef3]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="selectedAddress"
                      className="accent-[#00809D] mt-1"
                      checked={selectedId === addr.diaChiID}
                      onChange={() => setSelectedId(addr.diaChiID)}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-[#0b3b4c] leading-relaxed">
                        {addr.diaChi}
                      </p>
                      {addr.macDinh && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          <FaCheckCircle /> Mặc định
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {!addr.macDinh && (
                      <button
                        type="button"
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleSetDefault(addr.diaChiID)}
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      type="button"
                      className="px-3 py-1 text-sm border rounded text-[#0b3b4c] flex items-center gap-1 hover:border-[#00809D]"
                      onClick={() => handleEdit(addr)}
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm border rounded text-red-600 flex items-center gap-1 hover:border-red-300"
                      onClick={() => handleDelete(addr.diaChiID)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QuanLyDiaChi;
