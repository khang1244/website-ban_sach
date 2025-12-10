import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useEffect } from "react";
import {
  layDonHangTheoID,
  capNhatTrangThaiDonHang,
  traHang,
} from "../lib/don-hang-apis.js";
import { layTatCaPhuongThucGiaoHang } from "../lib/phuong-thuc-giao-hang-apis.js";
import { taoBinhLuanMoi } from "../lib/binh-luan-apis.js";

function FormBinhLuan({ sachID, dongFormBinhLuan }) {
  const [noiDung, setNoiDung] = useState("");
  const [danhGia, setDanhGia] = useState(5);

  const xuLyGuiBinhLuan = async (e) => {
    e.preventDefault();

    const duLieuBinhLuan = {
      sachID: sachID,
      nguoiDungID: JSON.parse(localStorage.getItem("user")).nguoiDungID,
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
  // Tạo biến trạng thái lưu danh sách phương thức giao hàng
  const [shippingMethods, setShippingMethods] = useState([]);
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
  // Nạp danh sách phương thức giao hàng từ server
  useEffect(() => {
    const napPhuongThucGiaoHang = async () => {
      // Giả sử gọi API để lấy danh sách phương thức giao hàng
      const response = await layTatCaPhuongThucGiaoHang();
      if (response && response.success) {
        console.log("Danh sách phương thức giao hàng:", response.data);

        setShippingMethods(response.data);
      }
    };
    napPhuongThucGiaoHang();
  }, []);

  // Xử lý hủy đơn hàng
  const xuLyHuyDonHang = async (donHangID, trangThaiMoi) => {
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
  // Helper function để định dạng lại ngày tháng
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  return (
    <div className="bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] min-h-screen w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link
          to="/lichsumuahang"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-6 font-semibold"
        >
          <FaArrowLeft /> Quay lại lịch sử đơn hàng
        </Link>
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 relative">
          {duLieuDonHang && duLieuDonHang.trangThai === "Chờ xác nhận" && (
            <button
              onClick={() => xuLyHuyDonHang(duLieuDonHang.donHangID, "Đã hủy")}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 rounded-2xl"
            >
              Hủy đơn hàng
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#00809D] mb-4">
            Chi Tiết Đơn Hàng #{duLieuDonHang ? duLieuDonHang.donHangID : ""}
          </h1>
          <div className="mb-2 text-gray-700">
            Ngày đặt:{" "}
            <span className="font-semibold">
              {duLieuDonHang ? formatDate(duLieuDonHang.createdAt) : ""}
            </span>
          </div>
          <div className="mb-2 text-gray-700">
            Địa chỉ nhận hàng:{" "}
            <span className="font-semibold">
              {duLieuDonHang?.diaChiGiaoHang}
            </span>
          </div>
          <div className="mb-2 text-gray-700">
            Trạng thái:{" "}
            <span
              className={
                duLieuDonHang?.trangThai === "Đã giao hàng"
                  ? "text-green-600 font-bold"
                  : "text-yellow-600 font-bold"
              }
            >
              {duLieuDonHang?.trangThai}
            </span>
          </div>
          <div className="mb-2 text-gray-700">
            Chi phí vận chuyển:{" "}
            <span className="font-semibold">
              {shippingMethods
                ?.find(
                  (m) =>
                    m.phuongThucGiaoHangID ===
                    duLieuDonHang?.phuongThucGiaoHangID
                )
                ?.phiGiaoHang.toLocaleString() + "đ"}
            </span>
          </div>
          <div className="mb-2 text-gray-700">
            Mã giảm giá:{" "}
            <span className="font-semibold">
              {duLieuDonHang?.tienGiam && duLieuDonHang?.tienGiam !== ""
                ? "-" + duLieuDonHang.tienGiam.toLocaleString() + "đ"
                : "Không sử dụng"}
            </span>
          </div>
          <div className="mb-2 text-gray-700">
            Tổng tiền:{" "}
            <span className="font-bold text-[#00809D]">
              {duLieuDonHang?.tongTien.toLocaleString()}đ
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#00809D] mb-4">
            Sản phẩm trong đơn hàng
          </h2>
          <table className="w-full text-left  text-black">
            <thead>
              <tr className="border-b text-black">
                <th className="py-2">Sản phẩm</th>
                <th className="py-2">Số lượng</th>
                <th className="py-2">Đơn giá</th>
                <th className="py-2">Tạm tính</th>
                <th className="py-2">Bình luận</th>
              </tr>
            </thead>
            <tbody>
              {duLieuDonHang &&
                duLieuDonHang.Saches.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 font-semibold text-[#00809D]">
                      {item.tenSach}
                    </td>
                    <td className="py-3">{item.DonHang_Sach.soLuong}</td>
                    <td className="py-3">
                      {item.DonHang_Sach.donGia.toLocaleString()}đ
                    </td>
                    <td className="py-3">
                      {(
                        item.DonHang_Sach.donGia * item.DonHang_Sach.soLuong
                      ).toLocaleString()}
                      đ
                    </td>
                    <td className="py-3">
                      {duLieuDonHang?.trangThai === "Hoàn thành" ? (
                        <button
                          onClick={() => setSachIDDangBinhLuan(item.sachID)}
                          className="px-3 py-1.5 rounded-md border text-sm text-gray-700 hover:bg-[#00809D] hover:text-white transition"
                        >
                          Bình luận
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Chưa hoàn thành mua hàng
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
        {duLieuDonHang?.trangThai === "Hoàn thành" && (
          <div className="flex items-center gap-3 bg-blue-100 text-blue-700 rounded-lg p-5 mb-8">
            <span className="text-2xl">📦</span>
            <div className="flex-1">
              <p className="font-semibold">Đơn hàng đã hoàn thành</p>
              <p className="text-sm">Bạn có thể trả hàng nếu có vấn đề gì không?</p>
            </div>
            <button
              onClick={() => setHienThiModalTraHang(true)}
              className="whitespace-nowrap px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Trả Hàng
            </button>
          </div>
        )}
        {duLieuDonHang?.trangThai === "Đã trả hàng" && (
          <div className="flex items-center gap-3 bg-amber-100 text-amber-700 rounded-lg p-5 mb-8">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <p className="font-semibold">Đã trả hàng thành công</p>
              <p className="text-sm">Cảm ơn bạn, phiếu xuất đã được tạo và gửi về kho</p>
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
