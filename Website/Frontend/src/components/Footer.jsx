import React from "react";
import { FaFacebook, FaTiktok, FaTwitter } from "react-icons/fa6";
import avatar from "../assets/avatar.jpg";

const Footer = () => {
  return (
    <footer className="relative bg-[#0A0F1E] text-gray-300 pt-14 pb-10 px-6 md:px-12 mt-10">
      {/* Hiệu ứng glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101829] to-[#0A0F1E] opacity-90 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Column 1 */}
        <div>
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt="Logo"
              className="w-16 h-16 rounded-full shadow-lg ring-2 ring-white/10 hover:scale-105 transition"
            />
            <div>
              <p className="text-xl text-white font-semibold tracking-wide">
                ABC Books
              </p>
              <p className="text-[13px] text-gray-400 italic">
                Chất lượng tạo nên thương hiệu
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-400 max-w-xs leading-relaxed">
            Kho sách khổng lồ — nơi tri thức được chia sẻ mỗi ngày xem và đánh
            giá nhé mọi người.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4 relative inline-block">
            Danh mục
            <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-blue-500 rounded-full"></span>
          </h4>
          <ul className="space-y-2 text-base text-gray-300">
            {["Truyện tranh", "Ngôn tình", "Kinh dị", "Phiêu lưu"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white hover:translate-x-[2px] transition-all block"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4 relative inline-block">
            Hỗ trợ
            <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-blue-500 rounded-full"></span>
          </h4>
          <ul className="space-y-2 text-base text-gray-300">
            {[
              "Chính sách đổi trả",
              "Chính sách bảo mật",
              "Hướng dẫn thanh toán",
              "Liên hệ",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white hover:translate-x-[2px] transition-all block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4 relative inline-block">
            Liên hệ
            <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-blue-500 rounded-full"></span>
          </h4>
          <ul className="space-y-2 text-base text-gray-300">
            <li>📍 123 Đường ABC, Phường Đại Thành, Tp Cần Thơ</li>
            <li>📞 0762835400</li>
            <li>✉️ hoangkhang@abcbook.vn</li>
          </ul>

          {/* Social */}
          <div className="flex gap-5 mt-5 text-2xl">
            <FaFacebook className="cursor-pointer hover:text-blue-500 hover:scale-110 transition-all" />
            <FaTwitter className="cursor-pointer hover:text-blue-400 hover:scale-110 transition-all" />
            <FaTiktok className="cursor-pointer hover:text-white hover:scale-110 transition-all" />
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="relative mt-12 border-t border-gray-800 pt-4 text-center text-xs text-gray-500 tracking-wide">
        © 2025 Hoàng Khang — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
