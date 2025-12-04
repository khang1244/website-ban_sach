import React, { useState, useContext } from "react";
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
import { TbTruckDelivery } from "react-icons/tb";
import { useEffect, useRef } from "react";
import { UserContext } from "../contexts/user-context";
import {
  capNhatSoLuongSanPham,
  layGioHangTheoNguoiDung,
  xoaSanPhamKhoiGioHang,
  xoaToanBoGioHang,
} from "../lib/gio-hang-apis";
import { ImCreditCard } from "react-icons/im";
import { nhanMaKhuyenMaiTheoID } from "../lib/khuyenmai-apis";
import { layTatCaPhuongThucGiaoHang } from "../lib/phuong-thuc-giao-hang-apis";
import tinhTP from "../lib/du-Lieu-TinhTP";
import { nhanDanhSachXaPhuong } from "../lib/dia-chi-apis";
import {
  layDiaChiTheoNguoiDung,
  taoDiaChi,
  xoaDiaChi,
  datMacDinhDiaChi,
} from "../lib/dia-chi-apis";
import { taoDonHangMoi } from "../lib/don-hang-apis";
import PayPalButton from "./PaypalButton";
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
  const [cart, setCart] = useState([]); // Giỏ hàng
  const [tongTien, setTongTien] = useState(0);
  const [discount, setDiscount] = useState(0); // Số tiền được giảm
  const [coupon, setCoupon] = useState(""); // Mã giảm giá
  const [wards, setWards] = useState([]); // Danh sách xã/phường
  const [shippingMethods, setShippingMethods] = useState([]); // Phương thức giao hàng
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" }); // Thông tin khách hàng
  const [agreed, setAgreed] = useState(false); // Đồng ý điều khoản
  // Thông tin giao hàng
  const [shipping, setShipping] = useState({
    tinhThanhPho: "",
    xaPhuong: "",
    diaChiCuThe: "",
    phuongThucGiaoHang: "",
  });
  const [diaChiDaLuu, setDiaChiDaLuu] = useState([]); // Danh sách địa chỉ đã lưu
  const [diaChiDuocChonId, setDiaChiDuocChonId] = useState(null); // ID địa chỉ được chọn
  // Hiển thị/ẩn form nhập địa chỉ mới. Mặc định ẩn nếu đã có địa chỉ lưu
  const [hienFormDiaChi, setHienFormDiaChi] = useState(true);
  // Hiện/ẩn danh sách địa chỉ đã lưu (collapsed by default)
  const [hienDanhSachDiaChi, setHienDanhSachDiaChi] = useState(false);
  const [note, setNote] = useState(""); // Ghi chú đơn hàng

  // Điều hướng
  const router = useNavigate(); // Sử dụng useNavigate điều hướng trang

  const [payment, setPayment] = useState({
    method: PAYMENT_METHODS[0].value,
  });

  // User context để cập nhật lại số lượng giỏ hàng toàn cục
  const { refreshCartCount } = useContext(UserContext);

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
  // Tính phí vận chuyển dựa trên phương thức giao hàng đã chọn
  const phiPhuongThucGiaoHang =
    shippingMethods.find(
      (m) => m.phuongThucGiaoHangID === parseInt(shipping.phuongThucGiaoHang)
    )?.phiGiaoHang || 0;

  const total = tongTien - discount + phiPhuongThucGiaoHang; // Tổng cộng cuối cùng
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

    return now.toLocaleDateString();
  };

  const datHang = async (e) => {
    if (e) {
      e.preventDefault();
    } // Ngăn chặn hành vi mặc định của form (tải lại trang)

    // Kiểm tra người dùng chọn phương thức giao hàng chưa
    if (!shipping.phuongThucGiaoHang) {
      alert("Vui lòng chọn phương thức giao hàng!");
      return;
    }
    // Kiểm tra giỏ hàng có trống không
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    // Lấy dữ liệu người dùng từ localStorage để chuẩn bị dữ liệu đẩy lên sever
    const khachHang = JSON.parse(localStorage.getItem("user"));

    // Chuẩn bị dữ liệu để tạo đơn hàng gửi lên sever
    const duLieuDonHang = {
      nguoiDungID: khachHang.nguoiDungID,
      tenKhachHang: customer.name,
      soDienThoaiKH: customer.phone,
      ngayDat: new Date(),
      tongTien: total,
      trangThai: "Chờ xác nhận",
      //  Xây dựng chuỗi địa chỉ giao hàng
      diaChiGiaoHang: (function () {
        if (diaChiDuocChonId) {
          const addr = diaChiDaLuu.find((a) => a.diaChiID === diaChiDuocChonId);
          return addr?.diaChi || shipping.diaChiCuThe;
        }
        return `${shipping.diaChiCuThe}, ${
          wards.find((w) => w.code == parseInt(shipping.xaPhuong))?.name || ""
        }, ${tinhTP.find((t) => t.code == shipping.tinhThanhPho)?.name || ""}`;
      })(),
      phuongThucThanhToan: payment.method,
      phuongThucGiaoHangID: shipping.phuongThucGiaoHang,
      ghiChu: note,
      items: cart.map((item) => ({
        sachID: item.sachID,
        soLuong: item.soLuong,
        donGia: item.giaLucThem,
      })),
      // Gửi thông tin mã giảm giá (nếu có) để backend xử lý và trừ số lượng
      khuyenMaiID: coupon || null,
      tienGiam: discount || 0,
      tongTienBanDau: tongTien || total || 0,
    };

    console.log(duLieuDonHang);

    // Gọi API để tạo đơn hàng (sử dụng hàm có sẵn bên lib/don-hang-apis.js)
    const response = await taoDonHangMoi(duLieuDonHang);
    if (response && response.success) {
      // Sau khi tạo đơn hàng thành công -> xóa toàn bộ giỏ hàng của người dùng
      try {
        const khachHang = JSON.parse(localStorage.getItem("user"));
        if (khachHang && khachHang.nguoiDungID) {
          await xoaToanBoGioHang(khachHang.nguoiDungID);
        }
      } catch (err) {
        console.error("Lỗi khi xóa giỏ hàng sau khi đặt hàng:", err);
        // Không chặn flow đặt hàng nếu xóa giỏ hàng thất bại
      }
      // Cập nhật UI local
      setCart([]);
      setTongTien(0);
      // Cập nhật số lượng giỏ hàng ở thanh điều hướng
      if (typeof refreshCartCount === "function") refreshCartCount();

      alert("Đặt hàng thành công!");
      router("/xacnhandonhang");
    } else {
      alert("Đặt hàng thất bại!");
    }
  };
  // Chuyển đến trang xác nhận đơn hàng
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
      // Nạp danh sách địa chỉ đã lưu của người dùng
      (async () => {
        try {
          const list = await layDiaChiTheoNguoiDung(
            duLieuNguoiDung.nguoiDungID
          );
          setDiaChiDaLuu(list || []);
          // Nếu đã có địa chỉ lưu, ẩn form nhập địa chỉ mới; ngược lại hiện
          setHienFormDiaChi((list || []).length === 0);
          const def = (list || []).find((a) => a.macDinh);
          if (def) {
            setDiaChiDuocChonId(def.diaChiID);
            setShipping((s) => ({ ...s, diaChiCuThe: def.diaChi }));
          }
        } catch (err) {
          console.error("Lỗi khi load địa chỉ người dùng:", err);
        }
      })();
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

  // Cập nhật lại danh sách xã phường khi thay đổi tỉnh/thành phố
  useEffect(() => {
    const duLieuXaPhuong = nhanDanhSachXaPhuong(shipping.tinhThanhPho);
    setWards(duLieuXaPhuong);
    console.log("Hàm tính toán lại xã phường đã chạy lại");
  }, [shipping.tinhThanhPho]);

  // Hàm xây dựng chuỗi địa chỉ đầy đủ từ các trường nhập liệu
  const xayDungChuoiDiaChi = () => {
    const wardName =
      wards.find((w) => w.code == parseInt(shipping.xaPhuong))?.name || "";
    const provinceName =
      tinhTP.find((t) => t.code == shipping.tinhThanhPho)?.name || "";
    return `${shipping.diaChiCuThe}${wardName ? ", " + wardName : ""}${
      provinceName ? ", " + provinceName : ""
    }`;
  };

  // Hàm lưu địa chỉ hiện tại vào danh sách địa chỉ đã lưu
  const luuDiaChiHienTai = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return alert("Vui lòng đăng nhập để lưu địa chỉ.");
      const diaChiFull = xayDungChuoiDiaChi();
      if (!diaChiFull || diaChiFull.trim().length === 0)
        return alert("Vui lòng nhập địa chỉ trước khi lưu.");
      const res = await taoDiaChi({
        nguoiDungID: storedUser.nguoiDungID,
        diaChi: diaChiFull,
        macDinh: diaChiDaLuu.length === 0,
      });
      if (res && res.ok) {
        const list = await layDiaChiTheoNguoiDung(storedUser.nguoiDungID);
        setDiaChiDaLuu(list || []);
        const created = res.address;
        if (created) {
          setDiaChiDuocChonId(created.diaChiID);
          setShipping((s) => ({ ...s, diaChiCuThe: created.diaChi }));
          // Sau khi lưu thành công, ẩn form nhập địa chỉ để tránh chiếm chỗ
          setHienFormDiaChi(false);
        }
        alert("Đã lưu địa chỉ thành công");
      } else {
        alert("Lưu địa chỉ thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu địa chỉ");
    }
  };

  // Hàm tải lại danh sách địa chỉ đã lưu (dùng sau khi tạo/cập nhật/xóa)
  const taiLaiDiaChiDaLuu = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;
      const list = await layDiaChiTheoNguoiDung(storedUser.nguoiDungID);
      setDiaChiDaLuu(list || []);
      const def = (list || []).find((a) => a.macDinh);
      if (def) {
        setDiaChiDuocChonId(def.diaChiID);
        setShipping((s) => ({ ...s, diaChiCuThe: def.diaChi }));
      }
    } catch (err) {
      console.error("Lỗi khi tải lại địa chỉ:", err);
    }
  };
  // Xóa địa chỉ
  const xoaDiaChiDaLuu = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      await xoaDiaChi(id);
      if (diaChiDuocChonId === id) {
        setDiaChiDuocChonId(null);
        setShipping((s) => ({ ...s, diaChiCuThe: "" }));
      }
      await taiLaiDiaChiDaLuu();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa địa chỉ");
    }
  };

  // Đặt mặc định
  const datMacDinhDiaChiLocal = async (diaChiID) => {
    try {
      await datMacDinhDiaChi(diaChiID);
      await taiLaiDiaChiDaLuu();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đặt mặc định");
    }
  };

  // Hàm kiểm tra và áp dụng mã giảm giá
  const hamKiemTraMaGiamGia = async () => {
    const response = await nhanMaKhuyenMaiTheoID(coupon); // response = { success: true/false, khuyenMai: { ... } }
    console.log("Phản hồi từ server về mã giảm giá:", response);
    if (response && response.success) {
      // Kiểm tra mã khuyến mãi còn hạn (so sánh ngày đến cuối ngày)
      const expiry = new Date(response.khuyenMai.ngayHetHan);
      if (isNaN(expiry.getTime())) {
        alert("Mã giảm giá không hợp lệ");
        return;
      }
      const expiryEnd = new Date(expiry);
      expiryEnd.setHours(23, 59, 59, 999);
      if (new Date() > expiryEnd) {
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
        onSubmit={datHang}
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
              {(hienFormDiaChi || !diaChiDaLuu || diaChiDaLuu.length === 0) && (
                <>
                  <select
                    required={!diaChiDuocChonId}
                    className="border-2 border-[#cfdef3] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00809D] transition"
                    value={shipping.tinhThanhPho}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        tinhThanhPho: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {tinhTP.map((tp) => (
                      <option key={tp.code} value={tp.code}>
                        {tp.name}
                      </option>
                    ))}
                  </select>

                  <select
                    required={!diaChiDuocChonId}
                    className="border-2 border-[#cfdef3] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00809D] transition"
                    value={shipping.xaPhuong}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        xaPhuong: e.target.value,
                      })
                    }
                    disabled={wards.length === 0}
                  >
                    <option value="">
                      {wards.length === 0
                        ? "-- Chọn tỉnh/thành trước --"
                        : "-- Chọn quận/huyện --"}
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  <input
                    required={!diaChiDuocChonId}
                    className="border w-191 border-[#cfdef3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00a2c7] bg-[#fbfdff]"
                    placeholder="Địa chỉ cụ thể"
                    value={shipping.diaChiCuThe}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        diaChiCuThe: e.target.value,
                      })
                    }
                  />
                  {/* nút lưu lại địa chỉ hiện tại (sử dụng các ô trên) */}
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={luuDiaChiHienTai}
                      className="mt-2 bg-amber-600 text-white px-3 py-2 rounded-md text-sm"
                    >
                      Lưu địa chỉ hiện tại
                    </button>
                    {diaChiDaLuu && diaChiDaLuu.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setHienFormDiaChi(false)}
                        className="mt-2 ml-3 text-sm text-black  bg-amber-300 rounded-2xl p-2 border-2 border-amber-200 hover:border-amber-400 transition no-underline"
                      >
                        Ẩn form
                      </button>
                    )}
                  </div>
                </>
              )}
              {/* Saved addresses selection */}
              {diaChiDaLuu && diaChiDaLuu.length > 0 && (
                <div className="md:col-span-2 mb-4">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <div className="text-lg font-bold text-gray-800">
                      Địa chỉ đã lưu
                    </div>
                    <button
                      type="button"
                      onClick={() => setHienDanhSachDiaChi((s) => !s)}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.02]"
                    >
                      {/* Thêm biểu tượng để tăng tính trực quan */}
                      {hienDanhSachDiaChi ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Đóng quản lý
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.55 4.55L15 19m-6-9l-4.55 4.55L9 19m10-4.55a4.5 4.5 0 00-9 0m-6 0a4.5 4.5 0 00-9 0"
                            />
                          </svg>
                          Quản lý địa chỉ
                        </>
                      )}
                    </button>
                  </div>

                  {/* // Hiển thị địa chỉ được chọn khi danh sách địa chỉ đang thu gọn */}
                  <div className="p-3 bg-white border rounded-lg shadow-sm mb-3 flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="p-2 bg-[#f0f9ff] text-[#00809D] rounded-full">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {
                            (
                              diaChiDaLuu.find(
                                (a) => a.diaChiID === diaChiDuocChonId
                              ) || diaChiDaLuu[0]
                            ).diaChi
                          }
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {diaChiDaLuu.find(
                            (a) => a.diaChiID === diaChiDuocChonId
                          )?.macDinh
                            ? "Mặc định"
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2"></div>
                  </div>

                  {/* Nút mở form khi đã có địa chỉ lưu */}
                  <button
                    type="button"
                    onClick={() => {
                      setHienFormDiaChi(true); // Mở form nhập
                      setDiaChiDuocChonId(null); // Bỏ chọn địa chỉ đã lưu
                      setShipping((s) => ({
                        ...s,
                        diaChiCuThe: "", // QUAN TRỌNG: reset địa chỉ cụ thể
                      }));
                    }}
                    className=" mb-4 flex items-center text-indigo-600 font-semibold text-sm transition-colors hover:text-indigo-800 border-2 border-indigo-200 hover:border-indigo-400 rounded-full px-4 py-2 shadow-sm"
                  >
                    {/* icon + text */}
                    Thêm địa chỉ mới
                  </button>

                  {/* Full list (expanded) */}
                  {hienDanhSachDiaChi && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {diaChiDaLuu.map((a) => (
                        <div
                          key={a.diaChiID}
                          className="p-4 bg-white border rounded-xl shadow-md flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="savedAddress"
                                checked={diaChiDuocChonId === a.diaChiID}
                                onChange={() => {
                                  setDiaChiDuocChonId(a.diaChiID);
                                  setShipping((s) => ({
                                    ...s,
                                    diaChiCuThe: a.diaChi,
                                  }));
                                }}
                                className="accent-[#00809D] mt-1"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {a.diaChi}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  {a.ghiChu || ""}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setDiaChiDuocChonId(a.diaChiID);
                                  setShipping((s) => ({
                                    ...s,
                                    diaChiCuThe: a.diaChi,
                                  }));
                                  setHienDanhSachDiaChi(false);
                                }}
                                className="text-sm px-3 py-1 bg-[#00809D] text-white rounded flex items-center gap-2"
                              >
                                Sử dụng
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              {!a.macDinh ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    datMacDinhDiaChiLocal(a.diaChiID)
                                  }
                                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
                                >
                                  Đặt mặc định
                                </button>
                              ) : (
                                <div className="text-xs text-green-700 flex items-center gap-1">
                                  <FaCheckCircle /> Mặc định
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => xoaDiaChiDaLuu(a.diaChiID)}
                                className="text-sm px-3 py-1 border rounded text-red-600"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Inline add address form */}
            </div>

            {/* Radio chip: phương thức giao hàng */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 text-lg font-medium text-[#0b3b4c] mb-3">
                <TbTruckDelivery />
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
                                phuongThucGiaoHang: m.phuongThucGiaoHangID,
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
                      value={m.value}
                      checked={payment.method === m.value}
                      onChange={() => setPayment({ method: m.value })}
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
              {/* Khung ghi chú đơn hàng */}
              <div className="mt-4 p-3 bg-[#f7fbff] border border-[#cfdef3] rounded-xl">
                <p className="text-sm font-semibold text-[#0b3b4c] mb-2">
                  Ghi chú cho đơn hàng
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full text-sm px-3 py-2 border border-[#cfdef3] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00a2c7] resize-none text-black"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao, gói quà giúp mình..."
                />
              </div>
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
                    {phiPhuongThucGiaoHang === 0
                      ? "Miễn phí"
                      : `+${phiPhuongThucGiaoHang.toLocaleString()}đ`}
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

              {/* Bắt đầu khối Điều kiện Thanh toán */}
              {payment.method === "paypal" ? (
                <PayPalButton
                  termIsAccepted={agreed}
                  // Hàm để gọi khi thanh toán thành công và cung cấp đối tượng event cho hàm đó
                  submitForm={datHang}
                  amount={total}
                />
              ) : (
                // Khối ELSE (Thanh toán COD/Thường) - Dùng Fragment để bao bọc 2 phần tử
                <>
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
                </> // <-- Kết thúc Fragment
              )}
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
