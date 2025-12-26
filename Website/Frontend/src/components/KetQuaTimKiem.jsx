import React from "react";
import { Link, useLocation } from "react-router-dom";

import Navigation from "./Navigation";
import Footer from "./Footer";
import { useEffect, useState, useContext } from "react";
import { FaShoppingCart, FaFire } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { RiShoppingCartLine } from "react-icons/ri";
import { nhanTatCaCacQuyenSach } from "../lib/sach-apis";
import {
  layGioHangTheoNguoiDung,
  themSanPhamVaoGioHang,
} from "../lib/gio-hang-apis";
import { UserContext } from "../contexts/user-context";

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
        // Backend đã trả về images là mảng object, không cần parse nữa
        setDanhSachSanPham(data);
      }
    };
    napTatCaSanPham();
  }, []);
  // User context để cập nhật badge giỏ hàng (giống homepage)
  const { refreshCartCount } = useContext(UserContext);

  // Hàm để xử lý thêm sản phẩm vào giỏ hàng (giống homepage behavior)
  const handleThemSanPhamVaoGioHang = async (sachID, soLuong, giaLucThem) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    const user = JSON.parse(storedUser);
    const nguoiDungID = user.nguoiDungID;

    // Không thêm trùng sản phẩm, yêu cầu người dùng vào giỏ để tự tăng số lượng
    try {
      const gioHangResp = await layGioHangTheoNguoiDung(nguoiDungID);
      const items = gioHangResp?.gioHang?.ChiTietGioHangs || [];
      const existed = items.some(
        (item) => String(item.sachID) === String(sachID)
      );
      if (existed) {
        alert(
          "Sản phẩm đã có trong giỏ hàng. Vui lòng vào giỏ để tăng số lượng nếu cần."
        );
        return;
      }
    } catch (error) {
      console.error("Không kiểm tra được giỏ hàng hiện tại:", error);
    }

    const phanHoiTuSever = await themSanPhamVaoGioHang(
      nguoiDungID,
      sachID,
      soLuong,
      giaLucThem
    );

    if (phanHoiTuSever && phanHoiTuSever.success) {
      alert("Đã thêm sản phẩm vào giỏ hàng!");
      if (typeof refreshCartCount === "function") refreshCartCount();
    } else {
      alert(
        "Thêm sản phẩm vào giỏ hàng thất bại! " + (phanHoiTuSever.message || "")
      );
    }
  };
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
                key={product.sachID || product.maSP}
                className="rounded-md bg-white shadow-md hover:scale-105 overflow-hidden cursor-pointer w-70"
              >
                <div className="w-full h-70 flex items-center justify-center px-1 py-1">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.tenSach}
                    className="w-full h-full object-cover px-1 py-1"
                  />
                </div>
                <div className="p-3 bg-[#3d3fa6] text-white h-full ">
                  <h4 className="font-semibold text-sm">{product.tenSach}</h4>
                  <p>Giảm giá: {product.giaGiam?.toLocaleString()} VNĐ</p>
                  <p className="flex justify-between translate-x-[-2px] px-1">
                    <div className="text-red-400 line-through">
                      Giá gốc: {product.giaBan?.toLocaleString()} VNĐ
                    </div>
                    <CiHeart className="hover:text-red-400 text-2xl " />
                  </p>
                  <div>
                    <div className=" py-2 flex gap-6">
                      <Link
                        className=" flex gap-4 mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-47 font-semibold hover:bg-white hover:text-red-500 "
                        to={`/chitietsanpham/${product.sachID || product.maSP}`}
                      >
                        <div className="flex justify-center items-center w-full gap-2 ">
                          <FaFire className=" text-amber-400 " />
                          <span>Xem chi tiết</span>
                        </div>
                      </Link>
                      {/* Thêm giỏ hàng: button riêng, không lồng Link */}
                      <button
                        onClick={() =>
                          handleThemSanPhamVaoGioHang(
                            product.sachID || product.maSP,
                            1,
                            product.giaGiam || product.giaBan
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-[#00809D] font-bold py-2 px-3 rounded-lg hover:scale-105 transition-all"
                      >
                        <RiShoppingCartLine className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
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
