import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

// Dữ liệu chi tiết đơn hàng mẫu
const demoOrders = [
  {
    id: "DH001",
    date: "2025-08-20",
    status: "Đã giao hàng",
    total: 320000,
    address: "123 Đường ABC, Quận 1, TP.HCM",
    items: [
      { name: "Harry Potter và Hòn Đá Phù Thủy", quantity: 1, price: 145000 },
      { name: "Dế Mèn Phiêu Lưu Ký", quantity: 2, price: 87500 },
    ],
    comments: [
      {
        product: "Harry Potter và Hòn Đá Phù Thủy",
        user: "Nguyễn Văn A",
        content: "Sách rất hay!",
        rating: 5,
      },
    ],
  },
  {
    id: "DH002",
    date: "2025-08-15",
    status: "Đang xử lý",
    total: 145000,
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    items: [{ name: "Totto-chan bên cửa sổ", quantity: 1, price: 145000 }],
    comments: [],
  },
];

function ChiTietDonHang() {
  const { id } = useParams();
  const order = demoOrders.find((o) => o.id === id) || demoOrders[0];
  const [commentState, setCommentState] = useState({}); // { product1: { content: "", rating: null }, productName2: {content, rating} }

  // Xử lý gửi bình luận
  function handleCommentSubmit(e, productName) {
    e.preventDefault(); // ngăn hành động mặc định
    if (
      !commentState[productName]?.content ||
      !commentState[productName]?.rating
    ) {
      alert("Vui lòng nhập nội dung và chọn số sao!");
      return;
    }

    setCommentState({
      ...commentState,
      [productName]: { content: "", rating: 0 },
    });
  }

  return (
    <div className="bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] min-h-screen w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link
          to="/lichsumuahang"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-6 font-semibold"
        >
          <FaArrowLeft /> Quay lại lịch sử đơn hàng
        </Link>
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h1 className="text-2xl font-bold text-[#00809D] mb-4">
            Chi Tiết Đơn Hàng #{order.id}
          </h1>
          <div className="mb-2 text-gray-700">
            Ngày đặt: <span className="font-semibold">{order.date}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Địa chỉ nhận hàng:{" "}
            <span className="font-semibold">{order.address}</span>
          </div>
          <div className="mb-2 text-gray-700">
            Trạng thái:{" "}
            <span
              className={
                order.status === "Đã giao hàng"
                  ? "text-green-600 font-bold"
                  : "text-yellow-600 font-bold"
              }
            >
              {order.status}
            </span>
          </div>
          <div className="mb-2 text-gray-700">
            Tổng tiền:{" "}
            <span className="font-bold text-[#00809D]">
              {order.total.toLocaleString()}đ
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#00809D] mb-4">
            Sản phẩm trong đơn hàng
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-black">
                <th className="py-2">Sản phẩm</th>
                <th className="py-2">Số lượng</th>
                <th className="py-2">Đơn giá</th>
                <th className="py-2">Tạm tính</th>
                <th className="py-2">Bình luận</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b text-black hover:bg-[#f5f7fa]"
                >
                  <td className="py-3 font-semibold text-[#00809D]">
                    {item.name}
                  </td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">{item.price.toLocaleString()}đ</td>
                  <td className="py-3">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>
                  <td className="py-3">
                    {/* Hiển thị bình luận nếu có
                    {comments
                      .filter((c) => c.product === item.name)
                      .map((c, i) => (
                        <div key={i} className="mb-2">
                          <span className="font-semibold text-[#00809D]">
                            {c.user}:
                          </span>{" "}
                          {c.content}{" "}
                          <span className="text-yellow-500">
                            {"★".repeat(c.rating)}
                          </span>
                        </div>
                      ))} */}
                    {/* Nếu đã giao hàng thì cho phép bình luận */}
                    {order.status === "Đã giao hàng" && (
                      <form
                        onSubmit={(e) => handleCommentSubmit(e, item.name)} // event
                        className="flex flex-col gap-2 mt-2"
                      >
                        <textarea
                          className="border rounded px-2 py-1"
                          rows={2}
                          placeholder="Viết nhận xét về sản phẩm..."
                          value={commentState[item.name]?.content || ""} // commentState["productName1"] = { content: "", rating: 0 }
                          onChange={(e) =>
                            setCommentState({
                              ...commentState,
                              [item.name]: {
                                ...commentState[item.name],
                                content: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <span>Đánh giá:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              className={
                                "text-xl " +
                                ((commentState[item.name]?.rating || 0) >= star // commentState["Harry Potter và Hòn Đá Phù Thủy"].rating >= 2
                                  ? "text-yellow-500"
                                  : "text-gray-400")
                              }
                              onClick={() =>
                                setCommentState({
                                  ...commentState,
                                  [item.name]: {
                                    ...commentState[item.name], // giữ lại content bằng cách sử dụng toán tử lan (spread operator)
                                    rating: star, // 1,2,3
                                  },
                                })
                              }
                            >
                              ★
                            </button>
                          ))}
                          <button
                            type="submit"
                            className="ml-4 bg-[#00809D] text-white px-3 py-1 rounded font-bold hover:bg-[#006b85] transition"
                          >
                            Gửi
                          </button>
                        </div>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {order.status === "Đã giao hàng" && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 rounded p-4 mb-8">
            <FaCheckCircle className="text-2xl" />
            <span>
              Bạn có thể đánh giá sản phẩm đã mua. Cảm ơn bạn đã tin tưởng
              BookStore!
            </span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ChiTietDonHang;
