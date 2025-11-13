import React, { useState, useEffect } from "react";
import {
  layTatCaNguoiDung,
  xoaNguoiDungTheoID,
  thayDoiTrangThaiNguoiDung,
} from "../../lib/nguoi-dung-apis";

function QuanLyNguoiDung() {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm

  const xuLyXoaTaiKhoan = async (nguoiDungID) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn XÓA người dùng có ID: ${nguoiDungID} không? Hành động này không thể hoàn tác.`
    );

    if (!confirmDelete) return;

    const res = await xoaNguoiDungTheoID(nguoiDungID);

    if (res.ok) {
      setUsers((prev) =>
        prev.filter((user) => user.nguoiDungID !== nguoiDungID)
      );
      alert("Đã xóa tài khoản người dùng thành công.");
    } else {
      alert(res.data?.message || "Xóa tài khoản thất bại.");
    }
  };

  // Xử lý Khóa / Mở khóa tài khoản (toggle)
  const xuLyKhoaTaiKhoan = async (nguoiDungID) => {
    // Tìm trạng thái hiện tại từ state
    const user = users.find((u) => u.nguoiDungID === nguoiDungID);
    if (!user) return;

    const isActive =
      user.trangThaiTaiKhoan === 1 ||
      user.trangThaiTaiKhoan === true ||
      user.trangThaiTaiKhoan === "1";

    const newTrangThai = isActive ? 0 : 1;

    // Gọi API để cập nhật trạng thái
    try {
      const res = await thayDoiTrangThaiNguoiDung(nguoiDungID, newTrangThai);
      if (res.ok) {
        // Cập nhật local state khi server trả về thành công
        setUsers((prev) =>
          prev.map((u) =>
            u.nguoiDungID === nguoiDungID
              ? { ...u, trangThaiTaiKhoan: newTrangThai }
              : u
          )
        );
      } else {
        alert(res.data?.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thay đổi trạng thái:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };
  // Lọc người dùng theo tên hoặc email
  const filteredUsers = users.filter((user) => {
    const keyword = searchTerm.toLowerCase();
    return (
      user.tenNguoiDung.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

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
      {/* Ô tìm kiếm */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo Tên hoặc Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-700 transition duration-150"
        />
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
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
