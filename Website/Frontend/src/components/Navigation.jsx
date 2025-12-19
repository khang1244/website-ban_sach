import avatar from "../assets/logo.jpg";
import { CiShoppingCart } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import SangToi from "./sangtoi";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/user-context";
import ThongBaoChay from "./admin/ThongBaoChay.jsx";
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  // Sử dụng giá trị user từ context
  const { user, setUser, cartCount } = useContext(UserContext);

  // thông báo chạy khi thêm, sửa, xóa
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(
      () => setToast({ show: false, type: "", title: "", message: "" }),
      3000
    );
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    showToast("success", "Thành công", "Đăng xuất thành công");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center text-shadow-black border-b-[1px] border-b-pink-500 sticky top-0 z-50 shadow-xl">
      {/* Toast */}
      <ThongBaoChay
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() =>
          setToast({ show: false, type: "", title: "", message: "" })
        }
      />
      {/* Logo + menu chính */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="transition-all duration-200 hover:scale-105">
          <img
            src={avatar}
            alt="Logo Nhà Sách Hoàng Khang"
            className="h-16 w-auto object-contain rounded-xl shadow-lg border border-white/20 hover:border-white/50 transition-all"
          />
        </Link>
        <ul className="hidden lg:flex space-x-6 items-center font-bold text-white drop-shadow-lg">
          <li className="hover:text-yellow-300 cursor-pointer transition-colors text-base">
            Trang Chủ
          </li>
          <li className="hover:text-yellow-300 cursor-pointer transition-colors text-base">
            Giới Thiệu
          </li>
          <li className="hover:text-yellow-300 cursor-pointer transition-colors text-base">
            Dịch Vụ
          </li>
          <li className="hover:text-yellow-300 cursor-pointer transition-colors text-base">
            Liên Hệ
          </li>
        </ul>
      </div>
      {/* Phần bên phải */}
      <div className="flex items-center space-x-4 relative">
        <IoMdNotificationsOutline className="text-2xl text-white hover:text-yellow-300 cursor-pointer hover:scale-125 transition-transform" />
        <div className="border-l-2 border-yellow-300 px-2 py-1 rounded-xl hover:scale-105 transition-transform bg-gradient-to-r from-orange-400 to-rose-400 text-black font-semibold">
          <div className="flex gap-2">
            <SangToi />
          </div>
        </div>
        <Link to="/giohang" className="relative">
          <CiShoppingCart className="text-2xl text-white hover:text-yellow-300 cursor-pointer hover:scale-125 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Nếu chưa đăng nhập */}
        {!user && (
          <Link to="/dangnhap">
            <button className="bg-white text-black px-3 py-1 rounded-full font-semibold cursor-pointer h-8 hover:bg-amber-300">
              Đăng nhập
            </button>
          </Link>
        )}

        {/* Nếu đã đăng nhập */}
        {user && (
          <div className="relative">
            {/* Avatar + tên */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={
                  // Avatar
                  typeof user?.avatar === "string"
                    ? user.avatar
                    : user?.avatar?.url || avatar
                }
                alt="avatar"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Khi ảnh lỗi
                  e.currentTarget.src = avatar;
                }} // lỗi thì về ảnh mặc định
                className="w-10 h-10 rounded-full border-2 border-white object-cover hover:scale-110 transition-transform"
              />

              <div className="text-left hidden md:block">
                <p className="text-white font-semibold leading-tight">
                  {user?.tenNguoiDung || "Chưa đăng nhập"}
                </p>
              </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-69 bg-white rounded-xl shadow-xl text-black overflow-hidden z-50">
                <div>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 flex justify-between items-center"
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                  >
                    <span>Quản lý tài khoản cá nhân</span>
                    <span className="text-sm text-gray-500">
                      {showAccountMenu ? "▲" : "▼"}
                    </span>
                  </button>

                  {showAccountMenu && (
                    <div className="bg-white border-t border-gray-100">
                      <Link
                        to="/hosonguoidung"
                        className="block px-6 py-2 hover:bg-amber-100"
                        onClick={() => {
                          setIsOpen(false);
                          setShowAccountMenu(false);
                        }}
                      >
                        Cập nhật thông tin người dùng
                      </Link>
                      <Link
                        to="/doimatkhau"
                        className="block px-6 py-2 hover:bg-amber-100"
                        onClick={() => {
                          setIsOpen(false);
                          setShowAccountMenu(false);
                        }}
                      >
                        Đổi mật khẩu
                      </Link>
                      <Link
                        to="/lichsudonhang"
                        className="block px-6 py-2 hover:bg-amber-100"
                        onClick={() => {
                          setIsOpen(false);
                          setShowAccountMenu(false);
                        }}
                      >
                        Lịch sử đơn hàng
                      </Link>
                      <Link
                        to="/quanlydiachi"
                        className="block px-6 py-2 hover:bg-amber-100"
                        onClick={() => {
                          setIsOpen(false);
                          setShowAccountMenu(false);
                        }}
                      >
                        Quản lý địa chỉ
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  onClick={() => {
                    handleLogout();
                    setShowAccountMenu(false);
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
