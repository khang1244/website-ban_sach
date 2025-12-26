import { useState, useEffect, useContext } from "react";
import Navigation from "./Navigation";
import {
  FaStar,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaEye,
  FaFire,
} from "react-icons/fa"; // import các icon cần thiết
import { RiShoppingCartLine } from "react-icons/ri"; // icon giỏ hàng
import { BsFire } from "react-icons/bs"; // icon sắp hết hàng
import { SlPlane } from "react-icons/sl"; // icon vận chuyển
import { MdWarning } from "react-icons/md"; // icon cảnh báo
import { Link } from "react-router-dom"; // import Link từ react-router-dom
import Footer from "./Footer"; // import Footer
import {
  layChiTietSach,
  tangLuotXem,
  nhanTatCaCacQuyenSach,
} from "../lib/sach-apis"; // import các API liên quan đến sách
import { layTonKhoTheoSach } from "../lib/phieu-nhap-apis"; // import API lấy tồn kho
import { nhanTatCaDanhMucSach } from "../lib/danh-muc-sach-apis"; // import API lấy danh mục sách
import { useParams } from "react-router-dom"; // import useParams để lấy tham số từ URL
import {
  layGioHangTheoNguoiDung,
  themSanPhamVaoGioHang,
} from "../lib/gio-hang-apis"; // import API thêm sản phẩm vào giỏ hàng
import { layBinhLuanTheoSachID } from "../lib/binh-luan-apis"; // import API lấy bình luận
import { UserContext } from "../contexts/user-context"; // import UserContext để sử dụng context người dùng
function ChiTietSanPham() {
  const [anhIndex, setAnhIndex] = useState(0);
  const [soLuong, setSoLuong] = useState(1);

  // Biến trạng thái để lưu trữ thông tin sản phẩm
  const [chiTietSanPham, setChiTietSanPham] = useState(null);
  const [tonKho, setTonKho] = useState(0); // Tồn kho từ hệ thống quản lý
  const [chuaNhapKho, setChuaNhapKho] = useState(false); // Chưa nhập kho?
  const [binhLuan, setBinhLuan] = useState([]);
  const [sachLienQuan, setSachLienQuan] = useState([]); // danh sách sách liên quan cùng danh mục
  const [showAllComments, setShowAllComments] = useState(false); // trạng thái hiển thị tất cả bình luận hay không
  const [tenDanhMuc, setTenDanhMuc] = useState("");

  // User context (dùng để cập nhật badge giỏ hàng)
  const { refreshCartCount } = useContext(UserContext);

  // Sử dụng useParam để lấy sachID
  const { sachID } = useParams();

  const giamSoLuong = () => {
    // variable scope
    if (soLuong > 1) {
      let soLuongMoi = soLuong - 1;
      setSoLuong(soLuongMoi);
    }
  };

  const tangSoLuong = () => {
    if (chuaNhapKho) {
      alert("Admin chưa nhập kho vui lòng quay lại sau. Xin cảm ơn");
      return;
    }
    if (tonKho <= 0) {
      alert("Sản phẩm đã hết hàng.");
      return;
    }

    if (soLuong >= tonKho) {
      alert(`Chỉ còn ${tonKho} cuốn trong kho, không thể tăng thêm.`);
      return;
    }

    const soLuongMoi = soLuong + 1;
    setSoLuong(soLuongMoi);
  };
  // Hàm để xử lý thêm sản phẩm vào giỏ hàng
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
      // Cập nhật lại số lượng sản phẩm (distinct) trong giỏ hàng ngay khi thêm thành công
      if (typeof refreshCartCount === "function") refreshCartCount();
    } else {
      alert(
        "Thêm sản phẩm vào giỏ hàng thất bại! " + (phanHoiTuSever.message || "")
      );
    }
  };
  // Sử dụng useEffect để nạp dữ liệu sản phẩm từ server dựa vào sachID
  useEffect(() => {
    const napChiTietSanPham = async () => {
      const chiTietSanPham = await layChiTietSach(sachID);

      if (chiTietSanPham) {
        // Đảm bảo images là mảng
        if (!Array.isArray(chiTietSanPham.images)) {
          chiTietSanPham.images = [];
        }

        console.log("Chi tiết sản phẩm từ server:", chiTietSanPham);

        setChiTietSanPham(chiTietSanPham);
      }
    };

    napChiTietSanPham();
  }, [sachID]);

  // Lấy tên danh mục theo danhMucSachID để hiển thị thay vì ID
  useEffect(() => {
    const danhMucID = chiTietSanPham?.danhMucSachID;
    (async () => {
      try {
        const data = await nhanTatCaDanhMucSach();
        if (!Array.isArray(data)) return;

        const found = data.find(
          (dm) => String(dm.danhMucSachID) === String(danhMucID)
        );
        setTenDanhMuc(found?.tenDanhMuc || "");
      } catch (error) {
        console.error("Lỗi khi lấy tên danh mục:", error);
        setTenDanhMuc("");
      }
    })();
  }, [chiTietSanPham?.danhMucSachID]);

  // Lấy tồn kho từ hệ thống quản lý và cập nhật stockStatus
  useEffect(() => {
    const napTonKho = async () => {
      if (!sachID) return;
      try {
        const data = await layTonKhoTheoSach(sachID);
        const newTonKho = data.tonKho || 0;
        setTonKho(newTonKho);
        setChuaNhapKho((data?.soLuongNhap ?? 0) === 0);

        // Cập nhật stockStatus ngay sau khi có tonKho
        const LOW_STOCK_THRESHOLD = 10;
        const newStatus =
          (data?.soLuongNhap ?? 0) === 0
            ? "not-imported"
            : newTonKho <= 0
            ? "out"
            : newTonKho < LOW_STOCK_THRESHOLD
            ? "low"
            : "available";

        setChiTietSanPham((prev) => {
          if (prev && prev.stockStatus !== newStatus) {
            return { ...prev, stockStatus: newStatus };
          }
          return prev;
        });
      } catch (error) {
        console.error("Lỗi khi lấy tồn kho:", error);
        setTonKho(0);
      }
    };

    napTonKho();
  }, [sachID]);

  // Gọi API tăng lượt xem có kiểm soát để tránh double-count (StrictMode remounts)
  useEffect(() => {
    if (!chiTietSanPham || !sachID) return;

    const key = `viewed_sach_${sachID}`;
    const last = localStorage.getItem(key);
    const now = Date.now();
    const TTL = 1 * 1000; // 1s: chặn tăng gấp đôi do StrictMode, mỗi lần vào trang thực sự vẫn tăng

    if (last && now - Number(last) < TTL) return; // đã được tính rất gần đây (ngăn double-count)

    const inc = async () => {
      try {
        // Đặt dấu thời gian để ngăn double-count trong TTL
        localStorage.setItem(key, String(now));

        const resp = await tangLuotXem(sachID);
        if (resp && resp.success) {
          // cập nhật state hiển thị ngay
          setChiTietSanPham((prev) => ({ ...prev, luotXem: resp.luotXem }));
        } else {
          // Nếu server thất bại, xóa dấu để lần sau có thể thử lại
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.error("Không thể tăng lượt xem từ frontend:", e);
        localStorage.removeItem(key);
      }
    };

    inc();
  }, [chiTietSanPham, sachID]);
  // Nạp bình luận dựa trên sachID (sử dụng API đã viết)
  useEffect(() => {
    const napBinhLuan = async () => {
      if (!sachID) return;
      try {
        const phanHoi = await layBinhLuanTheoSachID(sachID);
        if (phanHoi && phanHoi.success) {
          // Giả sử phanHoi.data là mảng bình luận
          setBinhLuan(phanHoi.data || []);
        } else {
          setBinhLuan([]);
        }
      } catch (error) {
        console.error("Lỗi khi nạp bình luận:", error);
        setBinhLuan([]);
      }
    };

    napBinhLuan();
  }, [sachID]);

  // Nạp sách liên quan: lấy tất cả sách rồi lọc theo danh mục (tránh thay đổi backend)
  useEffect(() => {
    const napSachLienQuan = async () => {
      if (!chiTietSanPham) return;
      try {
        const data = await nhanTatCaCacQuyenSach();
        if (!data) return;

        // Chuyển images từ chuỗi JSON sang mảng nếu cần
        const sachCungDanhMuc = data
          .map((s) => ({
            ...s,
            images:
              typeof s.images === "string"
                ? (() => {
                    try {
                      return JSON.parse(s.images);
                    } catch {
                      return [];
                    }
                  })()
                : Array.isArray(s.images)
                ? s.images
                : [],
          }))
          .filter(
            (s) =>
              String(s.danhMucSachID) ===
                String(chiTietSanPham.danhMucSachID) &&
              String(s.sachID) !== String(chiTietSanPham.sachID)
          )
          .slice(0, 6); // lấy tối đa 6 cuốn liên quan

        setSachLienQuan(sachCungDanhMuc);
      } catch (error) {
        console.error("Lỗi khi nạp sách liên quan:", error);
        setSachLienQuan([]);
      }
    };

    napSachLienQuan();
  }, [chiTietSanPham]);

  if (!chiTietSanPham) {
    return <div>Đang tải chi tiết sản phẩm...</div>;
  }
  // Hàm định dạng ngày tháng từ ISO sang dd/mm/yyyy
  const formatDate = (isoDate) => {
    if (!isoDate) return "";

    // 1. Tách chuỗi tại ký tự 'T' để loại bỏ phần giờ và múi giờ
    // Ví dụ: "2025-10-03T00:00:00.000Z" sẽ thành ["2025-10-03", "00:00:00.000Z"]
    const datePart = isoDate.split("T")[0];

    // 2. Tách phần ngày-tháng-năm (đã được làm sạch)
    const [year, month, day] = datePart.split("-");

    // 3. Trả về định dạng mong muốn
    return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
  };
  const maskEmail = (email) => {
    if (!email) return "Người dùng";
    const [name, domain] = email.split("@");

    if (name.length <= 3) {
      return name[0] + "***@" + domain;
    }

    return name.slice(0, 3) + "***@" + domain;
  };

  return (
    <div className=" min-h-screen w-full">
      <Navigation />
      {/* <h1 className="text-4xl font-bold text-center my-8">CHI TIẾT SẢN PHẨM</h1> */}

      <div className="max-w-6xl mx-auto mt-7 text-white py-1 text-2xl italic ml-38">
        Trang chủ / Chi tiết sản phẩm
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col items-center border p-4 rounded-xl shadow-lg h-full justify-center">
          <div className="w-[350px] h-[500px] rounded-xl overflow-hidden shadow-lg mb-4 bg-white flex items-center justify-center">
            <img
              src={chiTietSanPham.images[anhIndex].url}
              alt={chiTietSanPham.tenSP}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {chiTietSanPham.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={"Ảnh phụ " + (idx + 1)}
                className={`w-16 h-24 object-cover rounded cursor-pointer border-2 ${
                  anhIndex === idx ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => {
                  setAnhIndex(idx);
                }} // arrow function
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="bg-white rounded-xl shadow-lg p-7 border border-gray-100 h-full flex flex-col">
          {/* Tiêu đề & Badge */}
          <div className="mb-5">
            <h2 className="text-3xl font-bold text-[#00809D] mb-3 leading-tight">
              {chiTietSanPham.tenSach}
            </h2>
            {tonKho !== undefined && tonKho !== null && (
              <div>
                {chuaNhapKho ? (
                  <span className="inline-flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    <MdWarning /> Chưa nhập kho
                  </span>
                ) : tonKho <= 0 ? (
                  <span className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    <MdWarning /> Hết hàng
                  </span>
                ) : tonKho < 10 ? (
                  <span className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    <BsFire /> Sắp hết ({tonKho})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    <SlPlane /> Còn hàng
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Giá tiền - Hero Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-100">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mb-2">
              Giá bán
            </p>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-5xl font-black text-emerald-600">
                {chiTietSanPham.giaGiam.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-emerald-700">VNĐ</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-500 line-through">
                {chiTietSanPham.giaBan.toLocaleString()} VNĐ
              </span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                -
                {Math.round(
                  ((chiTietSanPham.giaBan - chiTietSanPham.giaGiam) /
                    chiTietSanPham.giaBan) *
                    100
                )}
                %
              </span>
            </div>
          </div>

          {/* Thông tin chi tiết sách */}
          <div className="mb-6 flex-1 bg-gray-50 rounded-lg p-5">
            <p className="text-xl text-black font-bold uppercase tracking-wide mb-4">
              Thông tin sách
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Tác giả
                  </p>
                  <p className="font-bold text-gray-800">
                    {chiTietSanPham.tacGia}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Nhà xuất bản
                  </p>
                  <p className="font-bold text-gray-800">
                    {chiTietSanPham.nhaXuatBan}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Ngày xuất bản
                  </p>
                  <p className="font-bold text-gray-800">
                    {formatDate(chiTietSanPham.ngayXuatBan)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Ngôn ngữ
                  </p>
                  <p className="font-bold text-gray-800">
                    {chiTietSanPham.ngonNgu}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Danh mục
                  </p>
                  <p className="font-bold text-gray-800">
                    {tenDanhMuc || chiTietSanPham.danhMucSachID}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Số trang
                  </p>
                  <p className="font-bold text-gray-800">
                    {chiTietSanPham.soTrang}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-start pt-1">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Định dạng
                  </p>
                  <p className="font-bold text-gray-800">
                    {chiTietSanPham.dinhDang}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Tồn kho
                  </p>
                  {chuaNhapKho ? (
                    <p className="font-bold text-gray-600 text-lg">
                      Chưa nhập kho
                    </p>
                  ) : (
                    <p className="font-bold text-emerald-600 text-lg">
                      {tonKho} cuốn
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chọn số lượng và nút mua */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border-2 border-gray-300 rounded-lg px-2 py-3.5 bg-white">
              <button
                onClick={giamSoLuong}
                className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-700 font-bold"
              >
                <FaMinus size={13} />
              </button>
              <span className="w-8 text-center font-bold text-gray-800 text-sm">
                {soLuong}
              </span>
              <button
                onClick={tangSoLuong}
                className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-700 font-bold"
              >
                <FaPlus size={13} />
              </button>
            </div>

            <button
              onClick={() =>
                handleThemSanPhamVaoGioHang(
                  chiTietSanPham.sachID,
                  soLuong,
                  chiTietSanPham.giaGiam || chiTietSanPham.giaBan
                )
              }
              disabled={
                soLuong < 1 ||
                soLuong > tonKho ||
                chiTietSanPham.stockStatus === "out" ||
                chiTietSanPham.stockStatus === "not-imported"
              }
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-base transition-all shadow-lg ${
                soLuong < 1 ||
                soLuong > tonKho ||
                chiTietSanPham.stockStatus === "out" ||
                chiTietSanPham.stockStatus === "not-imported"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:scale-105"
              }`}
              title={
                chiTietSanPham.stockStatus === "not-imported"
                  ? "Sản phẩm chưa nhập kho"
                  : chiTietSanPham.stockStatus === "out"
                  ? "Sản phẩm đã hết hàng"
                  : soLuong > tonKho
                  ? `Chỉ còn ${tonKho} sản phẩm`
                  : "Thêm vào giỏ hàng"
              }
            >
              <RiShoppingCartLine size={20} /> Thêm vào giỏ hàng
            </button>
          </div>

          {/* Lượt xem + Footer stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-lg">
                <FaEye size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  {chiTietSanPham.luotXem?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500">lượt xem</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-emerald-100 text-emerald-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200 transition-colors">
              Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Chi tiết sản phẩm */}
      <div className="max-w-6xl mx-auto mt-3 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-[#00809D] mb-4">
          Chi tiết sản phẩm
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">
          {chiTietSanPham.moTa}
        </p>
      </div>

      {/* Bình luận */}
      <div className="max-w-6xl mx-auto mt-4">
        {/* Phần Đánh giá sản phẩm */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-4">
          <h3 className="text-2xl font-bold text-[#00809D] mb-6">
            Đánh giá sản phẩm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột trái: Tổng điểm */}
            <div className="flex flex-col items-center justify-center border-r md:border-r border-gray-200">
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {Array.isArray(binhLuan) && binhLuan.length > 0
                  ? (
                      binhLuan.reduce((sum, b) => sum + (b.danhGia || 0), 0) /
                      binhLuan.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <span className="text-sm text-gray-600">
                /{Array.isArray(binhLuan) && binhLuan.length > 0 ? "5" : "0"}
              </span>
              <div className="flex text-yellow-400 mt-2 text-xl">
                {Array.from({ length: 5 }).map((_, i) => {
                  const avgRating =
                    Array.isArray(binhLuan) && binhLuan.length > 0
                      ? binhLuan.reduce((sum, b) => sum + (b.danhGia || 0), 0) /
                        binhLuan.length
                      : 0;
                  return (
                    <FaStar
                      key={i}
                      className={
                        i < Math.round(avgRating) ? "" : "text-gray-300"
                      }
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ({Array.isArray(binhLuan) ? binhLuan.length : 0} đánh giá)
              </p>
            </div>

            {/* Cột phải: Biểu đồ */}
            <div className="md:col-span-2 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = Array.isArray(binhLuan)
                  ? binhLuan.filter((b) => b.danhGia === star).length
                  : 0;
                const percentage =
                  Array.isArray(binhLuan) && binhLuan.length > 0
                    ? ((count / binhLuan.length) * 100).toFixed(0)
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-20">
                      {star} sao
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tiêu đề + số bình luận */}
          <div className="flex items-center justify-between mb-3 pt-4 border-gray-300">
            <h4 className="text-lg font-bold text-[#00809D]">
              Bình luận ({Array.isArray(binhLuan) ? binhLuan.length : 0})
            </h4>
          </div>

          {/* Danh sách bình luận */}
          {Array.isArray(binhLuan) && binhLuan.length > 0 ? (
            <div className="space-y-3">
              {(showAllComments ? binhLuan : binhLuan.slice(0, 3)).map(
                (c, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-3 text-sm shadow border border-gray-200"
                  >
                    {/* Gmail + ngày đánh giá */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#00809D]">
                        {maskEmail(c.email) || "Người dùng"}
                      </span>

                      {c.createdAt && (
                        <span className="text-[11px] text-gray-500">
                          {formatDate(c.createdAt)}
                        </span>
                      )}
                    </div>

                    {/* Sao đánh giá */}
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <span className="flex text-yellow-400 mr-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < c.danhGia ? "" : "text-gray-300"}
                          />
                        ))}
                      </span>
                      <span>{c.danhGia}/5</span>
                    </div>

                    {/* Nội dung bình luận */}
                    <p className="text-gray-700">{c.noiDung}</p>
                  </div>
                )
              )}
              {Array.isArray(binhLuan) && binhLuan.length > 3 && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setShowAllComments((s) => !s)}
                    className="px-4 py-2 rounded-full bg-[#00809D] text-white text-sm hover:bg-[#006b85] transition"
                  >
                    {showAllComments
                      ? "Thu gọn"
                      : `Xem thêm (${binhLuan.length - 3})`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-600 text-sm italic">
              Chưa có bình luận nào cho sản phẩm này.
            </div>
          )}
        </div>
      </div>
      {/* Sách liên quan (hiển thị các sách cùng danh mục) */}
      <div className="max-w-6xl mx-auto mt-6">
        <h3 className="py-2 text-white text-xl font-bold bg-transparent">
          SÁCH LIÊN QUAN
        </h3>
        <div className="mt-4">
          {sachLienQuan.length === 0 ? (
            <p className="text-gray-600 italic">Không có sách liên quan.</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sachLienQuan.map((product) => (
                <li
                  key={product.sachID || product.maSP}
                  className="rounded-md bg-white shadow-md hover:scale-105 overflow-hidden cursor-pointer"
                >
                  <div className="w-full h-70 flex items-center justify-center px-1 py-1">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.tenSach}
                      className="w-full h-full object-cover px-1 py-1"
                    />
                  </div>
                  <div className="p-3 bg-[#3d3fa6] text-white h-full">
                    <h4 className="font-semibold text-sm">{product.tenSach}</h4>
                    <p>Giảm giá: {product.giaGiam?.toLocaleString()} VNĐ</p>
                    <p className="flex justify-between translate-x-[-2px] px-1">
                      <div className="text-red-400 line-through">
                        Giá gốc: {product.giaBan?.toLocaleString()} VNĐ
                      </div>
                      <div className="">
                        {/* placeholder for heart or badge */}
                      </div>
                    </p>
                    <div className="py-2 flex gap-6">
                      <button className="flex gap-4 mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-47 font-semibold hover:bg-white hover:text-red-500">
                        <div className="flex justify-center items-center w-full gap-2">
                          <FaFire className="text-amber-400" />
                          <Link to={`/chitietsanpham/${product.sachID}`}>
                            Xem chi tiết
                          </Link>
                        </div>
                      </button>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* <Footer /> */}
      <Footer />
    </div>
  );
}

export default ChiTietSanPham;
