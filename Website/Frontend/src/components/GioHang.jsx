import React, { useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { sanphammoi } from "../lib/data";
import { Link } from "react-router-dom";

// DỮ LIỆU MẪU (Giữ nguyên)
const initialCart = [
  {
    id: 1,
    image:
      sanphammoi[0]?.hinhAnh ||
      "https://via.placeholder.com/150x200?text=Sách+1",
    title: sanphammoi[0]?.tenSP || "Doraemon - Tập 1 Doraemon",
    author: sanphammoi[0]?.tacGia || "Tác giả A",
    price:
      sanphammoi[0]?.giaGiam && sanphammoi[0].giaGiam > 0
        ? sanphammoi[0].giaGiam
        : 40000,
    quantity: 3,
  },
  {
    id: 2,
    image:
      sanphammoi[1]?.hinhAnh ||
      "https://via.placeholder.com/150x200?text=Sách+2",
    title: sanphammoi[1]?.tenSP || "Thần Đồng Đất Phương Nam",
    author: sanphammoi[1]?.tacGia || "Tác giả B",
    price:
      sanphammoi[1]?.giaGiam && sanphammoi[1].giaGiam > 0
        ? sanphammoi[1].giaGiam
        : 10000,
    quantity: 2,
  },
];

function GioHang() {
  const [cart, setCart] = useState(initialCart);

  function updateQuantity(index, delta) {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
    setCart(newCart);
  }

  function removeItem(index) {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10">
            <h1 className="text-4xl font-extrabold flex items-center gap-4">
              <FaShoppingBag className="text-3xl" />
              Giỏ Hàng Của Bạn
            </h1>
            <p className="text-blue-200 mt-1">
              Kiểm tra lại các sản phẩm và tiến hành thanh toán.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cart.length === 0 ? (
          /* Giỏ hàng trống */
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-12 text-center max-w-lg mx-auto">
            {/* ... (Giữ nguyên) */}
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy thêm những cuốn sách tuyệt vời vào giỏ hàng để bắt đầu mua
              sắm!
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 transition duration-300 font-semibold px-6 py-3 rounded-xl shadow-md"
            >
              <FaArrowLeft className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          /* SỬA LỖI LỆCH CHIỀU CAO TẠI ĐÂY */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cột chính: Danh sách sản phẩm (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Sản phẩm đã chọn ({cart.length})
              </h2>
              {/* Thêm h-full để cố gắng kéo dài khối nếu grid cho phép */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 flex items-start hover:bg-blue-50 transition-colors duration-200"
                  >
                    {/* ... (Giữ nguyên chi tiết sản phẩm) */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-md border border-gray-100 flex-shrink-0"
                    />

                    <div className="ml-5 flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 pr-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Tác giả:{" "}
                        <span className="font-medium">{item.author}</span>
                      </p>

                      <div className="flex items-center mt-3 gap-5">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, -1)}
                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-10 text-center font-semibold text-gray-800 text-base">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FaPlus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xl font-bold text-blue-600">
                        {(Number(item.price) * item.quantity).toLocaleString()}đ
                      </div>
                      <div className="text-sm text-gray-500 mt-1 whitespace-nowrap">
                        {Number(item.price).toLocaleString()}đ / SP
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/"
                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mt-4 transition-colors"
              >
                <FaArrowLeft className="mr-2 w-4 h-4" />
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* Cột phụ: Tóm tắt đơn hàng (lg:col-span-1) */}
            <div className="lg:col-span-1">
              {/* Thêm flex-grow và min-h để kéo dài khối này */}
              {/* Thêm pt-14 và pb-10 để tăng khoảng đệm chiều dọc, giúp khối to hơn */}
              <div className="sticky top-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 pt-14 pb-10">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính ({cart.length} sản phẩm)</span>
                    <span className="font-medium">
                      {subtotal.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 border-b pb-4">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-gray-900">
                    Thành tiền
                  </span>
                  <div className="text-3xl font-extrabold text-blue-700">
                    {subtotal.toLocaleString()}đ
                  </div>
                </div>

                <Link
                  to="/thanhtoan"
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg
                            hover:bg-blue-700 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
                >
                  <FaCreditCard className="w-5 h-5" />
                  Thanh toán ngay
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
