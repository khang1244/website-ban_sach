import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaCreditCard,
} from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import {
  layGioHangTheoNguoiDung,
  xoaSanPhamKhoiGioHang,
  capNhatSoLuongSanPham,
} from "../lib/gio-hang-apis";
import { UserContext } from "../contexts/user-context";
import { layTonKhoTheoSach } from "../lib/phieu-nhap-apis";

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN") + "đ";
};

function GioHang() {
  const [cart, setCart] = useState([]);
  const [tongTien, setTongTien] = useState(0);
  const timeoutRef = useRef(null);
  const { refreshCartCount } = useContext(UserContext);

  async function updateQuantity(index, delta) {
    const item = cart[index];
    const soLuongMoi = item.soLuong + delta;

    // Không cho giảm xuống dưới 1
    if (soLuongMoi < 1) return;

    // Nếu tăng số lượng, kiểm tra tồn kho
    if (delta > 0) {
      try {
        const tonKhoData = await layTonKhoTheoSach(item.sachID);
        const tonKho = tonKhoData?.tonKho ?? 0;

        if (soLuongMoi > tonKho) {
          alert(
            `Không thể thêm! Sản phẩm "${item.Sach?.tenSach}" chỉ còn ${tonKho} cuốn trong kho.`
          );
          return;
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra tồn kho:", error);
        alert("Không thể kiểm tra số lượng tồn kho. Vui lòng thử lại.");
        return;
      }
    }

    // Cập nhật số lượng trong state
    const newCart = [...cart];
    newCart[index].soLuong = soLuongMoi;
    setCart(newCart);

    const newTotal = newCart.reduce(
      (total, item) => total + item.giaLucThem * item.soLuong,
      0
    );
    setTongTien(newTotal);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const chiTietGioHangID = newCart[index].chiTietGioHangID;
      const soLuong = newCart[index].soLuong;

      try {
        await capNhatSoLuongSanPham(chiTietGioHangID, soLuong);
        console.log("Đã cập nhật số lượng trên server:", soLuong);
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
      }
    }, 500);
  }

  async function removeItem(index) {
    const chiTietGioHangID = cart[index].chiTietGioHangID;

    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);

    const newTotal = newCart.reduce(
      (total, item) => total + item.giaLucThem * item.soLuong,
      0
    );
    setTongTien(newTotal);

    try {
      await xoaSanPhamKhoiGioHang(chiTietGioHangID);
      // Cập nhật lại badge số lượng sản phẩm
      if (typeof refreshCartCount === "function") refreshCartCount();
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
    }
  }

  useEffect(() => {
    const napDuLieuGioHang = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const data = await layGioHangTheoNguoiDung(user.nguoiDungID);
      if (data && data.success) {
        setCart(data.gioHang.ChiTietGioHangs || []);
        setTongTien(data.gioHang.tongTien || 0);
      }
    };
    napDuLieuGioHang();
  }, []);

  return (
    // Nền: Màu xám sáng nhẹ (tinh tế)
    <div className="min-h-screen font-sans">
      <Navigation />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề chính: Cỡ lớn, đậm, màu Indigo nổi bật */}
        <h1 className="text-5xl font-extrabold text-white text-center mb-14 tracking-tight">
          <FaShoppingCart className="inline-block mr-4 text-black" />
          Giỏ Hàng
        </h1>

        {/* --- 2. GIAO DIỆN KHI GIỎ HÀNG TRỐNG --- */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-dashed border-gray-300">
            <FaShoppingCart className="text-indigo-400 text-6xl mx-auto mb-6 opacity-75" />
            <p className="text-xl text-gray-600 mb-8 font-medium">
              Giỏ hàng của bạn hiện đang trống.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          /* --- 3. GIAO DIỆN KHI GIỎ HÀNG CÓ SẢN PHẨM (Responsive 2 Cột) --- */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cột chính: Danh sách sản phẩm (2/3 chiều rộng) */}
            <div className="lg:w-2/3 space-y-6">
              {cart.map((item, index) => (
                // Card sản phẩm: Bố cục 4 phần chính, cân đối, đổ bóng mềm
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow-lg flex items-center transition duration-300 hover:shadow-xl hover:ring-2 hover:ring-indigo-100"
                >
                  {/* Phần 1: Hình ảnh */}
                  <img
                    src={
                      item.Sach?.images
                        ? JSON.parse(item.Sach.images)[0].url
                        : ""
                    }
                    alt={item.Sach?.tenSach}
                    className="w-24 h-32 object-cover rounded-lg mr-6 flex-shrink-0 border border-gray-200"
                  />

                  {/* Phần 2: Thông tin sản phẩm (Căn giữa theo chiều dọc) */}
                  <div className="flex-grow min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {item.Sach?.tenSach || "Tên sách không tồn tại"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Giá gốc: {formatCurrency(item.giaLucThem)}
                    </p>
                  </div>

                  {/* Phần 3: Điều khiển số lượng */}
                  <div className="flex flex-col items-center justify-center space-y-2 flex-shrink-0 w-24 mx-4">
                    <label className="text-xs font-medium text-gray-600">
                      Số lượng
                    </label>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
                        disabled={item.soLuong <= 1}
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="text-md font-bold w-6 text-center text-gray-900">
                        {item.soLuong}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Phần 4: Thành tiền và Xóa (Căn phải) */}
                  <div className="flex flex-col items-end space-y-3 flex-shrink-0 w-32">
                    <p className="text-xl font-extrabold text-indigo-600">
                      {formatCurrency(item.giaLucThem * item.soLuong)}
                    </p>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-600 transition duration-150 p-1 rounded-full hover:bg-red-50"
                      title="Xóa sản phẩm"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phụ: Tóm tắt đơn hàng (1/3 chiều rộng) */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 bg-white p-7 rounded-xl shadow-xl border border-indigo-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-4 border-gray-200">
                  Tóm Tắt Đơn Hàng
                </h2>

                {/* Chi tiết tính toán */}
                <div className="space-y-3">
                  <div className="flex justify-between text-lg text-gray-600">
                    <span>Tạm tính ({cart.length} sản phẩm):</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(tongTien)}
                    </span>
                  </div>
                </div>

                {/* Tổng cộng */}
                <div className="flex justify-between text-3xl font-extrabold text-indigo-700 mt-6 pt-2">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(tongTien)}</span>
                </div>

                {/* Nút Thanh toán: Màu xanh lá cây/Teal nổi bật (CTA chính) */}
                <Link
                  to="/thanhtoan"
                  className="w-full mt-8 block text-center bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-xl hover:bg-emerald-600 transition duration-300 shadow-lg flex items-center justify-center transform hover:scale-[1.01]"
                >
                  <FaCreditCard className="mr-3 w-5 h-5" />
                  Tiến hành thanh toán
                </Link>

                {/* Liên kết phụ */}
                <Link
                  to="/"
                  className="block text-center mt-4 text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default GioHang;
