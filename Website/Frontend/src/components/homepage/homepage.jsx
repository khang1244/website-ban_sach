import Navigation from "../Navigation";
import Banner from "../Banner";
import Footer from "../Footer";
import { CiHeart } from "react-icons/ci";
import { FaFire } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiGift, FiPhoneCall } from "react-icons/fi";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import { nhanTatCaDanhMucSach } from "../../lib/danh-muc-sach-apis";
import { themSanPhamVaoGioHang } from "../../lib/gio-hang-apis";
import { UserContext } from "../../contexts/user-context";

// const danhmuc = ["Tất cả", "Truyện tranh", "ngôn tình", "phiêu lưu", "kinh dị"];

const giasach = [
  // Vùng giá
  { label: "Tất cả", value: "all" },
  { label: "Dưới 50.000", value: "<50000" },
  { label: "50.000 - 100.000", value: "50000-100000" },
  { label: "Trên 100.000", value: ">100000" },
  { label: "Trên 200.000", value: ">200000" },
];

function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState("all");
  // bộ lộc sách bán chạy
  const [selectedCategoryBC, setSelectedCategoryBC] = useState(0); // Hook của React danh mục được chọn bộ lọc sách bán chạy
  const [selectedPriceBC, setSelectedPriceBC] = useState("all"); // Hook của React giá được chọn của bộ lọc sách bán chạy

  // // Biến trạng thái để lưu trữ danh sách sản phẩm lấy từ backend
  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  // Lọc sản phẩm theo danh mục và giá của bộ lọc sách mới
  const bolocsachmoi = danhSachSanPham.filter((product) => {
    let matchCategory =
      selectedCategory == 0 ||
      (product.danhMucSachID && product.danhMucSachID === selectedCategory);
    let matchPrice = true;
    if (selectedPrice === "<50000") {
      matchPrice = product.giaGiam < 50000;
    } else if (selectedPrice === "50000-100000") {
      matchPrice = product.giaGiam >= 50000 && product.giaGiam <= 100000;
    } else if (selectedPrice === ">100000") {
      matchPrice = product.giaGiam > 100000;
    } else if (selectedPrice === ">200000") {
      matchPrice = product.giaGiam > 200000;
    }
    return matchCategory && matchPrice;
  });
  // Phân trang cho SÁCH MỚI
  const itemsPerPage = 8; // show 8 products per page
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(bolocsachmoi.length / itemsPerPage));
  const paginatedSachMoi = bolocsachmoi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Nếu bộ lọc thay đổi và trang hiện tại vượt quá tổng số trang, đặt lại trang hiện tại về 1
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);
  // Lọc sản phẩm theo danh mục và giá của bộ lọc sách bán chạy
  const bolocsachbanchay = danhSachSanPham.filter((product) => {
    let matchCategory =
      selectedCategoryBC == 0 ||
      (product.danhMucSachID && product.danhMucSachID === selectedCategoryBC);
    let matchPrice = true;

    if (selectedPriceBC === "<50000") {
      matchPrice = product.giaGiam < 50000;
    } else if (selectedPriceBC === "50000-100000") {
      matchPrice = product.giaGiam >= 50000 && product.giaGiam <= 100000;
    } else if (selectedPriceBC === ">100000") {
      matchPrice = product.giaGiam > 100000;
    }
    if (selectedPriceBC === ">200000") {
      matchPrice = product.giaGiam > 200000;
    }
    return matchCategory && matchPrice;
  });
  // Thêm useEffect để nạp dữ liệu thật từ sever
  useEffect(() => {
    const napTatCaSanPham = async () => {
      const data = await nhanTatCaCacQuyenSach();
      if (data) {
        // Chuyển đổi chuỗi JSON của trường images thành mảng để sử dụng
        data.forEach((sach) => {
          sach.images = JSON.parse(sach.images);
        });

        setDanhSachSanPham(data);
      }
    };
    napTatCaSanPham();
  }, []);
  // Tạo thêm 1 biến trạng thái để lưu dữ liệu danh mục sách
  const [danhMucSach, setDanhMucSach] = useState([]);

  // User context để cập nhật badge giỏ hàng
  const { refreshCartCount } = useContext(UserContext);

  // Hàm để cuộn carousel sản phẩm bán chạy
  const carouselRef = useRef(null);
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth || 600;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Nạp dữ liệu danh mục sách
  useEffect(() => {
    const napDanhMucSach = async () => {
      const duLieuDM = await nhanTatCaDanhMucSach();
      if (duLieuDM) {
        console.log("Dữ liệu danh mục sách:", duLieuDM);
        //Bổ sung thêm vào danh mục sách có "Tất cả"ở cột đầu tiên ở trang chủ
        duLieuDM.unshift({
          danhMucSachID: 0,
          tenDanhMuc: "Tất cả",
        });
        setDanhMucSach(duLieuDM);
      }
    };
    napDanhMucSach();
  }, []);

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
      // Cập nhật badge ngay lập tức
      if (typeof refreshCartCount === "function") refreshCartCount();
    } else {
      alert(
        "Thêm sản phẩm vào giỏ hàng thất bại! " + (phanHoiTuSever.message || "")
      );
    }
  };
  return (
    <div className=" min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Banner */}
      <Banner />
      {/* ==== Sách Mới ==== */}
      <div className="mt-6">
        <h3 className="py-2 px-5 text-white  text-xl font-bold">SÁCH MỚI</h3>
        <div className="flex gap-4 mt-4 mx-4">
          {/* Bộ lọc đã chỉnh sửa: Giao diện sạch sẽ và hiện đại hơn */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow-xl p-6 space-y-7 border border-gray-100">
            {/* Danh mục */}
            <div className="space-y-3">
              {/* Chữ lớn hơn, font đậm, màu tối hơn */}
              <h4 className="text-gray-800 font-bold text-lg border-b pb-2">
                Danh mục:
              </h4>
              <div className="flex flex-wrap gap-2">
                {danhMucSach.map((cat) => (
                  <button
                    key={cat.danhMucSachID}
                    onClick={() => setSelectedCategory(cat.danhMucSachID)}
                    className={`
                        px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 
                        ${
                          // Màu nhấn Xanh dương (Blue) sạch sẽ, đổ bóng nhẹ
                          selectedCategory === cat.danhMucSachID
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-300/50"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                        }
                    `}
                  >
                    {cat.tenDanhMuc}
                  </button>
                ))}
              </div>
            </div>

            {/* lọc Giá */}
            {/* Dùng đường kẻ phân chia tinh tế hơn */}
            <div className="pt-5 border-t border-gray-200 space-y-3">
              {/* Chữ lớn hơn, font đậm, màu tối hơn */}
              <h4 className="text-gray-800 font-bold text-lg border-b pb-2">
                Giá:
              </h4>
              <div className="flex flex-wrap gap-2">
                {giasach.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPrice(range.value)}
                    className={`
                        px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200
                        ${
                          // Màu nhấn Xanh lá (Green) đậm hơn, đồng bộ
                          selectedPrice === range.value
                            ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-300/50"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-500"
                        } 
                    `}
                  >
                    {range.label}
                  </button>
                ))}

                {/* Thẻ ưu đãi thay cho ảnh, gọn gàng và chuyên nghiệp */}
                <div className="mt-7 w-full">
                  <div className="rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-6 shadow-2xl border border-white/20 relative overflow-hidden group">
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300" />

                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
                            💎 Đặc quyền VIP
                          </p>
                          <h5 className="text-2xl font-bold mt-1">
                            Trở thành thành viên
                          </h5>
                        </div>
                        <div className="text-4xl">🎁</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 my-4">
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/25 transition-all">
                          <div className="text-2xl mb-1">⚡</div>
                          <p className="text-sm font-semibold">Giao nhanh 2h</p>
                          <p className="text-xs text-white/70">Nội thành HCM</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/25 transition-all">
                          <div className="text-2xl mb-1">💰</div>
                          <p className="text-sm font-semibold">Tích điểm 5%</p>
                          <p className="text-xs text-white/70">Mỗi đơn hàng</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/25 transition-all">
                          <div className="text-2xl mb-1">🔄</div>
                          <p className="text-sm font-semibold">
                            Đổi trả 7 ngày
                          </p>
                          <p className="text-xs text-white/70">Không phí</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/25 transition-all">
                          <div className="text-2xl mb-1">🎧</div>
                          <p className="text-sm font-semibold">Hỗ trợ 24/7</p>
                          <p className="text-xs text-white/70">Hotline riêng</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm bên phải */}
          <div className="w-3/4 ">
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedSachMoi.map((product) => (
                <li
                  key={product.maSP}
                  className="rounded-md bg-white shadow-md hover:scale-105 overflow-hidden cursor-pointer "
                >
                  <div className="w-full h-70 flex items-center justify-center px-1 py-1">
                    <img
                      src={product.images[0]?.url}
                      alt={product.tenSP}
                      className="w-full h-full object-cover px-1 py-1"
                    />
                  </div>
                  <div className="p-3 bg-[#3d3fa6] text-white h-full ">
                    <h4 className="font-semibold text-sm">{product.tenSach}</h4>
                    <p>Giảm giá: {product.giaGiam.toLocaleString()} VNĐ</p>
                    <p className="flex justify-between translate-x-[-2px] px-1">
                      <div className="text-red-400 line-through">
                        Giá gốc: {product.giaBan.toLocaleString()} VNĐ
                      </div>
                      <CiHeart className="hover:text-red-400 text-2xl " />
                    </p>
                    <div>
                      <div className=" py-2 flex gap-6">
                        <button className=" flex gap-4 mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-47 font-semibold hover:bg-white hover:text-red-500 ">
                          <div className="flex justify-center items-center w-full gap-2 ">
                            <FaFire className=" text-amber-400 " />
                            <Link to={`/chitietsanpham/${product.sachID}`}>
                              Xem chi tiết
                            </Link>
                          </div>
                        </button>
                        {/* Thêm giỏ hàng: button riêng, không lồng Link */}
                        <button
                          onClick={() =>
                            handleThemSanPhamVaoGioHang(
                              product.sachID,
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* // Phân trang cho Sách Mới */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-9 ml-76">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-50"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded border ${
                  currentPage === p
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
      {/* Sản phẩm bán chạy */}
      <div className="mt-4 ">
        <h3 className="py-2 px-5 text-white text-xl font-bold">
          SÁCH ĐƯỢC XEM NHIỀU NHẤT
        </h3>
        {/* Bộ lọc theo danh mục và giá của sản phẩm bán chạy */}
        <div className="flex flex-wrap gap-4 px-4 py-6 mt-5 bg-gray-50 w-auto rounded-lg mx-4  ">
          <div>
            <label className="text-black font-semibold mr-2">Danh mục:</label>
            <select
              className="rounded px-2 py-1 text-black border-1"
              value={selectedCategoryBC}
              onChange={(e) => setSelectedCategoryBC(Number(e.target.value))}
            >
              {danhMucSach.map((cat) => (
                <option key={cat.danhMucSachID} value={cat.danhMucSachID}>
                  {cat.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-black font-semibold mr-2">Giá:</label>
            <select
              className="rounded px-2 py-1 text-black border-1"
              value={selectedPriceBC}
              onChange={(e) => setSelectedPriceBC(e.target.value)}
            >
              {giasach.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* // Hiển thị danh sách sản phẩm bán chạy đã lọc - carousel */}
        <div className="relative mt-6 mx-4">
          {/* Left arrow (visible when many items) */}
          {bolocsachbanchay.length > 5 && (
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md"
              aria-label="scroll left"
            >
              <HiChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}

          {/* Right arrow */}
          {bolocsachbanchay.length > 5 && (
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md"
              aria-label="scroll right"
            >
              <HiChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto whitespace-nowrap py-4 smooth-scroll"
            style={{ scrollBehavior: "smooth" }}
          >
            {bolocsachbanchay
              // Sắp xếp sản phẩm bán chạy theo lượt xem giảm dần
              .slice()
              .sort((a, b) => (b.luotXem || 0) - (a.luotXem || 0))
              .map((product) => (
                <div
                  key={product.maSP}
                  className="min-w-[200px] sm:min-w-[220px] md:min-w-[260px] rounded-md bg-white shadow-md hover:scale-105 overflow-hidden cursor-pointer"
                >
                  <div className="w-full h-70 flex items-center justify-center px-1 py-1">
                    <img
                      src={product.images[0]?.url}
                      alt={product.tenSP}
                      className="w-full h-full object-cover px-1 py-1"
                    />
                  </div>
                  <div className="p-3 bg-[#3d3fa6] text-white h-full ">
                    <h4 className="font-semibold text-sm">{product.tenSach}</h4>
                    <p>Giảm giá: {product.giaGiam.toLocaleString()} VNĐ</p>
                    <p className="flex justify-between -translate-x-0.5 px-1">
                      <div className="text-red-400 line-through">
                        Giá gốc: {product.giaBan.toLocaleString()} VNĐ
                      </div>
                      <CiHeart className="hover:text-red-400 text-2xl " />
                    </p>
                    <div>
                      <div className=" py-2 flex gap-6">
                        <button className=" flex gap-4 mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-47 font-semibold hover:bg-white hover:text-red-500 ">
                          <div className="flex justify-center items-center w-full gap-2 ">
                            <FaFire className=" text-amber-400 " />
                            <Link to={`/chitietsanpham/${product.sachID}`}>
                              Xem chi tiết
                            </Link>
                          </div>
                        </button>
                        {/* Thêm giỏ hàng: button riêng, không lồng Link */}
                        <button
                          onClick={() =>
                            handleThemSanPhamVaoGioHang(
                              product.sachID,
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
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;
