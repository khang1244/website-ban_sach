import Navigation from "../Navigation";
import Banner from "../Banner";
import Footer from "../Footer";
import sach4 from "../../assets/sach4.webp";
import { CiHeart } from "react-icons/ci";
import { FaFire } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import { nhanTatCaDanhMucSach } from "../../lib/danh-muc-sach-apis";

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
          {/* Bộ lọc đẹp với danh mục và giá hiển thị hết ra */}
          <div className="w-full md:w-1/4 bg-amber-300 rounded-xl shadow-md p-5 space-y-6">
            {/* Danh mục */}
            <div>
              <h4 className="text-gray-800  font-semibold mb-3">Danh mục:</h4>
              <div className="flex flex-wrap gap-2">
                {danhMucSach.map((cat) => (
                  <button
                    key={cat.danhMucSachID}
                    onClick={() => setSelectedCategory(cat.danhMucSachID)}
                    className={`px-3 py-1 rounded-full border ${
                      selectedCategory === cat.danhMucSachID
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                    } transition`}
                  >
                    {cat.tenDanhMuc}
                  </button>
                ))}
              </div>
            </div>
            {/* lọc Giá */}
            <div className="border-t pt-4  ">
              <h4 className="text-gray-800 font-semibold mb-3">Giá:</h4>
              <div className="flex flex-wrap gap-2">
                {giasach.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPrice(range.value)}
                    className={`px-3 py-1 rounded-full border ${
                      selectedPrice === range.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-gray-100 text-gray-800 hover:bg-green-100"
                    } transition`}
                  >
                    {range.label}
                  </button>
                ))}
                <div className="mt-15 border-4 ">
                  <img
                    src={sach4}
                    alt="Logo"
                    className=" object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm bên phải */}
          <div className="w-3/4 ">
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bolocsachmoi.map((product) => (
                <li
                  key={product.maSP}
                  className="rounded-md bg-white shadow-md hover:scale-105 overflow-hidden cursor-pointer "
                >
                  <div className="w-full h-60 flex items-center justify-center px-1 py-1">
                    <img
                      src={product.images[0]?.url}
                      alt={product.tenSP}
                      className="w-full h-full object-cover px-2 py-2"
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
                        <div>
                          <RiShoppingCartLine className="w-9 h-6 mt-3 text-white hover:text-red-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Sản phẩm bán chạy */}
      <div className="mt-4 ">
        <h3 className="py-2 px-5 text-white text-xl font-bold">
          SÁCH BÁN CHẠY
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
        {/* // Hiển thị danh sách sản phẩm bán chạy đã lọc */}
        <ul className="grid grid-cols-4 gap-4 px-5 py-1 mt-3">
          {bolocsachbanchay.map((product) => (
            <li
              key={product.maSP}
              className="w-auto h-fit hover:scale-105 overflow-hidden cursor-pointer "
            >
              <div className="rounded-2xl overflow-hidden shadow-lg  ">
                <div className="w-full h-full overflow-hidden ">
                  <img
                    src={product.images[0]?.url}
                    alt={product.tenSP}
                    className=" w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 px-5 bg-[#3d3fa6] ">
                  <h4 className="font-semibold text-white text-xl cursor-pointer ">
                    {product.tenSach}
                  </h4>
                  <p className=" text-white ">
                    Giảm giá: {product.giaGiam.toLocaleString()} VNĐ
                  </p>
                  <p className="flex justify-between">
                    <div>
                      <p className="line-through text-red-400">
                        Giá gốc: {product.giaBan.toLocaleString()} VNĐ
                      </p>
                    </div>
                    <CiHeart className="text-white hover:text-red-400 text-2xl cursor-pointer mr-4" />
                  </p>
                  <div className="py-1 flex gap-6">
                    <button className=" flex gap-4 mt-2 bg-blue-500 text-white py-1 px-2 rounded-xl w-47 font-semibold hover:bg-white hover:text-red-500 ">
                      <div className="flex justify-center items-center w-full gap-2 ">
                        <FaFire className=" text-amber-400 " />
                        <Link to="/chitietsanpham">Xem chi tiết</Link>
                      </div>
                    </button>
                    <div>
                      <RiShoppingCartLine className="w-9 h-6 mt-3 text-white hover:text-red-500 transition-all translate-x-[43px]" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;
