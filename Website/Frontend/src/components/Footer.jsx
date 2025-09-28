
import React from 'react'
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import avatar from "../assets/avatar.jpg";
const Footer = () => {
  return (
    <div>{/* /// Footer */ }
      <footer className="bg-gradient-to-r from-blue-500 to-purple-500 text-gray-300 px-12 md:px-12 py-10 mt-4 gap-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Cột 1: Logo & Giới thiệu */}
          <div className=" flex items-center w-auto gap-5 ">
            {/* Logo */}
            <div className="flex items-center">
            <img src={avatar} alt="Logo" className="items-center w-45 h-45 rounded-full hover:scale-125 transition-transform" />
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div>
            <h4 className="text-white  text-lg mb-4">Danh mục</h4>
            <ul className="space-y-2 text-sm border-l-2 border-whhite pl-3 font-bold">
              <li><a href="#" className="hover:text-white transition-colors text-base">Truyện tranh</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Ngôn tình</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Kinh dị</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Phiêu lưu</a></li>
            </ul>
          </div>
          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-white text-lg mb-4 ">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm border-l-2 border-white pl-3">
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer text-base">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer text-base">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer text-base">Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-pointer text-base">Liên hệ</a></li>
            </ul>
          </div>
          {/* Cột 4: Thông tin liên hệ & MXH */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Liên hệ</h4>
            <ul className="text-sm space-y-2 border-l-2 border-white pl-3">
              <li className=" hover:text-white cursor-pointer text-base">📍 123 Đường ABC, TP. Hồ Chí Minh</li>
              <li className="hover:text-white  cursor-pointer text-base">📞 0123 456 789</li>
              <li className=" hover:text-white  cursor-pointer text-base">✉️ info@abcbook.vn</li>
              {/* Mạng xã hội */}
            <div className="flex justify-center space-x-13 mt-4 text-1xl">
              <FaFacebook className="hover:text-blue-800 cursor-pointer" />
              <FaTwitter className="hover:text-blue-800 cursor-pointer" />
              <FaTiktok className="hover:text-blue-800 cursor-pointer" />
            </div>
            </ul>

            {/* Mạng xã hội
            <div className="flex justify-center space-x-13 mt-4 text-1xl">
              <FaFacebook className="hover:text-blue-800 cursor-pointer" />
              <FaTwitter className="hover:text-blue-800 cursor-pointer" />
              <FaTiktok className="hover:text-blue-800 cursor-pointer" />
            </div> */}
          </div>
        </div>

        {/* Line cuối cùng */}
        <div className="mt-10 border-t border-red-700 pt-4 text-center text-sm text-white">
          © 2025 Công ty TNHH ABC. All rights reserved.
        </div>
      </footer></div>
  )
}

export default Footer
