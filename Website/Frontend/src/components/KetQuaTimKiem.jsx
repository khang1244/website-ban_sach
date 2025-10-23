import React from "react";
import { Link, useLocation } from "react-router-dom";

import Navigation from "./Navigation";
import Footer from "./Footer";
import { useEffect, useState } from "react";

import { FaShoppingCart } from "react-icons/fa";
import { nhanTatCaCacQuyenSach } from "../lib/sach-apis";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const KetQuaTimKiemSach = () => {
  const query = useQuery(); // Khởi tạo query từ URL

  const searchTerm = query.get("q") || ""; // truyện tranh, searchTerm là thuật ngữ tìm kiếm

  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  // Lọc sản phẩm theo tên hoặc mô tả chứa từ khóa tìm kiếm
  const filteredProducts = danhSachSanPham.filter((product) => {
    const lowerSearch = searchTerm.toLowerCase(); // chuyển về chữ thường để so sánh không phân biệt hoa thường
    return (
      product.tenSach.toLowerCase().includes(lowerSearch) ||
      (product.moTa && product.moTa.toLowerCase().includes(lowerSearch))
    );
  });
  // Thêm useEffect để nạp dữ liệu thật từ database
  useEffect(() => {
    const napTatCaSanPham = async () => {
      const data = await nhanTatCaCacQuyenSach();
      if (data) {
        // Chuyển đổi chuỗi JSON của trường images thành mảng để sử dụng
        data.forEach((sach) => {
          sach.images = JSON.parse(sach.images);
        });

        setDanhSachSanPham(data);
      }
    };
    napTatCaSanPham();
  }, []);
  return (
    <div className="bg-[#00809D] min-h-screen h-fit">
      <Navigation />
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-yellow-300">"{searchTerm}"</span>{" "}
        </h2>
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <p className="text-gray-700 text-lg">
              Không tìm thấy sản phẩm phù hợp.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block bg-[#00809D] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#005f73] transition"
            >
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <li
                key={product.maSP}
                className="bg-white rounded-lg shadow p-4 flex flex-col"
              >
                <Link to="/chitietsanpham">
                  <div className="h-56 w-full rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.images[0]?.url}
                      alt={product.tenSP}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <h3 className="font-bold text-[#00809D] text-lg mb-2">
                  {product.tenSach}
                </h3>
                <p className="text-[#00f821] font-bold">
                  {product.giaGiam.toLocaleString()} VNĐ
                </p>
                <p className="text-gray-400 line-through text-sm mb-2">
                  Giá gốc: {product.giaBan.toLocaleString()} VNĐ
                </p>
                <Link
                  to="/giohang"
                  className="flex justify-center items-center gap-2 mt-auto bg-[#00809D] text-white py-2 px-4 rounded-full font-semibold hover:bg-[#005f73] transition"
                >
                  <FaShoppingCart />
                  Thêm Giỏ Hàng
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KetQuaTimKiemSach;
