import logo from "../assets/avatar.jpg";
import { FaShoppingCart } from "react-icons/fa";
function Navigation() {
  return (
    <nav className="px-6 py-6 flex justify-between items-center bg-[#2c51d7] text-white border-b-[1px] border-b-[#abd1db] ">
      <div className="flex items-center space-x-6">
        <div>
          <img src={logo} alt="logo" className="h-12 w-12 rounded-full" />
        </div>
        <ul className="flex space-x-4 justify-end items-center font-semibold">
          <li>Trang Chủ</li>
          <li>Giới Thiệu</li>
          <li>Dịch Vụ</li>
          <li>Liên Hệ</li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        <FaShoppingCart className="text-2xl" />
        <div className="space-x-0">
          <button className="bg-white text-black px-3 py-2 rounded-full font-semibold" >Đăng nhập</button>
          <button className="hidden">Đăng xuất</button>
        </div>
      </div>
    </nav>
  );
}
export default Navigation;
