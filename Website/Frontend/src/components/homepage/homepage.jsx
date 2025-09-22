import Navigation from "../Navigation";
import Banner from "../Banner";
import { sanphammoi, sanphambanchay } from "../../lib/data";
import { useState } from "react";
import sach4 from "../../assets/sach4.webp";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import avatar from "../../assets/avatar.jpg";

const danhmuc = [
  "Tất cả",
  "Truyện tranh",
  "ngôn tình",
  "phiêu lưu",
  "kinh dị",
];

const giasach = [ // Vùng giá 
  { label: "Tất cả", value: "all" },
  { label: "Dưới 50.000", value: "<50000" },
  { label: "50.000 - 100.000", value: "50000-100000" },
  { label: "Trên 100.000", value: ">100000" },
  { label: "Trên 200.000", value: ">200000" }
];

function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState("all");
   // bộ lộc sách bán chạy
  const [selectedCategoryBC, setSelectedCategoryBC] = useState("Tất cả"); // Hook của React danh mục được chọn bộ lọc sách bán chạy
  const [selectedPriceBC, setSelectedPriceBC] = useState("all"); // Hook của React giá được chọn của bộ lọc sách bán chạy
  

   // Lọc sản phẩm theo danh mục và giá của bộ lọc sách mới
const bolocsachmoi = sanphammoi.filter((product) => {
  let matchCategory =
    selectedCategory === "Tất cả" ||
    (product.category &&
      product.category.toLowerCase() === selectedCategory.toLowerCase());
  let matchPrice = true;
      
  if (selectedPrice === "<50000") {
    matchPrice = product.giaGiam < 50000;
  } else if (selectedPrice === "50000-100000") {
    matchPrice = product.giaGiam >= 50000 && product.giaGiam <= 100000;
  } else if (selectedPrice === ">100000") {
    matchPrice = product.giaGiam > 100000;
  } else if (selectedPrice === ">200000") {
    matchPrice = product.giaGiam > 200000;
  }

  return matchCategory && matchPrice;
});
      // Lọc sản phẩm theo danh mục và giá của bộ lọc sách bán chạy
