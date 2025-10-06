import React, { useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { sanphammoi } from "../lib/data";
import { Link } from "react-router-dom";

// Dữ liệu giỏ hàng mẫu
const initialCart = [
  {
    id: 1,
    image: sanphammoi[0]?.hinhAnh,
    title: sanphammoi[0]?.tenSP,
    author: sanphammoi[0]?.tacGia || "Tác giả A",
    price: sanphammoi[0]?.giaGiam,
    quantity: 2,
  },
  {
    id: 2,
    image: sanphammoi[1]?.hinhAnh,
    title: sanphammoi[1]?.tenSP,
    author: sanphammoi[1]?.tacGia || "Tác giả B",
    price: sanphammoi[1]?.giaGiam,
    quantity: 1,
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
    <div className="min-h-screen bg-gradient-to-br">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r bg-amber-500 text-white ">
        <div className="max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
              <FaShoppingBag className="text-2xl" />
              Giỏ Hàng Của Bạn
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-blue-600" />
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Giỏ hàng của bạn đang trống
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 flex items-center hover:bg-amber-300 transition-colors bg-amber-200"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg shadow-sm"
                    />
                    <div className="ml-6 flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{item.author}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, -1)}
                            className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                          >
                            <FaMinus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-12 text-center font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, 1)}
                            className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                          >
                            <FaPlus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-lg font-bold text-gray-800">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.price.toLocaleString()}đ × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <Link
                    to="/"
                    className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
                  >
                    <FaArrowLeft className="mr-2" />
                    Tiếp tục mua sắm
                  </Link>
                  <div className="flex items-center gap-8">
                    <div>
                      <span className="text-sm text-gray-500">Tổng cộng:</span>
                      <div className="text-2xl font-bold text-blue-600">
                        {subtotal.toLocaleString()}đ
                      </div>
                    </div>
                    <Link
                      to="/thanhtoan"
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium
                               hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      Thanh toán ngay
                      <FaArrowLeft className="rotate-180" />
                    </Link>
                  </div>
                </div>
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
