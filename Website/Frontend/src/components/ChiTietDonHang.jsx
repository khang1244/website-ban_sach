import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTruck,
  FaCreditCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { useEffect } from "react";
import {
  layDonHangTheoID,
  capNhatTrangThaiDonHang,
  traHang,
} from "../lib/don-hang-apis.js";
import { taoBinhLuanMoi } from "../lib/binh-luan-apis.js";

function FormBinhLuan({ sachID, dongFormBinhLuan }) {
  const [noiDung, setNoiDung] = useState("");
  const [danhGia, setDanhGia] = useState(5);

  const xuLyGuiBinhLuan = async (e) => {
    e.preventDefault();

    const duLieuBinhLuan = {
      sachID: sachID,
      khachHangID: JSON.parse(localStorage.getItem("user")).khachHangID,
      noiDung: noiDung,
      danhGia: danhGia,
    };

    const phanHoiTuSever = await taoBinhLuanMoi(duLieuBinhLuan);

    if (phanHoiTuSever && phanHoiTuSever.success) {
      alert("Gửi bình luận thành công!");
    } else {
      alert("Lỗi khi gửi bình luận:", phanHoiTuSever.message);
    }

    dongFormBinhLuan();
    setNoiDung("");
    setDanhGia(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 sm:p-8 animate-fade-in">
        {/* Nút đóng */}
        <button
          onClick={dongFormBinhLuan}
          className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#00809D] hover:border-[#00809D] hover:bg-gray-50 transition"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>

        {/* Tiêu đề */}
        <div className="mb-4 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#00809D]">
            Gửi bình luận của bạn
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Chia sẻ cảm nhận của bạn về cuốn sách này để giúp người đọc khác
            nhé.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={xuLyGuiBinhLuan} className="space-y-5">
          {/* Nội dung bình luận */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Nội dung bình luận <span className="text-red-500">*</span>
            </label>
            <textarea
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-[#00809D] focus:ring-2 focus:ring-[#36d1c4]/30 resize-none min-h-[110px] transition"
              required
            />
          </div>

          {/* Đánh giá sao */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Đánh giá:
              </label>
              <select
                value={danhGia}
                onChange={(e) => setDanhGia(Number(e.target.value))}
                className="rounded-lg borde text-black border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#00809D] focus:ring-2 focus:ring-[#36d1c4]/30 transition"
                required
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} {star === 1 ? "Sao" : "Sao"}
                  </option>
                ))}
              </select>
            </div>

            {/* Hiển thị sao đẹp hơn */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < danhGia ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#36d1c4] to-[#00809D] px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md hover:from-[#00809D] hover:to-[#36d1c4] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#36d1c4]/60 active:scale-[0.98] transition"
          >
            Gửi bình luận
          </button>
        </form>
      </div>
    </div>
  );
}

// Modal form trả hàng
function FormTraHang({ donHangID, dongForm, onTraHangSuccess }) {
  const [lyDoTraHang, setLyDoTraHang] = useState("");
  const [dangLoading, setDangLoading] = useState(false);

  const xuLyTraHang = async (e) => {
    e.preventDefault();

    if (!lyDoTraHang.trim()) {
      alert("Vui lòng nhập lí do trả hàng");
      return;
    }

    setDangLoading(true);
    const response = await traHang(donHangID, lyDoTraHang);
    setDangLoading(false);

    if (response && response.success) {
      alert("Trả hàng thành công! Phiếu xuất đã được tạo");
      dongForm();
      // Gọi callback để update state ở parent component
      if (onTraHangSuccess) {
        onTraHangSuccess();
      }
    } else {
      alert("Lỗi: " + (response?.message || "Không thể trả hàng"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 sm:p-8">
        {/* Nút đóng */}
        <button
          onClick={dongForm}
          className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>

        {/* Tiêu đề */}
        <div className="mb-6 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Trả Hàng
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Vui lòng nhập lí do trả hàng để chúng tôi có thể hỗ trợ tốt hơn
          </p>
        </div>

        {/* Form */}
        <form onSubmit={xuLyTraHang} className="space-y-5">
          {/* Lí do trả hàng */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Lí do trả hàng <span className="text-red-500">*</span>
            </label>
            <textarea
              value={lyDoTraHang}
              onChange={(e) => setLyDoTraHang(e.target.value)}
              placeholder="Ví dụ: Sách bị hư hỏng, không đúng với mô tả..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none min-h-[120px] transition"
              required
            />
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={dongForm}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={dangLoading}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {dangLoading ? "Đang xử lý..." : "Trả Hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChiTietDonHang() {
  const { id } = useParams();

  // Tạo biến trạng thái lưu dữ liệu chi tiết đơn hàng
  const [duLieuDonHang, setDuLieuDonHang] = useState(null);
  // Nạp dữ liệu đơn hàng từ server dựa vào id (sử dụng useEffect trong thực tế)
  const [sachIDDangBinhLuan, setSachIDDangBinhLuan] = useState(null);
  // State cho modal trả hàng
  const [hienThiModalTraHang, setHienThiModalTraHang] = useState(false);

  useEffect(() => {
    const napDonHang = async () => {
      const duLieuDonHang = await layDonHangTheoID(id);
      if (duLieuDonHang && duLieuDonHang.success) {
        // Xử lý dữ liệu đơn hàng nhận được từ server
        console.log("Dữ liệu đơn hàng:", duLieuDonHang.data);
        setDuLieuDonHang(duLieuDonHang.data);
      }
    };
    napDonHang();
  }, [id]);

  // Xử lý hủy đơn hàng
  const xuLyHuyDonHang = async (donHangID, trangThaiMoi) => {
    const xacNhan = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");
    if (!xacNhan) return;

    const phanHoiTuSever = await capNhatTrangThaiDonHang(
      donHangID,
      trangThaiMoi
    );
    if (phanHoiTuSever && phanHoiTuSever.success) {
      alert("Hủy đơn hàng thành công!");
      // Cập nhật lại trạng thái đơn hàng trong giao diện
      setDuLieuDonHang({ ...duLieuDonHang, trangThai: trangThaiMoi });
    } else {
      alert("Lỗi khi hủy đơn hàng:", phanHoiTuSever.message);
    }
  };
  const formatDateTime = (dateString) =>
    new Date(dateString)
      .toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");

  const formatMoney = (value) =>
    typeof value === "number"
      ? value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
      : "-";

  const getStatusTone = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("hủy")) return "bg-rose-100 text-rose-700 border-rose-200";
    if (s.includes("hoàn thành"))
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s.includes("đã giao"))
      return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("đang giao"))
      return "bg-sky-100 text-sky-700 border-sky-200";
    if (s.includes("chờ") || s.includes("xử lý"))
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getFirstImage = (hinhAnhs) => {
    try {
      if (Array.isArray(hinhAnhs) && hinhAnhs.length > 0) {
        console.log("Hình ảnh của sản phẩm:", hinhAnhs);
        return hinhAnhs[0]?.url || null;
      }
      console.log("Không có hình ảnh:", hinhAnhs);
      return null;
    } catch (error) {
      console.error("Lỗi khi lấy hình ảnh:", error);
      return null;
    }
  };

  const tinhTamTinhSanPham = (saches) => {
    if (!Array.isArray(saches)) return 0;
    return saches.reduce((sum, sp) => {
      const sl = sp?.DonHang_Sach?.soLuong || 0;
      const gia = sp?.DonHang_Sach?.donGia || 0;
      return sum + sl * gia;
    }, 0);
  };
  return (
    <div className="bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] min-h-screen w-full">
      <Navigation />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <Link
          to="/lichsumuahang"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-6 font-semibold"
        >
          <FaArrowLeft /> Quay lại lịch sử đơn hàng
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Mã đơn</p>
              <h1 className="text-3xl font-bold text-sky-700">
                #{duLieuDonHang ? duLieuDonHang.donHangID : ""}
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              {duLieuDonHang && duLieuDonHang.trangThai === "Chờ xác nhận" && (
                <button
                  onClick={() =>
                    xuLyHuyDonHang(duLieuDonHang.donHangID, "Đã hủy")
                  }
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-slate-600 hover:to-slate-700 hover:shadow-lg active:scale-95 transition-all duration-150"
                >
                  Hủy đơn hàng
                </button>
              )}
              {duLieuDonHang && duLieuDonHang.trangThai === "Hoàn thành" && (
                <button
                  onClick={() => setHienThiModalTraHang(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg active:scale-95 transition-all duration-150"
                >
                  Trả Hàng
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <FaCalendarAlt className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Ngày đặt</p>
                  <p className="font-semibold">
                    {duLieuDonHang
                      ? formatDateTime(duLieuDonHang.createdAt)
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-700">
                <FaMapMarkerAlt className="text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Địa chỉ nhận</p>
                  <p className="font-semibold leading-snug">
                    {duLieuDonHang?.diaChiGiaoHang}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FaPhoneAlt className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Số điện thoại</p>
                  <p className="font-semibold">
                    {duLieuDonHang?.soDienThoaiKH}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <FaTruck className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Trạng thái</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusTone(
                      duLieuDonHang?.trangThai
                    )}`}
                  >
                    {duLieuDonHang?.trangThai || "Đang cập nhật"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FaCreditCard className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Thanh toán</p>
                  <p className="font-semibold">
                    {duLieuDonHang?.phuongThucThanhToan || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FaTruck className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Phí vận chuyển</p>
                  <p className="font-semibold">
                    {formatMoney(
                      duLieuDonHang?.PhuongThucGiaoHang?.phiGiaoHang || 0
                    )}{" "}
                    đ
                    {duLieuDonHang?.PhuongThucGiaoHang?.tenPhuongThuc && (
                      <span className="text-slate-600">
                        {" "}
                        ({duLieuDonHang.PhuongThucGiaoHang.tenPhuongThuc})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {(() => {
            const phiShip = duLieuDonHang?.PhuongThucGiaoHang?.phiGiaoHang || 0;
            const giamGia = duLieuDonHang?.tienGiam || 0;
            const tamTinhSP = tinhTamTinhSanPham(duLieuDonHang?.Saches);
            const tongThanhToan =
              duLieuDonHang?.tongTien ??
              Math.max(tamTinhSP + phiShip - giamGia, 0);

            return (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {/* Tạm tính sản phẩm */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">
                      Tạm tính sản phẩm
                    </p>
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10.5 1.5H4.75A1.25 1.25 0 003.5 2.75v14.5A1.25 1.25 0 004.75 18.5h10.5a1.25 1.25 0 001.25-1.25V8m-4-6.5v6.5m-5-6.5v6.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatMoney(tamTinhSP)} đ
                  </p>
                </div>

                {/* Chi phí vận chuyển và giảm giá */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-slate-400 text-sm" />
                        <span className="text-sm font-medium text-slate-600">
                          Phí vận chuyển
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-700">
                          +{formatMoney(phiShip)} đ
                        </span>
                        {duLieuDonHang?.PhuongThucGiaoHang?.tenPhuongThuc && (
                          <div className="text-xs text-slate-500">
                            ({duLieuDonHang.PhuongThucGiaoHang.tenPhuongThuc})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Giảm giá
                      </span>
                      <span className="text-sm font-bold text-rose-600">
                        -{formatMoney(giamGia)} đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tổng thanh toán */}
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-5 border-2 border-sky-200 shadow-sm hover:shadow-md transition ring-1 ring-sky-100">
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Tổng thanh toán
                  </p>
                  <p className="text-3xl font-black text-sky-700 mb-2">
                    {formatMoney(tongThanhToan)} đ
                  </p>
                  <div className="pt-2 border-t border-sky-200">
                    <p className="text-xs text-slate-500">
                      ✓ Đã bao gồm phí vận chuyển và giảm giá
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Sản phẩm trong đơn
            </h2>
            <span className="text-sm text-slate-500">
              {duLieuDonHang?.Saches?.length || 0} sản phẩm
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {duLieuDonHang?.Saches?.map((item, idx) => {
              const img = getFirstImage(item?.hinhAnhs);
              const soLuong = item.DonHang_Sach?.soLuong || 0;
              const donGia = item.DonHang_Sach?.donGia || 0;
              const tamTinh = soLuong * donGia;

              return (
                <div
                  key={idx}
                  className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {img ? (
                        <img
                          src={img}
                          alt={item.tenSach}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-400 text-xs">No image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {item.tenSach}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Mã sách: {item.sachID}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-700">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                          SL: {soLuong}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                          Đơn giá: {formatMoney(donGia)} đ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right px-4 py-3 rounded-xl ">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Tạm tính
                      </p>
                      <p className="text-2xl font-black text-emerald-700">
                        {formatMoney(tamTinh)} đ
                      </p>
                    </div>
                    {duLieuDonHang?.trangThai === "Hoàn thành" ? (
                      <button
                        onClick={() => setSachIDDangBinhLuan(item.sachID)}
                        className="px-3 py-2 text-sm font-semibold text-slate-70 transition text-black border border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400"
                      >
                        Đánh giá sản phẩm
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Đơn chưa giao hàng không thể bình luận
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {sachIDDangBinhLuan && (
          <FormBinhLuan
            sachID={sachIDDangBinhLuan}
            dongFormBinhLuan={() => setSachIDDangBinhLuan(null)}
          />
        )}
        {duLieuDonHang?.trangThai === "Đã giao hàng" && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 rounded p-4 mb-8">
            <FaCheckCircle className="text-2xl" />
            <span>
              Bạn có thể đánh giá sản phẩm đã mua. Cảm ơn bạn đã tin tưởng
              BookStore!
            </span>
          </div>
        )}
        {duLieuDonHang?.trangThai === "Đã trả hàng" && (
          <div className="flex items-center gap-3 bg-amber-100 text-amber-700 rounded-lg p-5 mb-8">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <p className="font-semibold">Đã trả hàng thành công</p>
              <p className="text-sm">
                Cảm ơn bạn, phiếu xuất đã được tạo và gửi về kho
              </p>
            </div>
          </div>
        )}
        {hienThiModalTraHang && (
          <FormTraHang
            donHangID={duLieuDonHang?.donHangID}
            dongForm={() => setHienThiModalTraHang(false)}
            onTraHangSuccess={() => {
              // Update trạng thái đơn hàng thành "Đã trả hàng"
              setDuLieuDonHang({ ...duLieuDonHang, trangThai: "Đã trả hàng" });
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ChiTietDonHang;