const bolocsachbanchay = sanphambanchay.filter((product) => {
  let matchCategory =
   selectedCategoryBC === "Tất cả" ||
    (product.category &&
      product.category.toLowerCase() === selectedCategoryBC.toLowerCase());
  let matchPrice = true;
      
  if (selectedPriceBC === "<50000") {
    matchPrice = product.giaGiam < 50000;
  } else if (selectedPriceBC === "50000-100000") {
    matchPrice = product.giaGiam >= 50000 && product.giaGiam <= 100000;
  } else if (selectedPriceBC === ">100000") {
    matchPrice = product.giaGiam > 100000;
  }if (selectedPriceBC === ">200000") {
    matchPrice = product.giaGiam > 200000;
  }

  return matchCategory && matchPrice;
});

  return (
    <div className="bg-[#2c51d7] min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Banner */}
      <Banner />

      {/* ==== Sách Mới ==== */}
      <div className="mt-6">
        <h3 className="py-2 px-5 text-white text-xl font-bold">Sách Mới</h3>
        <div className="flex gap-4 mt-4 mx-4">
        {/* Bộ lọc đẹp với danh mục và giá hiển thị hết ra */}
        <div className="w-full md:w-1/4 bg-white rounded-xl shadow-md p-5 space-y-6">
          {/* Danh mục */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-3">Danh mục:</h4>
            <div className="flex flex-wrap gap-2">
              {danhmuc.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                  } transition`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
            {/* lọc Giá */}
            <div>
              <h4 className="text-gray-800 font-semibold mb-3">Giá:</h4>
              <div className="flex flex-wrap gap-2">
                {giasach.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPrice(range.value)}
                    className={`px-3 py-1 rounded-full border ${
                      selectedPrice === range.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-gray-100 text-gray-800 hover:bg-green-100"
                    } transition`}
                  >
                    {range.label}
                  </button>
                ))}
                <div className="mt-10 shadow-md">
                  <img src={sach4} alt="Logo" className="w-90 h-auto rounded-md shadow-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm bên phải */}
          <div className="w-3/4">
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bolocsachmoi.map((product) => (
                <li key={product.maSP} className="rounded-md bg-white shadow-md overflow-hidden ">
                 <div className="w-full h-60 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.hinhAnh}
                    alt={product.tenSP}
                    className="w-full h-full object-cover px-2 py-2"
                  />
                </div>
                  <div className="p-3 bg-[#2c51d7] text-white">
                    <h4 className="font-semibold text-lg">{product.tenSP}</h4>
                    <p>Giảm giá: {product.giaGiam.toLocaleString()} VNĐ</p>
                    <p className="line-through text-red-400">
                      Giá gốc: {product.gia.toLocaleString()} VNĐ
                    </p>
                    <button className="mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-full font-semibold hover:bg-white hover:text-black transition-colors">
                      Thêm vào giỏ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
  {/* Sản phẩm bán chạy */} 
    <div className="mt-6 ">
        <h3 className="py-2 px-5 text-white text-xl font-bold">Sách Bán Chạy</h3>
         {/* Bộ lọc theo danh mục và giá của sản phẩm bán chạy */}
        <div className="flex flex-wrap gap-4 px-4 py-6 bg-white w-auto rounded-lg mx-4  ">
          <div>
            <label className="text-black font-semibold mr-2">Danh mục:</label>
            <select
              className="rounded px-2 py-1"
              value={selectedCategoryBC}
              onChange={(e) => setSelectedCategoryBC(e.target.value)}
            >
              {danhmuc.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-black font-semibold mr-2">Giá:</label>
            <select
              className="rounded px-2 py-1"
              value={selectedPriceBC}
              onChange={(e) => setSelectedPriceBC(e.target.value)}
            >
              {giasach.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ul className="grid grid-cols-4 gap-4 px-5 py-1 mt-3">
          {bolocsachbanchay.map((product) => (
            <li key={product.maSP} className="w-full h-fit rounded-md">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <img src={product.hinhAnh} alt={product.tenSP} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <h4 className="font-semibold text-white text-xl">{product.tenSP}</h4>
                <p className=" text-white">
                  Giảm giá: {product.giaGiam.toLocaleString()} VNĐ
                </p>
                <p className="line-through text-red-400">Giá gốc: {product.gia.toLocaleString()} VNĐ</p>
                <button className=" mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-full font-semibold hover:bg-white hover:text-black transition-colors">
                  Thêm vào giỏ
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* /// Footer */}
      <footer className="bg-gradient-to-r from-blue-500 to-purple-500 text-gray-300 px-12 md:px-12 py-10 mt-16 gap-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Cột 1: Logo & Giới thiệu */}
          <div className=" flex items-center w-auto gap-5 ">
            {/* Logo */}
            <div className="flex items-center">
            <img src={avatar} alt="Logo" className="items-center w-45 h-45   rounded-full" />
            </div>
          
          </div>

          {/* Cột 2: Danh mục */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Danh mục</h4>
            <ul className="space-y-2 text-sm border-l-2 border-whhite pl-3 font-bold">
              <li><a href="#" className="hover:text-white transition-colors text-base">Truyện tranh</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Ngôn tình</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Kinh dị</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Phiêu lưu</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4 ">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm border-l-2 border-white pl-3">
              <li><a href="#" className="hover:text-white transition-colors text-base">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-base">Liên hệ</a></li>
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ & MXH */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Liên hệ</h4>
            <ul className="text-sm space-y-2 border-l-2 border-white pl-3">
              <li className="text-base">📍 123 Đường ABC, TP. Hồ Chí Minh</li>
              <li className="text-base">📞 0123 456 789</li>
              <li className="text-base">✉️ info@abcbook.vn</li>
            </ul>

            {/* Mạng xã hội */}
            <div className="flex space-x-4 mt-4">
              <FaFacebook />
              <FaTwitter />
              <FaTiktok />
            </div>
          </div>
        </div>

        {/* Line cuối cùng */}
        <div className="mt-10 border-t border-red-700 pt-4 text-center text-sm text-white">
          © 2025 Công ty TNHH ABC. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default Homepage;


