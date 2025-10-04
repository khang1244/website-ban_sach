import React, { useState } from "react";

import Navigation from "./Navigation";
import Footer from "./Footer";

import { Link } from "react-router-dom";

// Dữ liệu người dùng mẫu
const userData = {
  avatar:
    "https://images.unsplash.com/photo-1678286742832-26543bb49959?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVzZXJ8ZW58MHx8MHx8fDA%3D", // Ảnh đại diện mặc định
  tenNguoiDung: "Nguyễn Văn A 123",
  email: "nguyenvana@gmail.com",
  soDienThoai: "0912345678",
  diaChi: "123 Đường ABC, Quận 1, TP.HCM",
  ngayTao: "2024-05-10",
};

function HoSoNguoiDung() {
  // State cho phép chỉnh sửa thông tin
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(userData);

  // Hàm xử lý lưu thông tin
  function handleSave(e) {
    e.preventDefault();
    setEdit(false);
    // Gửi dữ liệu lên server ở đây nếu cần
    alert("Cập nhật thông tin thành công!");
  }

  return (
    <div className="bg-gradient-to-br  min-h-screen w-full">
      <Navigation />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Hồ Sơ Người Dùng
        </h1>
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#00809D] shadow mb-2"
                />
                {edit && (
                  <label
                    className="absolute bottom-2 right-2 bg-[#00809D] text-white rounded-full p-1 cursor-pointer shadow hover:bg-[#006b85] transition"
                    title="Đổi ảnh đại diện"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setUser({ ...user, avatar: ev.target.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 16v2h12v-2M12.5 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      <path d="M16.5 6.5l-2-2A2 2 0 0013 4H7a2 2 0 00-1.5.5l-2 2A2 2 0 003 8v7a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-.5-1.5z" />
                    </svg>
                  </label>
                )}
              </div>
              <span className="font-semibold text-[#00809D] mt-2">
                Ảnh đại diện
              </span>
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Tên người dùng</label>
              <input
                className="border rounded px-4 py-2"
                value={user.tenNguoiDung}
                disabled={!edit}
                onChange={
                  (e) => setUser({ ...user, tenNguoiDung: e.target.value }) // spread operator
                }
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Email</label>
              <input
                className="border rounded px-4 py-2"
                value={user.email}
                disabled={!edit}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Số điện thoại</label>
              <input
                className="border rounded px-4 py-2"
                value={user.soDienThoai}
                disabled={!edit}
                onChange={(e) =>
                  setUser({ ...user, soDienThoai: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Địa chỉ</label>
              <input
                className="border rounded px-4 py-2"
                value={user.diaChi}
                disabled={!edit}
                onChange={(e) => setUser({ ...user, diaChi: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Ngày tạo tài khoản</label>
              <input
                className="border rounded px-4 py-2 bg-gray-100"
                value={user.ngayTao}
                disabled
              />
            </div>
            <div className="flex gap-4 mt-4">
              {edit ? (
                <>
                  <button
                    type="submit"
                    className="bg-[#00809D] text-white px-6 py-2 rounded font-bold hover:bg-[#006b85] transition"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-400 transition"
                    onClick={() => setEdit(false)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-[#00809D] text-white px-6 py-2 rounded font-bold hover:bg-[#006b85] transition"
                  onClick={() => setEdit(true)}
                >
                  Chỉnh sửa
                </button>
              )}
              <Link
                to="/lichsumuahang"
                className="ml-auto text-blue-600 underline font-semibold"
              >
                Xem lịch sử mua hàng
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HoSoNguoiDung;
