import { useState, useEffect, useContext } from "react";
import Navigation from "./Navigation";
import {
  FaStar,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaEye,
  FaFire,
} from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import {
  layChiTietSach,
  tangLuotXem,
  nhanTatCaCacQuyenSach,
} from "../lib/sach-apis";
import { layTonKhoTheoSach } from "../lib/phieu-nhap-apis";
import { useParams } from "react-router-dom";
import { themSanPhamVaoGioHang } from "../lib/gio-hang-apis";
import { layBinhLuanTheoSachID } from "../lib/binh-luan-apis";
import { UserContext } from "../contexts/user-context";
function ChiTietSanPham() {
  const [anhIndex, setAnhIndex] = useState(0);
  const [soLuong, setSoLuong] = useState(1);

  // Biến trạng thái để lưu trữ thông tin sản phẩm
  const [chiTietSanPham, setChiTietSanPham] = useState(null);
  const [tonKho, setTonKho] = useState(0); // Tồn kho từ hệ thống quản lý
  const [binhLuan, setBinhLuan] = useState([]);
  const [sachLienQuan, setSachLienQuan] = useState([]); // danh sách sách liên quan cùng danh mục
  const [showAllComments, setShowAllComments] = useState(false); // trạng thái hiển thị tất cả bình luận hay không

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
    if (soLuong < tonKho) {
      let soLuongMoi = soLuong + 1;
      setSoLuong(soLuongMoi);
    }
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
        // Chuyển dữ liệu hình ảnh (images) về dạng mảng
        chiTietSanPham.images = JSON.parse(chiTietSanPham.images);

        console.log("Chi tiết sản phẩm từ server:", chiTietSanPham);

        // Nếu server chưa cung cấp stockStatus, tính tạm thời ở client
        const LOW_STOCK_THRESHOLD = 5;
        chiTietSanPham.stockStatus =
          typeof chiTietSanPham.stockStatus !== "undefined"
            ? chiTietSanPham.stockStatus
            : chiTietSanPham.soLuongConLai <= 0
            ? "out"
            : chiTietSanPham.soLuongConLai <= LOW_STOCK_THRESHOLD
            ? "low"
            : "available";

        setChiTietSanPham(chiTietSanPham);
      }
    };

    napChiTietSanPham();
  }, [sachID]);

  // Lấy tồn kho từ hệ thống quản lý
  useEffect(() => {
    const napTonKho = async () => {
      if (!sachID) return;
      try {
        const data = await layTonKhoTheoSach(sachID);
        setTonKho(data.tonKho || 0);
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
          .map((s) => ({ ...s, images: JSON.parse(s.images || "[]") }))
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col items-center border p-4 rounded-xl shadow-lg   ">
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
        <div className="relative bg-amber-100 rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-[#00809D] mb-2">
            {chiTietSanPham.tenSach}
          </h2>
          {/* Badge trạng thái tồn kho - nâng cấp đẹp, chuyên nghiệp */}
          {chiTietSanPham.stockStatus === "out" ? (
            <div className="w-full flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-full text-sm font-semibold mb-2 shadow-lg border border-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
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
              Hết hàng
            </div>
          ) : chiTietSanPham.stockStatus === "low" ? (
            <div className="w-full flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-4 py-2 rounded-full text-sm font-semibold mb-2 shadow-md border border-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              Sắp hết hàng còn ({tonKho} sản phẩm)
            </div>
          ) : null}

          {/* //đánh giá sản phẩm */}
          {chiTietSanPham.danhGia && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(chiTietSanPham.danhGia)
                        ? ""
                        : "text-gray-300"
                    }
                  />
                ))}
              </span>
              <span className="text-gray-600 ml-2">
                {chiTietSanPham.danhGia}/5
              </span>
            </div>
          )}
          {/* // Thông số chi tiết 1 quyển sách */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-base">
            <div>
              <span className="font-semibold">Tác giả:</span>{" "}
              {chiTietSanPham.tacGia}
            </div>
            <div>
              <span className="font-semibold">Nhà xuất bản:</span>{" "}
              {chiTietSanPham.nhaXuatBan}
            </div>
            <div>
              <span className="font-semibold">Ngày xuất bản:</span>{" "}
              {formatDate(chiTietSanPham.ngayXuatBan)}
            </div>
            <div>
              <span className="font-semibold">Ngôn ngữ:</span>{" "}
              {chiTietSanPham.ngonNgu}
            </div>
            <div>
              <span className="font-semibold">Danh mục sách:</span>{" "}
              {chiTietSanPham.danhMucSachID}
            </div>
            <div>
              <span className="font-semibold">Số trang:</span>{" "}
              {chiTietSanPham.soTrang}
            </div>
            <div>
              <span className="font-semibold">Định dạng:</span>{" "}
              {chiTietSanPham.dinhDang}
            </div>
            <div>
              <span className="font-semibold">Số lượng còn lại:</span> {tonKho}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 mr-auto">
            <span className="text-2xl text-[#00f821] font-bold">
              {chiTietSanPham.giaGiam.toLocaleString()} VNĐ
            </span>
            <span className="text-red-500 line-through text-2xl">
              {chiTietSanPham.giaBan.toLocaleString()} VNĐ
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4 ">
            <button
              onClick={giamSoLuong}
              className="p-2 rounded-full text-black bg-gray-200 hover:bg-gray-300"
            >
              <FaMinus />
            </button>
            <span className=" text-black w-8 text-center">{soLuong}</span>
            <button
              onClick={tangSoLuong}
              className="p-2 rounded-full text-black bg-gray-200 hover:bg-gray-300"
            >
              <FaPlus />
            </button>
            <div className="ml-3">
              <button
                onClick={() =>
                  handleThemSanPhamVaoGioHang(
                    chiTietSanPham.sachID,
                    soLuong,
                    chiTietSanPham.giaGiam || chiTietSanPham.giaBan
                  )
                }
                disabled={soLuong < 1 || soLuong > tonKho}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold ml-6 transition-all ${
                  soLuong < 1 || soLuong > tonKho
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#00809D] text-white hover:bg-[#006b85]"
                }`}
                title={
                  soLuong > tonKho
                    ? `Chỉ còn ${tonKho} sản phẩm`
                    : "Thêm vào giỏ hàng"
                }
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
          <div className="absolute bottom-7 right-4 z-20">
            <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full shadow-md border">
              <FaEye className="text-gray-600" />
              <span className="font-medium text-gray-800 text-sm">
                {chiTietSanPham.luotXem?.toLocaleString() || 0} lượt xem
              </span>
            </div>
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
        <div className="bg-amber-100 rounded-xl p-4 shadow">
          {/* Tiêu đề + số bình luận */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-[#00809D]">Bình luận</h3>
            {Array.isArray(binhLuan) && binhLuan.length > 0 && (
              <span className="text-xs text-gray-600">
                {binhLuan.length} bình luận
              </span>
            )}
          </div>

          {/* Danh sách bình luận */}
          {Array.isArray(binhLuan) && binhLuan.length > 0 ? (
            <div className="space-y-3">
              {(showAllComments ? binhLuan : binhLuan.slice(0, 3)).map(
                (c, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 text-sm">
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
