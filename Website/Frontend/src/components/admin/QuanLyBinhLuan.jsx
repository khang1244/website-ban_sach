import { FaStar, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  layTatCaBinhLuan,
  xoaBinhLuanTheoID,
  duyetBinhLuanTheoID,
} from "../../lib/binh-luan-apis";

function QuanLyBinhLuan() {
  const [binhLuanXoa, setBinhLuanXoa] = useState([]); // Dữ liệu bình luận
  const [loctheodanhgia, setLocTheoDanhGia] = useState(null); // Lọc theo đánh giá
  useEffect(() => {
    // Gọi API để lấy danh sách bình luận từ server
    const napDuLieuBinhLuan = async () => {
      const phanHoiTuSever = await layTatCaBinhLuan();
      if (phanHoiTuSever && phanHoiTuSever.success) {
        setBinhLuanXoa(phanHoiTuSever.data); // Cập nhật danh sách bình luận từ server
      } else {
        console.error("Lỗi khi tải bình luận:", phanHoiTuSever.message);
      }
    };
    napDuLieuBinhLuan();
  }, []);

  const deletebl = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const res = await xoaBinhLuanTheoID(id); // Gọi API xóa trên server

      // Nếu API trả success, xóa luôn trên UI
      if (!res || res.success === false) {
        alert(res?.message || "Xóa thất bại.");
        return;
      }

      // CẬP NHẬT STATE binhLuan → UI đổi ngay, không cần F5
      setBinhLuanXoa((prev) => prev.filter((bl) => bl.binhLuanID !== id));

      alert("Bình luận đã được xóa.");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi xóa bình luận.");
    }
  };

  const toggleDuyet = async (id, current) => {
    try {
      const phanHoi = await duyetBinhLuanTheoID(id, !current);
      if (!phanHoi || phanHoi.success === false) {
        alert(phanHoi?.message || "Cập nhật trạng thái duyệt thất bại.");
        return;
      }

      // Cập nhật state ngay
      setBinhLuanXoa((prev) =>
        prev.map((bl) =>
          bl.binhLuanID === id ? { ...bl, duyet: phanHoi.data.duyet } : bl
        )
      );
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi cập nhật trạng thái duyệt.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#00809D]">
            Quản lý bình luận & đánh giá
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem, kiểm soát và quản lý phản hồi từ khách hàng về sách của bạn.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#00809D]/5 to-[#00B3A8]/5">
          <div>
            <h2 className="text-lg font-semibold text-[#00809D]">
              Danh sách bình luận
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Kiểm tra điểm đánh giá, nội dung bình luận và trạng thái hiển thị.
            </p>
          </div>

          {/* // Lọc theo đánh giá */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocTheoDanhGia(null)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                loctheodanhgia === null
                  ? "bg-[#00809D] text-white"
                  : "bg-white text-gray-700 border border-gray-100"
              }`}
            >
              Tất cả
            </button>

            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  setLocTheoDanhGia(loctheodanhgia === n ? null : n)
                }
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  loctheodanhgia === n
                    ? "bg-[#00B3A8] text-white"
                    : "bg-white text-gray-600 border border-gray-100"
                }`}
                title={`Lọc ${n} sao`}
              >
                <FaStar
                  className={`${
                    loctheodanhgia === n ? "text-yellow-200" : "text-yellow-400"
                  }`}
                  size={12}
                />
                <span className="ml-1">{n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Sách</th>
                <th className="py-3 px-4">Người dùng</th>
                <th className="py-3 px-4">Đánh giá</th>
                <th className="py-3 px-4">Bình luận</th>
                <th className="py-3 px-4 whitespace-nowrap">Ngày Binh Luận</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {binhLuanXoa &&
                // Lọc bình luận theo đánh giá nếu có
                (binhLuanXoa.length > 0
                  ? binhLuanXoa.filter((c) =>
                      loctheodanhgia ? c.danhGia === loctheodanhgia : true
                    )
                  : []
                ).map((c, idx) => (
                  <tr
                    key={c.binhLuanID}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-500 text-xs sm:text-sm">
                      {idx + 1}
                    </td>

                    {/* Tên sách */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {c.sachID}
                        </span>
                      </div>
                    </td>

                    {/* Người dùng */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800 text-sm">
                          {c.nguoiDungID}
                        </span>
                      </div>
                    </td>

                    {/* Đánh giá */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < c.danhGia
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                            size={14}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          {c.danhGia}/5
                        </span>
                      </div>
                    </td>

                    {/* Nội dung bình luận */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {c.noiDung}
                      </p>
                    </td>

                    {/* Ngày */}
                    <td className="py-3 px-4 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    {/* Nút Xóa */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Duyệt / Trạng thái */}
                        {c.duyet ? (
                          <button
                            onClick={() => toggleDuyet(c.binhLuanID, c.duyet)}
                            type="button"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 border border-green-100 transition-colors"
                          >
                            Đã duyệt
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleDuyet(c.binhLuanID, c.duyet)}
                            type="button"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-100 transition-colors"
                          >
                            Duyệt
                          </button>
                        )}

                        <button
                          onClick={() => deletebl(c.binhLuanID)}
                          type="button"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                        >
                          <FaTrash size={12} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {binhLuanXoa.filter((c) =>
                loctheodanhgia ? c.danhGia === loctheodanhgia : true
              ).length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 px-4 text-center text-gray-500 text-sm"
                  >
                    Hiện chưa có bình luận nào.
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

export default QuanLyBinhLuan;
