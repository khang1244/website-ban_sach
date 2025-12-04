import avatar from "../assets/avatar.jpg";
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
    <nav className="bg-amber-900 px-6 py-6 flex justify-between items-center text-shadow-black border-b-[1px] border-b-[#abd1db] sticky top-0 z-50 shadow-lg">
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
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src={avatar}
              alt="logo"
              className="h-12 w-12 rounded-full border-2 border-white hover:scale-125 transition-transform"
            />
          </Link>
          <div>
            <h1 className="text-2xl italic text-amber-300 font-black">
              <Link to="/">HOÀNG KHANG</Link>
            </h1>
          </div>
        </div>
        <ul className="flex space-x-4 justify-end items-center font-semibold">
          <li className="hover:text-amber-400 cursor-pointer">Trang Chủ</li>
          <li className="hover:text-amber-400 cursor-pointer">Giới Thiệu</li>
          <li className="hover:text-amber-400 cursor-pointer">Dịch Vụ</li>
          <li className="hover:text-amber-400 cursor-pointer">Liên Hệ</li>
        </ul>
      </div>
      {/* Phần bên phải */}
      <div className="flex items-center space-x-4 relative">
        <IoMdNotificationsOutline className="text-2xl hover:text-red-300 cursor-pointer hover:scale-125 transition-transform" />
        <div className="border-l-2 border px-2 py-1 rounded-xl hover:scale-112 transition-transform bg-amber-300 text-black">
          <div className="flex gap-2">
            <h1>Xám/xanh</h1>
            <SangToi />
          </div>
        </div>
        <Link to="/giohang" className="relative">
          <CiShoppingCart className="text-2xl hover:text-red-400 cursor-pointer hover:scale-125 transition-transform" />
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
              <div className="absolute right-0 mt-2 w-65 bg-white rounded-xl shadow-xl text-black overflow-hidden z-50">
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
                        Cập nhật thông tin cá nhân
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
                        to="/lichsumuahang"
                        className="block px-6 py-2 hover:bg-amber-100"
                        onClick={() => {
                          setIsOpen(false);
                          setShowAccountMenu(false);
                        }}
                      >
                        Lịch sử mua hàng
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
