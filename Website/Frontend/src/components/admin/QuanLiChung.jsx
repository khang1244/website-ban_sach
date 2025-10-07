import React from "react";
import img5 from "../../lib/../assets/sach1.webp";
import img6 from "../../lib/../assets/sach2.webp";
import img7 from "../../lib/../assets/sach3.webp";
import img8 from "../../lib/../assets/sach4.webp";
import img30 from "../../lib/../assets/sach5.webp";

// Dữ liệu mẫu
const revenue = 125000000; // Tổng doanh thu
const userCount = 320; // Số lượng tài khoản
const topUsers = [
  { name: "Nguyễn Văn A", email: "a@gmail.com", orders: 24, avatar: img5 },
  { name: "Trần Thị B", email: "b@gmail.com", orders: 20, avatar: img6 },
  { name: "Lê Văn C", email: "c@gmail.com", orders: 18, avatar: img7 },
  { name: "Phạm Thị D", email: "d@gmail.com", orders: 15, avatar: img8 },
  { name: "Hoàng Văn E", email: "e@gmail.com", orders: 13, avatar: img30 },
];

function QuanLiChung() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#00809D]">
        Thống kê tổng quan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:cursor-pointer hover:bg-amber-300 ">
          <span className="text-gray-500 text-lg mb-2 ">Tổng doanh thu</span>
          <span className="text-2xl font-bold text-green-600 ">
            {revenue.toLocaleString()} VNĐ
          </span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:cursor-pointer hover:bg-amber-300">
          <span className="text-gray-500 text-lg mb-2">Số lượng tài khoản</span>
          <span className="text-2xl font-bold text-blue-600">{userCount}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:cursor-pointer hover:bg-amber-300">
          <span className="text-gray-500 text-lg mb-2">Số lượng đơn hàng</span>
          <span className="text-2xl font-bold text-orange-600">
            {topUsers.reduce((sum, u) => sum + u.orders, 0)}
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
            {topUsers.map((user, idx) => (
              <tr
                key={user.email}
                className="border-b hover:bg-gray-50 hover:text-black hover:cursor-pointer"
              >
                <td className="py-2 px-4 font-bold">{idx + 1}</td>
                <td className="py-2 px-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuanLiChung;
