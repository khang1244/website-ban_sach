import React, { useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaLock,
  FaCcPaypal,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  capNhatSoLuongSanPham,
  layGioHangTheoNguoiDung,
  xoaSanPhamKhoiGioHang,
} from "../lib/gio-hang-apis";
import { ImCreditCard } from "react-icons/im";
import { nhanMaKhuyenMaiTheoID } from "../lib/khuyenmai-apis";
import { layTatCaPhuongThucGiaoHang } from "../lib/phuong-thuc-giao-hang-apis";

const PAYMENT_METHODS = [
  // Phương thức thanh toán
  {
    label: "PayPal",
    value: "paypal",
    icon: <FaCcPaypal className="text-xl" />,
  },
  {
    label: "Thanh toán khi nhận hàng (COD)",
    value: "cod",
    icon: <FaCheckCircle className="text-xl" />,
  },
];

function ThanhToan() {
  // Ref để lưu timeout ID cho debouncing
  const timeoutRef = useRef(null);

  // Giữ nguyên logic/state
  const [cart, setCart] = useState([]);
  // Thông tin khách hàng
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  // Mã giảm giá
  const [coupon, setCoupon] = useState(""); //Lưu mã giảm giá
  // Giảm giá
  const [discount, setDiscount] = useState(0); //Lưu giá trị giảm giá
  // Đồng ý với điều khoản
  const [agreed, setAgreed] = useState(false); //Lưu trạng thái đồng ý với điều khoản
  // Biến trạng thái để lưu giá trị tổng tiền
  const [tongTien, setTongTien] = useState(0);
  // Biến trạng thái để lưu trữ danh sách phương thức giao hàng từ server
  const [shippingMethods, setShippingMethods] = useState([]);

  // Biến trạng thái để lưu trữ phí vận chuyển
  const [phiVanChuyen] = useState(0);
  // Điều hướng
  const router = useNavigate();

  // Thông tin giao hàng
  const [shipping, setShipping] = useState({
    tinhThanhPho: "",
    quanHuyen: "",
    xaPhuong: "",
    diaChiCuThe: "",
    phuongThucGiaoHang: "", // standard
  });
  const [payment, setPayment] = useState({
    method: PAYMENT_METHODS[0].value,
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // Hàm tăng/giảm số lượng sản phẩm với debouncing
  function updateQuantity(index, delta) {
    // Cập nhật số lượng trên UI trước (immediate update)
    const newCart = [...cart];
    newCart[index].soLuong = Math.max(1, newCart[index].soLuong + delta);
    setCart(newCart);

    // Cập nhật tổng tiền
    const newTotal = newCart.reduce(
      (total, item) => total + item.giaLucThem * item.soLuong,
      0
    );
    setTongTien(newTotal);

    // Clear timeout trước đó nếu có (debouncing)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Tạo timeout mới để gọi API sau 500ms khi người dùng ngừng thay đổi
    timeoutRef.current = setTimeout(async () => {
      const chiTietGioHangID = newCart[index].chiTietGioHangID;
      const soLuong = newCart[index].soLuong;

      try {
        await capNhatSoLuongSanPham(chiTietGioHangID, soLuong);
        console.log("Đã cập nhật số lượng trên server:", soLuong);
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
        // Có thể hiển thị thông báo lỗi cho user
      }
    }, 500); // Đợi 500ms sau khi user ngừng thay đổi
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  async function removeItem(index) {
    // Cập nhật trên UI trước
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);

    // Cập nhật tổng tiền
    const newTotal = newCart.reduce(
      (total, item) => total + item.giaLucThem * item.soLuong,
      0
    );
    setTongTien(newTotal);

    // Gọi API để xóa sản phẩm khỏi giỏ hàng trên server
    const chiTietGioHangID = cart[index].chiTietGioHangID;
    await xoaSanPhamKhoiGioHang(chiTietGioHangID);
  }

  const total = tongTien - discount + phiVanChuyen; // Tổng cộng cuối cùng
  const total1 = tongTien - discount; // dùng để kiểm tra điều kiện áp dụng mã giảm giá không cộng phí vận chuyển
  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };
  const estimatedDate = () => {
    const now = new Date();
    // Tìm phương thức giao hàng đã chọn
    const method = shippingMethods.find(
      (m) => m.phuongThucGiaoHangID === parseInt(shipping.phuongThucGiaoHang)
    );

    // Tính toán ngày giao hàng dự kiến
    if (!method) return "Chưa chọn phương thức giao hàng";

    now.setDate(now.getDate() + method.thoiGianGiaoHang);

    return now.toLocaleDateString(); // 10/02/2025
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Bạn cần đồng ý với Điều khoản & Chính sách đổi trả!");
      return;
    }
    alert("Đặt hàng thành công! Cảm ơn bạn đã mua sách tại BookStore.");
    router("/xacnhandonhang");
  };
  // Nạp dữ liệu giỏ hàng từ sever sử dụng useEffect
  useEffect(() => {
    const napDuLieuGioHang = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const data = await layGioHangTheoNguoiDung(user.nguoiDungID);
      if (data && data.success) {
        setCart(data.gioHang.ChiTietGioHangs || []);
        setTongTien(data.gioHang.tongTien || 0);
        console.log("Dữ liệu giỏ hàng từ server:", data);
      }
    };
    napDuLieuGioHang();
  }, []);

  // Khởi tạo giá trị ban đầu cho thông tin người dùng
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Kiểm tra xem có dữ liệu user trong localStorage không
      const duLieuNguoiDung = JSON.parse(storedUser); // Chuyển dữ liệu người từ localStorage sang dạng Object để sử dụng
      setCustomer({
        name: duLieuNguoiDung.tenNguoiDung || "",
        email: duLieuNguoiDung.email || "",
        phone: duLieuNguoiDung.soDienThoai || "",
      });
    }
  }, []);
  // Nạp danh sách phương thức giao hàng từ server
  useEffect(() => {
    const napPhuongThucGiaoHang = async () => {
      // Giả sử gọi API để lấy danh sách phương thức giao hàng
      const response = await layTatCaPhuongThucGiaoHang();
      if (response && response.success) {
        console.log("Danh sách phương thức giao hàng:", response.data);

        setShippingMethods(response.data);
      }
    };
    napPhuongThucGiaoHang();
  }, []);
  // Hàm kiểm tra và áp dụng mã giảm giá
  const hamKiemTraMaGiamGia = async () => {
    const response = await nhanMaKhuyenMaiTheoID(coupon); // response = { success: true/false, khuyenMai: { ... } }
    console.log("Phản hồi từ server về mã giảm giá:", response);
    if (response && response.success) {
      // Kiểm tra mã khuyến mãi còn hạn không
      if (!response.khuyenMai.ngayHetHan) {
        alert("Mã giảm giá đã hết hạn sử dụng!");
        return;
      }
      // Kiểm tra xem với giá trị đơn hiện tại có thể sử dụng được không
      if (total1 < response.khuyenMai.giaCoBan) {
        alert("Đơn hàng của bạn chưa đủ điều kiện để sử dụng mã giảm giá này!");
        return;
      }

      // Kiểm tra xem số lượng còn lại của mã khuyến mãi có đủ sử dụng không
      if (response.khuyenMai.soLuong <= 0) {
        alert("Mã giảm giá đã hết số lượng sử dụng!");
        return;
      }
      // Nếu tất cả điều kiện đều thỏa mãn, áp dụng mã giảm giá
      const phanTramGiamGia = response.khuyenMai.giaTriGiam || 0;
      const soTienDuocGiam = Math.round(tongTien * (phanTramGiamGia / 100));
      setDiscount(soTienDuocGiam);
      alert("Áp dụng mã giảm giá thành công!");
    } else {
      alert("Mã giảm giá không hợp lệ!");
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#f7f9fc]">
      <Navigation />

      {/* Banner + Progress */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 py-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#00809D] to-[#00b4d8] text-white shadow">
              <ImCreditCard className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0b3b4c]">
                Thanh toán
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Hoàn thành thông tin để đặt hàng nhanh chóng và an toàn.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-2 rounded-full bg-[#e8f1f8] mb-6">
            <div
              className="absolute h-2 rounded-full bg-gradient-to-r from-[#00809D] to-[#00b4d8]"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <form
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12"
        onSubmit={placeOrder}
      >
        {/* Cột trái */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Thông tin khách hàng */}
          <section className="bg-white rounded-2xl shadow-sm border-4 border-[#e6eef6] ">
            <div className="px-6 py-5 border-b border-[#e6eef6] flex items-center gap-2">
              <FaUserIcon />
              <h2 className="text-lg md:text-xl font-semibold text-[#0b3b4c]">
                Thông tin khách hàng
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-black">
              <input
                required
                className="border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Họ và tên"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                required
                type="email"
                className="border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Email"
                value={customer.email}
                disabled // vô hiệu hóa không cho người dùng chỉnh email
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />
              <input
                required
                className="md:col-span-2 border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Số điện thoại"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
            </div>
          </section>

          {/* Card: Thông tin giao hàng */}
          <section className="bg-white rounded-2xl shadow-sm border-4 border-[#e6eef6]">
            <div className="px-6 py-5 border-b border-[#e6eef6] flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#00809D]" />
              <h2 className="text-lg md:text-xl font-semibold text-[#0b3b4c]">
                Thông tin giao hàng
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-black">
              <input
                required
                className="border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Tỉnh / Thành phố"
                value={shipping.tinhThanhPho}
                onChange={(e) =>
                  setShipping({ ...shipping, tinhThanhPho: e.target.value })
                }
              />
              <input
                required
                className="border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Quận / Huyện"
                value={shipping.quanHuyen}
                onChange={(e) =>
                  setShipping({ ...shipping, quanHuyen: e.target.value })
                }
              />
              <input
                required
                className="border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Xã / Phường"
                value={shipping.xaPhuong}
                onChange={(e) =>
                  setShipping({ ...shipping, xaPhuong: e.target.value })
                }
              />
              <input
                required
                className="border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Địa chỉ cụ thể"
                value={shipping.diaChiCuThe}
                onChange={(e) =>
                  setShipping({ ...shipping, diaChiCuThe: e.target.value })
                }
              />
            </div>

            {/* Radio chip: phương thức giao hàng */}
            <div className="px-6 pb-6">
              <div className="text-sm font-medium text-[#0b3b4c] mb-3">
                Phương thức giao hàng
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shippingMethods.length > 0 &&
                  shippingMethods.map((m) => {
                    const active =
                      shipping.phuongThucGiaoHang === m.phuongThucGiaoHangID;
                    return (
                      <label
                        key={m.phuongThucGiaoHangID}
                        className={`cursor-pointer rounded-xl border px-4 py-3 text-sm flex flex-col gap-0.5 transition
                      ${
                        active
                          ? "border-[#00a2c7] bg-[#f0fbff] shadow-sm"
                          : "border-[#cfdef3] bg-white hover:bg-[#f7fbff]"
                      }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            value={m.phuongThucGiaoHangID}
                            className="accent-[#00809D]"
                            onChange={() =>
                              setShipping({
                                ...shipping,
                                phuongThucGiaoHang: m.value,
                              })
                            }
                          />
                          <span className="font-semibold text-[#0b3b4c] leading-tight">
                            {m.tenPhuongThuc}
                          </span>
                        </div>
                        <span
                          className={`text-xs ${
                            m.phiGiaoHang === 0
                              ? "text-green-700"
                              : "text-gray-600"
                          }`}
                        >
                          {m.phiGiaoHang === 0
                            ? "Miễn phí"
                            : `Phí +${m.phiGiaoHang.toLocaleString()}đ`}
                        </span>
                      </label>
                    );
                  })}
              </div>
              {phiVanChuyen === 0 && (
                <div className="mt-2 text-xs text-green-700 font-medium">
                  Miễn phí vận chuyển cho lựa chọn hiện tại.
                </div>
              )}
            </div>
          </section>

          {/* Card: Thanh toán */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e6eef6]">
            <div className="px-6 py-5 border-b border-[#e6eef6] flex items-center gap-2">
              <FaLock className="text-[#00809D]" />
              <h2 className="text-lg md:text-xl font-semibold text-[#0b3b4c]">
                Thông tin thanh toán
              </h2>
            </div>

            {/* Card chọn phương thức */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((m) => {
                const active = payment.method === m.value;
                return (
                  <label
                    key={m.value}
                    className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition
                    ${
                      active
                        ? "border-[#00a2c7] bg-[#f0fbff] shadow-sm"
                        : "border-[#cfdef3] hover:bg-[#f7fbff]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="accent-[#00809D]"
                      checked={active}
                      onChange={() =>
                        setPayment({ ...payment, method: m.value })
                      }
                    />
                    <div className="flex items-center gap-3">
                      <div className="text-[#00809D]">{m.icon}</div>
                      <div className="text-sm font-medium text-[#0b3b4c]">
                        {m.label}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Card: Mã giảm giá */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e6eef6]">
            <div className="px-6 py-5 border-b border-[#e6eef6]">
              <h2 className="text-lg md:text-xl font-semibold text-[#0b3b4c]">
                Ưu đãi & Khuyến mãi
              </h2>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-3">
              <input
                className="text-black flex-1 border border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                placeholder="Nhập mã giảm giá (ví dụ: SALE10)"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                type="button"
                onClick={hamKiemTraMaGiamGia}
                className="whitespace-nowrap px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#00809D] to-[#00b4d8] text-white shadow hover:from-[#006f86] hover:to-[#0096c7] transition"
              >
                Áp dụng
              </button>
            </div>
            {discount > 0 && (
              <div className="px-6 pb-6 text-green-700 text-sm font-medium">
                Đã áp dụng giảm giá: -{discount.toLocaleString()}đ
              </div>
            )}
          </section>
        </div>

        {/* Cột phải: Sticky summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Đơn hàng của bạn */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e6eef6] sticky top-6">
            <div className="px-6 py-5 border-b border-[#e6eef6]">
              <h2 className="text-lg md:text-xl font-semibold text-[#0b3b4c]">
                🛒 Đơn hàng của bạn
              </h2>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-[#eef5fb]">
                {cart &&
                  cart.length > 0 &&
                  cart.map((item, idx) => (
                    <li key={idx} className="flex gap-4 py-4 items-center">
                      <img
                        src={
                          item.Sach?.images
                            ? JSON.parse(item.Sach.images)[0].url
                            : ""
                        }
                        alt={item.Sach?.tenSach}
                        className="w-16 h-24 object-cover rounded-lg border border-[#e9f1f8] shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-[#0b3b4c]">
                          {item.Sach?.tenSach || "Tên sách"}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            className="p-1 bg-white rounded-full border border-[#cfdef3] hover:bg-[#f3f9fd] transition text-black"
                            onClick={() => updateQuantity(idx, -1)}
                            aria-label="Giảm số lượng"
                          >
                            <FaMinus />
                          </button>
                          <span className="px-3 font-bold text-[#0b3b4c]">
                            {item.soLuong}
                          </span>
                          <button
                            type="button"
                            className="p-1 bg-white rounded-full border border-[#cfdef3] hover:bg-[#f3f9fd] transition text-black"
                            onClick={() => updateQuantity(idx, 1)}
                            aria-label="Tăng số lượng"
                          >
                            <FaPlus />
                          </button>
                          <button
                            type="button"
                            className="ml-3 text-red-500 hover:text-red-600 transition"
                            onClick={() => removeItem(idx)}
                            aria-label="Xóa sản phẩm"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#00809D]">
                          {item.giaLucThem.toLocaleString()}đ
                        </div>
                        <div className="text-gray-500 text-xs">
                          Tổng giá:{" "}
                          {formatCurrency(item.giaLucThem * item.soLuong)}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>

              <Link
                to="/"
                className="text-blue-600 hover:underline mt-4 inline-block font-medium"
              >
                &larr; Tiếp tục mua sắm
              </Link>
            </div>

            {/* Chi tiết thanh toán */}
            <div className="px-6 py-5 border-t border-[#e6eef6]">
              <h3 className="text-base font-semibold text-[#0b3b4c] mb-3">
                📊 Chi tiết thanh toán
              </h3>
              <div className="space-y-2 text-sm text-black">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{tongTien.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span className="text-green-700">
                    -{discount.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {phiVanChuyen === 0
                      ? "Miễn phí"
                      : `+${phiVanChuyen.toLocaleString()}đ`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <span className="font-bold text-[#0b3b4c]">Tổng cộng</span>
                <span className="text-xl font-extrabold text-[#00809D]">
                  {total.toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Xác nhận cuối */}
            <div className="px-6 pb-6 flex flex-col gap-4">
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="accent-[#00809D] w-5 h-5"
                />
                <span>
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-blue-600 underline">
                    Điều khoản & Chính sách đổi trả
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreed}
                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00809D] to-[#00b4d8] shadow hover:from-[#006f86] hover:to-[#0096c7] transition disabled:opacity-60"
              >
                Đặt hàng
              </button>

              <div className="text-gray-600 text-sm">
                Dự kiến giao hàng:{" "}
                <span className="font-semibold text-[#00809D]">
                  {estimatedDate()}
                </span>
              </div>
            </div>
          </section>
        </div>
      </form>

      <Footer />
    </div>
  );
}

// Icon for "user info" tiêu chuẩn, giữ nguyên như bạn có
function FaUserIcon() {
  return (
    <svg
      className="inline-block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00809D"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
    </svg>
  );
}

export default ThanhToan;
