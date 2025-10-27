import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { sanphammoi } from "../lib/data";
import Footer from "./Footer";
import { layChiTietSach } from "../lib/sach-apis";
import { useParams } from "react-router-dom";
import { themSanPhamVaoGioHang } from "../lib/gio-hang-apis";
function ChiTietSanPham() {
  const [anhIndex, setAnhIndex] = useState(0);
  const [soLuong, setSoLuong] = useState(1);

  // Biến trạng thái để lưu trữ thông tin sản phẩm
  const [chiTietSanPham, setChiTietSanPham] = useState(null);

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
    if (soLuong < chiTietSanPham.soLuongConLai) {
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

        setChiTietSanPham(chiTietSanPham);
      }
    };

    napChiTietSanPham();
  }, [sachID]);

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
        <div className=" bg-amber-100 rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-[#00809D] mb-2">
            {chiTietSanPham.tenSach}
          </h2>
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
              <span className="font-semibold">Số lượng còn lại:</span>{" "}
              {chiTietSanPham.soLuongConLai}
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
                disabled={soLuong < 1 || soLuong > chiTietSanPham.soLuongConLai}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold ml-6 transition-all ${
                  soLuong < 1 || soLuong > chiTietSanPham.soLuongConLai
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#00809D] text-white hover:bg-[#006b85]"
                }`}
                title={
                  soLuong > chiTietSanPham.soLuongConLai
                    ? `Chỉ còn ${chiTietSanPham.soLuongConLai} sản phẩm`
                    : "Thêm vào giỏ hàng"
                }
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
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
          {chiTietSanPham.chiTiet}
        </p>
      </div>

      {/* Bình luận */}
      <div className="max-w-6xl mx-auto mt-1 bg-amber-200  rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-[#00809D] mb-4">Bình luận</h3>
        <div className="space-y-4">
          {Array.isArray(chiTietSanPham.binhLuan) &&
          chiTietSanPham.binhLuan.length > 0 ? (
            chiTietSanPham.binhLuan.map((c, idx) => (
              <div key={idx} className="border-b pb-2 border-black">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#00809D]">{c.user}</span>
                  <span className="text-yellow-400 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < c.rating ? "" : "text-gray-300"}
                      />
                    ))}
                  </span>
                </div>
                <p className="text-gray-700 ml-2">{c.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-600">Chưa có bình luận</div>
          )}
        </div>
      </div>

      {/* Sách liên quan */}
      <div className="  max-w-6xl mx-auto mt-10 rounded-xl shadow-lg border p-8">
        <h3 className="text-2xl font-bold  mb-4">Sách liên quan</h3>
        <ul className="grid grid-cols-4 gap-6  ">
          {sanphammoi.map((product) => (
            <li
              key={product.maSP}
              className="w-full h-full rounded-md border p-4 shadow-lg hover:scale-105 transition-all bg-amber-100 "
            >
              <div className="w-full h-[350px] rounded-xl overflow-hidden">
                <img
                  src={product.hinhAnh}
                  alt={product.tenSP}
                  className="w-full h-full object-cover "
                />
              </div>
              <div className="p-2 bg-transparent">
                <h4 className="font-bold uppercase py-2 text-[#00809D]">
                  {product.tenSP}
                </h4>
                <p className=" text-[#205d28] font-bold">
                  {product.giaGiam.toLocaleString()} VNĐ
                </p>
                <p className="text-red-500 line-through text-sm mt-2">
                  Giá gốc: {product.gia.toLocaleString()} VNĐ
                </p>
                <div>
                  <button className="flex justify-center items-center hover:scale-105 hover:cursor-pointer transition-all gap-x-2 mt-4 bg-[#00809D] text-white py-1 px-2 w-full rounded-full font-bold">
                    <span>
                      <FaShoppingCart />
                    </span>
                    <div className="mt-auto">
                      <span>Thêm Giỏ Hàng</span>
                    </div>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* <Footer /> */}
      <Footer />
    </div>
  );
}

export default ChiTietSanPham;
