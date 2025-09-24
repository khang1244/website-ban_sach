import logo from "../assets/avatar.jpg";
import { CiShoppingCart } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import SangToi from "./sangtoi";
import { Link } from "react-router-dom";
function Navigation() {
  return (
    <nav className="px-6 py-6 flex justify-between items-center  text-shadow-black border-b-[1px] border-b-[#abd1db]   ">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="h-12 w-12 rounded-full" />
           <div>
          <h1 className="text-2xl font-bold italic text-amber-300 font-black">HOÀNG KHANG</h1>
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
          <IoMdNotificationsOutline  className="text-2xl hover:text-red-300 cursor-pointer "/>
        <div>
          <SangToi />
        </div>
        <CiShoppingCart className="text-2xl hover:text-red-400 cursor-pointer"/> 
        <div className="space-x-0 gap-2 flex">
          <Link to="/dangnhap">
          <button className="bg-white text-black px-3 py-1 rounded-full font-semibold cursor-pointer h-8 hover:bg-amber-600" >Đăng nhập</button>
          </Link>
           <Link to="/dangky">
          <button className="bg-white text-black px-3 py-1 rounded-full font-semibold cursor-pointer h-8 hover:bg-amber-600" >Đăng Ký</button>
          </Link>
            <button className="hidden px-3 py-1">Đăng xuất</button>
        </div>
      </div>
    </nav>
  );
}
export default Navigation;
