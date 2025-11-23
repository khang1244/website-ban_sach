import React, { useEffect, useState, useContext } from "react";
import {
  taoGiaoDichKho,
  layTatCaGiaoDichKho,
  layGiaoDichTheoSach,
} from "../../lib/giao-dich-kho-apis";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import { UserContext } from "../../contexts/user-context";

export default function QuanLiKho() {
  const { user } = useContext(UserContext);
  const [dsSach, setDsSach] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [modalNhap, setModalNhap] = useState(false);
  const [chonSach, setChonSach] = useState(null);
  const [soLuongNhap, setSoLuongNhap] = useState(0);
  // modal Cập nhật số lượng (set absolute quantity)
  const [modalLichSu, setModalLichSu] = useState(false);
  const [lichSu, setLichSu] = useState([]);
  // --- PHÂN TRANG ---
  // Số mục hiển thị mỗi trang (yêu cầu: 4)
  const soLuongMotTrang = 4; // 4 mục/trang
  // Trang hiện tại (1-based)
  const [trangHienTai, setTrangHienTai] = useState(1);

  // Format ngày an toàn — trả về '-' khi không hợp lệ
  function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  }
  useEffect(() => {
    (async () => {
      setDangTai(true);
      const [sachApi, gdApi] = await Promise.all([
        nhanTatCaCacQuyenSach(),
        layTatCaGiaoDichKho(),
      ]);

      const tx = Array.isArray(gdApi)
        ? gdApi
        : Array.isArray(gdApi && gdApi.data)
        ? gdApi.data
        : [];
      const mapLatest = {};
      for (const g of tx) {
        if (!g.sachID) continue;
        const t = new Date(g.ngayGiaoDich || g.updatedAt || 0).getTime();
        if (!mapLatest[g.sachID] || t > mapLatest[g.sachID].t) {
          mapLatest[g.sachID] = { t, g };
        }
      }

      const sachList = Array.isArray(sachApi)
        ? sachApi
        : Array.isArray(sachApi && sachApi.data)
        ? sachApi.data
        : [];

      const list = sachList.map((s) => ({
        ...s,
        last: mapLatest[s.sachID] ? mapLatest[s.sachID].g : null,
      }));

      setDsSach(list);
      setDangTai(false);
    })();
  }, []);

  // --- TÍNH PHÂN TRANG ---
  const tongTrang = Math.max(1, Math.ceil(dsSach.length / soLuongMotTrang));

  // Nếu dsSach thay đổi, đảm bảo trang hiện tại hợp lệ
  useEffect(() => {
    if (trangHienTai > tongTrang) setTrangHienTai(tongTrang);
  }, [tongTrang, trangHienTai]);

  // Mảng hiển thị cho trang hiện tại
  const dsSachHienThi = dsSach.slice(
    (trangHienTai - 1) * soLuongMotTrang,
    trangHienTai * soLuongMotTrang
  );

  function moModalNhap(sach) {
    setChonSach(sach);
    setSoLuongNhap(0);
    setModalNhap(true);
  }

  async function luuNhap(e) {
    e && e.preventDefault();
    if (!chonSach || !Number(soLuongNhap) || Number(soLuongNhap) <= 0) {
      alert("Vui lòng chọn sách và số lượng > 0");
      return;
    }
    const ten = (user && (user.tenNguoiDung || user.hoTen)) || "Admin";
    const payload = {
      loaiGiaoDich: "NHAP",
      ngayGiaoDich: new Date(),
      tenSanPham: chonSach.tenSach,
      soLuong: Number(soLuongNhap),
      nguoiThucHien: ten,
      ghiChu: "Nhập từ admin",
      sachID: Number(chonSach.sachID),
    };
    const res = await taoGiaoDichKho(payload);
    if (res && !res.error) {
      alert("Nhập thành công");
      setModalNhap(false);
      const s = await nhanTatCaCacQuyenSach();
      const sList = Array.isArray(s)
        ? s
        : Array.isArray(s && s.data)
        ? s.data
        : [];
      const gds = await layTatCaGiaoDichKho();
      const map = {};
      const gdsList = Array.isArray(gds)
        ? gds
        : Array.isArray(gds && gds.data)
        ? gds.data
        : [];
      for (const g of gdsList) {
        if (!g.sachID) continue;
        const t = new Date(g.ngayGiaoDich || g.updatedAt || 0).getTime();
        if (!map[g.sachID] || t > map[g.sachID].t) map[g.sachID] = { t, g };
      }
      setDsSach(
        sList.map((x) => ({
          ...x,
          last: map[x.sachID] ? map[x.sachID].g : null,
        }))
      );
    } else {
      alert("Lỗi khi nhập");
    }
  }

  async function moLichSu(sach) {
    setModalLichSu(true);
    setLichSu([]);
    const r = await layGiaoDichTheoSach(sach.sachID, 1, 50);
    setLichSu(r && r.data ? r.data : Array.isArray(r) ? r : []);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý tồn kho</h2>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Sách</th>
              <th className="p-3 text-left">Tồn kho</th>
              <th className="p-3 text-left">Ngày cập nhật</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : dsSach.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              dsSachHienThi.map((s, i) => (
                <tr
                  key={s.sachID}
                  className="border-b hover:bg-gray-50 transition text-gray-900"
                >
                  <td className="p-3 font-medium">
                    {(trangHienTai - 1) * soLuongMotTrang + i + 1}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-800">
                      {s.tenSach}
                    </div>
                    <div className="text-xs text-gray-500">{s.tacGia}</div>
                  </td>
                  <td className="p-3 font-semibold">{s.soLuongConLai ?? 0}</td>
                  <td className="p-3">
                    {formatDate(
                      (s.last && (s.last.ngayGiaoDich || s.last.updatedAt)) ||
                        undefined
                    )}
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => moModalNhap(s)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                      Nhập
                    </button>
                    <button
                      onClick={() => moLichSu(s)}
                      className="px-3 py-1 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800"
                    >
                      Lịch sử
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* PHÂN TRANG: Trước / số trang / Tiếp (đặt dưới bảng) */}
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
                  ? "bg-blue-600 text-white"
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
      {modalNhap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              Nhập kho: {chonSach?.tenSach}
            </h3>
            <form onSubmit={luuNhap}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng
              </label>
              <input
                type="number"
                min={1}
                value={soLuongNhap}
                onChange={(e) => setSoLuongNhap(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4 text-gray-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNhap(false)}
                  className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalLichSu && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-5xl p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Lịch sử giao dịch
              </h3>
              <button
                onClick={() => setModalLichSu(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                      #
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                      Loại
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">
                      Số nhập
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">
                      Tồn trước
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">
                      Tồn sau
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                      Người nhập
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">
                      Ngày
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lichSu.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400">
                        Không có lịch sử
                      </td>
                    </tr>
                  ) : (
                    lichSu.map((h, i) => (
                      <tr
                        key={h.maGiaoDich || i}
                        className="hover:bg-gray-50 transition-colors text-black"
                      >
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{h.loaiGiaoDich}</td>
                        <td className="px-4 py-2 text-right">{h.soLuong}</td>
                        <td className="px-4 py-2 text-right">
                          {h.soLuongTruoc ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {h.soLuongSau ?? "-"}
                        </td>
                        <td className="px-4 py-2">{h.nguoiThucHien || "-"}</td>
                        <td className="px-4 py-2">
                          {formatDate(h.ngayGiaoDich || h.updatedAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalLichSu(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
