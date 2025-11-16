import { FaStar, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { layTatCaBinhLuan } from "../../lib/binh-luan-apis";

function QuanLiBinhLuan() {
  const [binhLuan, setBinhLuan] = useState([]);
  useEffect(() => {
    // Gọi API để lấy danh sách bình luận từ server
    const napDuLieuBinhLuan = async () => {
      const phanHoiTuSever = await layTatCaBinhLuan();
      if (phanHoiTuSever && phanHoiTuSever.success) {
        setBinhLuan(phanHoiTuSever.data); // Cập nhật danh sách bình luận từ server
      } else {
        console.error("Lỗi khi tải bình luận:", phanHoiTuSever.message);
      }
    };
    napDuLieuBinhLuan();
  }, []);
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
              {binhLuan &&
                binhLuan.length > 0 &&
                binhLuan.map((c, idx) => (
                  <tr
                    key={c.id}
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
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                      >
                        <FaTrash size={12} />
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              {binhLuan.length === 0 && (
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

export default QuanLiBinhLuan;
