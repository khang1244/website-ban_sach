import React, { useEffect, useState } from "react";
import { layThongKe } from "../../lib/thong-ke-apis";

function QuanLiChung() {
  // Biến trạng thái để lưu trữ các thống kê chung
  const [thongKe, setThongKe] = useState({
    tongDoanhThu: 0,
    soLuongNguoiDung: 0,
    soLuongDonHang: 0,
    topNguoiDung: [],
  });

  useEffect(() => {
    // Gọi hàm có sẵn trong file don-hang-apis.js để lấy đơn hàng của người dùng từ server
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
    napDuLieuThongKe();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#00809D]">
        Thống kê tổng quan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:cursor-pointer hover:bg-amber-300 ">
          <span className="text-gray-500 text-lg mb-2 ">Tổng doanh thu</span>
          <span className="text-2xl font-bold text-green-600 ">
            {thongKe.tongDoanhThu.toLocaleString()} VNĐ
          </span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:cursor-pointer hover:bg-amber-300">
          <span className="text-gray-500 text-lg mb-2">Số lượng tài khoản</span>
          <span className="text-2xl font-bold text-blue-600">
            {thongKe.soLuongNguoiDung}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:cursor-pointer hover:bg-amber-300">
          <span className="text-gray-500 text-lg mb-2">Số lượng đơn hàng</span>
          <span className="text-2xl font-bold text-orange-600">
            {thongKe.soLuongDonHang}
          </span>
        </div>
      </div>

      <div className="bg-amber-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Top 5 người dùng đặt hàng nhiều nhất
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-amber-700 text-white">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Avatar</th>
              <th className="py-2 px-4">Tên</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Số đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {thongKe &&
              thongKe.topNguoiDung.length > 0 &&
              thongKe.topNguoiDung.map((user, idx) => (
                <tr
                  key={user.NguoiDung.email}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-2 px-4 font-bold">{idx + 1}</td>
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">{user.NguoiDung.tenNguoiDung}</td>
                  <td className="py-2 px-4">{user.NguoiDung.email}</td>
                  <td className="py-2 px-4">{user.soLuongDonHang}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuanLiChung;
