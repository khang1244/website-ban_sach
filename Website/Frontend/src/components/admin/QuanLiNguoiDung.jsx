import React, { useState, useEffect } from "react";
import { layTatCaNguoiDung } from "../../lib/nguoi-dung-apis";

function QuanLyNguoiDung() {
  const [users, setUsers] = useState([]); // Danh sách người dùng

  const xuLyXoaTaiKhoan = async () => {};

  // Xử lý Khóa / Mở khóa tài khoản (toggle)
  const xuLyKhoaTaiKhoan = async () => {};

  // Lấy tất cả người dùng khi component mount
  useEffect(() => {
    const fetchAll = async () => {
      const list = await layTatCaNguoiDung(); // trả về mảng
      setUsers(Array.isArray(list) ? list : []);
    };
    fetchAll();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <svg
            className="w-8 h-8 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2a3 3 0 00-5.356-1.857M9 20V10m7 10v-4m-7 4h14a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2zm7-14v2m-7-2v2"
            ></path>
          </svg>
          Quản Lý Người Dùng
        </h1>
        <div className="text-gray-600 font-medium">
          Tổng số:{" "}
          <span className="text-indigo-600 font-bold">{users.length}</span>
        </div>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên Người Dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => {
                const isActive =
                  user.trangThaiTaiKhoan === 1 ||
                  user.trangThaiTaiKhoan === true ||
                  user.trangThaiTaiKhoan === "1";

                return (
                  <tr
                    key={user.nguoiDungID}
                    className="hover:bg-gray-50 transition duration-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.nguoiDungID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.tenNguoiDung}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.soDienThoai}
                    </td>

                    {/* Trạng Thái */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isActive ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>

                    {/* Vai trò */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {user.vaiTro}
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => xuLyKhoaTaiKhoan(user.nguoiDungID)}
                        className={`mr-3 py-1 px-3 rounded-lg text-white font-semibold transition duration-150 shadow-md ${
                          isActive
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                        title={
                          isActive ? "Khóa Tài Khoản" : "Mở Khóa Tài Khoản"
                        }
                      >
                        {isActive ? "Khóa" : "Mở Khóa"}
                      </button>

                      <button
                        onClick={() => xuLyXoaTaiKhoan(user.nguoiDungID)}
                        className="py-1 px-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-150 shadow-md"
                        title="Xóa Tài Khoản Vĩnh Viễn"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-gray-500 text-lg"
                >
                  Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuanLyNguoiDung;
