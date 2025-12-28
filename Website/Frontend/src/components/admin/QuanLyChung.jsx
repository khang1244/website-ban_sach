import React, { useEffect, useState } from "react";
import { layThongKe, layDoanhThuTheoThang } from "../../lib/thong-ke-apis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function QuanLyChung() {
  // Biến trạng thái để lưu trữ các thống kê chung
  const [thongKe, setThongKe] = useState({
    tongDoanhThu: 0,
    soLuongNguoiDung: 0,
    soLuongDonHang: 0,
    topNguoiDung: [],
  });

  const [doanhThuTheoThang, setDoanhThuTheoThang] = useState([]); // Dữ liệu doanh thu theo tháng
  const [loadingChart, setLoadingChart] = useState(true); // Biến trạng thái để quản lý trạng thái tải biểu đồ
  const [thangDuocChon, setThangDuocChon] = useState(""); // Tháng được chọn để hiển thị biểu đồ

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
    " VNĐ";

  // Sử dụng useEffect để tải dữ liệu thống kê khi component được gắn vào DOM
  useEffect(() => {
    // // Hàm nạp dữ liệu thống kê chung
    async function napDuLieuThongKe() {
      const phanHoiTuSever = await layThongKe();
      if (phanHoiTuSever && phanHoiTuSever.success) {
        setThongKe(phanHoiTuSever.data);
        console.log("Dữ liệu thống kê lấy từ server:", phanHoiTuSever.data);
      } else {
        alert(
          "Lấy dữ liệu thống kê thất bại! " + (phanHoiTuSever.message || "")
        );
        setThongKe({
          tongDoanhThu: 0,
          soLuongNguoiDung: 0,
          soLuongDonHang: 0,
          topNguoiDung: [],
        });
      }
    }
    // Hàm nạp dữ liệu doanh thu theo tháng
    async function napDoanhThuTheoThang() {
      setLoadingChart(true);
      const result = await layDoanhThuTheoThang();
      if (result.success && result.data.length > 0) {
        setDoanhThuTheoThang(result.data);
        setThangDuocChon("all");
        console.log("Doanh thu theo tháng:", result.data);
      } else {
        setDoanhThuTheoThang([]);
        setThangDuocChon("all");
      }
      setLoadingChart(false);
    }

    napDuLieuThongKe();
    napDoanhThuTheoThang();
  }, []);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#00809D]">
        Quản Lý Báo Cáo Thống Kê
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
          <span className="text-lg font-semibold mb-1">Tổng doanh thu</span>
          <span className="text-xs opacity-90 mb-2">
            (Chưa bao gồm khuyến mãi, phí ship)
          </span>
          <span className="text-3xl font-bold">
            {thongKe.tongDoanhThu.toLocaleString()} ₫
          </span>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
          <span className="text-lg font-semibold mb-3">Số lượng tài khoản</span>
          <span className="text-3xl font-bold">{thongKe.soLuongNguoiDung}</span>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
          <span className="text-lg font-semibold mb-3">Số lượng đơn hàng</span>
          <span className="text-3xl font-bold">{thongKe.soLuongDonHang}</span>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Doanh thu theo tháng
        </h2>

        {/* Chọn tháng để xem */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="text-gray-700 font-medium">Chọn tháng:</div>
          <select
            value={thangDuocChon}
            onChange={(e) => setThangDuocChon(e.target.value)}
            className="border text-black border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
          >
            <option value="all">Tất cả các tháng</option>
            {doanhThuTheoThang.map((item) => (
              <option key={item.thang} value={item.thang}>
                {item.thang}
              </option>
            ))}
          </select>

          {thangDuocChon && thangDuocChon !== "all" && (
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-inner">
              Doanh thu tháng này:{" "}
              {formatCurrency(
                doanhThuTheoThang.find((m) => m.thang === thangDuocChon)
                  ?.doanhThu || 0
              )}
            </div>
          )}

          {thangDuocChon === "all" && (
            <div className="bg-blue-100 rounded-lg px-4 py-2 text-sm text-blue-700 shadow-inner">
              Tổng doanh thu:{" "}
              {formatCurrency(
                doanhThuTheoThang.reduce(
                  (sum, item) => sum + (item.doanhThu || 0),
                  0
                )
              )}
            </div>
          )}
        </div>

        {loadingChart ? (
          <div className="text-center py-12 text-gray-500">
            Đang tải biểu đồ...
          </div>
        ) : doanhThuTheoThang.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={
                thangDuocChon && thangDuocChon !== "all"
                  ? doanhThuTheoThang.filter(
                      (item) => item.thang === thangDuocChon
                    )
                  : doanhThuTheoThang
              }
              margin={{ top: 20, right: 24, left: 24, bottom: 36 }}
              style={{ background: "#f8fafc", borderRadius: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="thang"
                tick={{ fontSize: 12, fill: "#475569" }}
                height={60}
                tickFormatter={(value) => value.replace("Tháng ", "T")}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#475569" }}
                tickFormatter={(v) => Number(v || 0).toLocaleString("vi-VN")}
                width={100}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => label.replace("Tháng ", "Tháng ")}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="doanhThu"
                fill="#0ea5e9"
                name="Doanh thu"
                radius={[10, 10, 0, 0]}
                barSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Chưa có dữ liệu doanh thu
          </div>
        )}
      </div>

      {/* Bảng Top người dùng */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Top 5 người dùng đặt hàng nhiều nhất
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Avatar</th>
                <th className="py-3 px-4">Tên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Số đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {thongKe.topNguoiDung.length > 0 ? (
                thongKe.topNguoiDung.map((user, idx) => (
                  <tr
                    key={user.NguoiDung.email}
                    className="border-b hover:bg-gray-50 transition-colors text-black"
                  >
                    <td className="py-3 px-4 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={
                          user.NguoiDung.avatar
                            ? JSON.parse(user.NguoiDung.avatar)?.url
                            : ""
                        }
                        alt={user.NguoiDung.tenNguoiDung}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="py-3 px-4">{user.NguoiDung.tenNguoiDung}</td>
                    <td className="py-3 px-4">{user.NguoiDung.email}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {user.soLuongDonHang}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Chưa có dữ liệu
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

export default QuanLyChung;
