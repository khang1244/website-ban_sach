import logo from "../assets/avatar.jpg";
import { CiShoppingCart } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import SangToi from "./sangtoi";
import { Link } from "react-router-dom";
function Navigation() {
  return (
    <nav className=" bg-amber-900 px-6 py-6 flex justify-between items-center  text-shadow-black border-b-[1px] border-b-[#abd1db] sticky top-0 z-50 shadow-lg ">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 ">
          <Link to="/">
            <img
              src={logo}
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
          <li className="hover:text-amber-400 cursor-pointer ">Trang Chủ</li>
          <li className="hover:text-amber-400 cursor-pointer">Giới Thiệu</li>
          <li className="hover:text-amber-400 cursor-pointer">Dịch Vụ</li>
          <li className="hover:text-amber-400 cursor-pointer">Liên Hệ</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        <IoMdNotificationsOutline className="text-2xl hover:text-red-300 cursor-pointer hover:scale-125 transition-transform" />
        <div className="border-l-2 border px-2 py-1 rounded-xl hover:scale-112 transition-transform bg-amber-300 text-black">
          <div className="flex gap-2 ">
            <h1>Xám/xanh</h1>
            <SangToi />
          </div>
        </div>
        <Link to="/giohang">
          <CiShoppingCart className="text-2xl hover:text-red-400 cursor-pointer hover:scale-125 transition-transform" />
        </Link>
        <div className="space-x-0 gap-2 flex">
          <Link to="/dangnhap">
            <button className="bg-white text-black px-3 py-1 rounded-full font-semibold cursor-pointer h-8 hover:bg-amber-300">
              Đăng nhập
            </button>
          </Link>

          <button className="hidden px-3 py-1">Đăng xuất</button>
        </div>
      </div>
    </nav>
  );
}
export default Navigation;
