import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { sanphammoi } from "../lib/data";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

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
  // State lưu danh sách sản phẩm trong giỏ hàng
  const [cart, setCart] = useState(initialCart);

  // Hàm tăng/giảm số lượng sản phẩm
  function updateQuantity(index, delta) {
    // Tạo bản sao mới của giỏ hàng
    const newCart = [...cart];
    // Tăng/giảm số lượng, không cho nhỏ hơn 1
    newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
    setCart(newCart);
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  function removeItem(index) {
    // Lọc ra các sản phẩm khác sản phẩm bị xóa
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  }

  // Tính tổng tiền các sản phẩm trong giỏ
  let subtotal = 0;
  for (let item of cart) {
    subtotal += item.price * item.quantity;
  }
  return (
    <div className=" min-h-screen w-full ">
      <Navigation />
      <div className="max-w-5xl mx-auto py-10 px-4  ">
        <h1 className=" flex text-3xl font-bold text-[#00809D] mb-8 gap-4 justify-center text-black">
          <FaCartShopping />
          Giỏ Hàng
        </h1>
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-lg text-gray-700 mb-4">
              Giỏ hàng của bạn đang trống.
            </p>
            <Link
              to="/"
              className="text-blue-600 hover:underline font-semibold"
            >
              &larr; Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="bg-amber-500 rounded-xl shadow-xl p-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Sản phẩm</th>
                  <th className="py-2">Tác giả</th>
                  <th className="py-2">Đơn giá</th>
                  <th className="py-2">Số lượng</th>
                  <th className="py-2">Tạm tính</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b ">
                    <td className="py-3 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-24 object-cover rounded shadow"
                      />
                      <span className="font-semibold  text-black">
                        {item.title}
                      </span>
                    </td>
                    <td className="py-3">{item.author}</td>
                    <td className="py-3 font-bold ">
                      {item.price.toLocaleString()}đ
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 bg-black rounded-full border hover:bg-[#e0eafc]"
                          onClick={() => updateQuantity(idx, -1)}
                        >
                          <FaMinus />
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          className="p-1 bg-black rounded-full border hover:bg-[#e0eafc]"
                          onClick={() => updateQuantity(idx, 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 font-bold">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeItem(idx)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-8">
              <Link to="/" className="text-black hover:underline font-semibold">
                &larr; Tiếp tục mua sắm
              </Link>
              <div className="text-xl font-bold text-black">
                Tổng cộng: {subtotal.toLocaleString()}đ
              </div>
              <Link
                to="/thanhtoan"
                className="bg-[#00809D] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#006b85] transition"
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default GioHang;
