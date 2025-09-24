import { useState } from "react";
import Navigation from "./Navigation";
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import {sanphammoi} from "../lib/data"; 
import Footer from "./Footer";
const product = {
  hinhAnh: [
    "https://cungdocsach.vn/wp-content/uploads/2019/10/Harry-potter-v%C3%A0-h%C3%B2n-%C4%91%C3%A1-ph%C3%B9-th%E1%BB%A7y.gif",
    "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/9Mi8yPrkA0EefbVyE0CHs8tajsg.jpg",
    "https://www.essential-guide-to-autism.com/storage/images/harry-potter-va-hon-da-phu-thuy/harry-potter-va-hon-da-phu-thuy-thumb.jpg",
  ],
  tenSP: "Harry Potter và Hòn Đá Phù Thủy",
  tacGia: "J.K. Rowling",
  nhaXuatBan: "NXB Trẻ",
  ngayXuatBan: "2023-09-15",
  ngonNgu: "Tiếng Việt",
  loaiSach: "Tiểu thuyết giả tưởng",
  soTrang: 432,
  dinhDang: "Bìa cứng",
  kichThuoc: "15 x 23 cm",
  soLuongConLai: 1000,
  gia: 180000,
  giaGiam: 145000,
  ISBN10: "6041234567",
  ISBN13: "978-604-123456-7",
  danhGia: 4.7,
  chiTiet: `Harry Potter và Hòn Đá Phù Thủy là tập đầu tiên trong bộ truyện huyền thoại Harry Potter. 
  Câu chuyện xoay quanh cậu bé mồ côi Harry, người phát hiện ra mình là một phù thủy và bắt đầu hành trình tại trường Hogwarts. 
  Với tình tiết hấp dẫn, phép thuật kỳ ảo và thông điệp về tình bạn, lòng dũng cảm, cuốn sách đã chinh phục hàng triệu độc giả.`,
  binhLuan: [
    {
      user: "Nguyễn Văn A",
      comment: "Sách hay, dịch dễ hiểu. Bìa đẹp nữa!",
      rating: 5,
    },
    {
      user: "Trần Thị B",
      comment: "Giao hàng nhanh, sách mới nguyên. Nội dung hấp dẫn.",
      rating: 4,
    },
    { user: "Lê Minh C", comment: "Giá hơi cao nhưng đáng tiền.", rating: 4.5 },
  ],
};

function ChiTietSanPham() {
  const [anhIndex, setAnhIndex] = useState(0);
  const [soLuong, setSoLuong] = useState(1);

  const giamSoLuong = () => {
    // variable scope
    if (soLuong > 1) {
      let soLuongMoi = soLuong - 1;
      setSoLuong(soLuongMoi);
    }
  };

  const tangSoLuong = () => {
    if (soLuong < product.soLuongConLai) {
      let soLuongMoi = soLuong + 1;
      setSoLuong(soLuongMoi);
    }
  };

  return (
    <div className=" min-h-screen w-full">
      <Navigation />
      {/* <h1 className="text-4xl font-bold text-center my-8">CHI TIẾT SẢN PHẨM</h1> */}
      <div className="max-w-6xl mx-auto py-10  grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col items-center border p-4 rounded-xl shadow-lg   ">
          <div className="w-[350px] h-[500px] rounded-xl overflow-hidden shadow-lg mb-4 bg-white flex items-center justify-center">
            <img
              src={product.hinhAnh[anhIndex]}
              alt={product.tenSP}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.hinhAnh.map((img, idx) => (
              <img
                key={idx}
                src={img}
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
            {product.tenSP}
          </h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(product.danhGia) ? "" : "text-gray-300"
                  }
                />
              ))}
            </span>
            <span className="text-gray-600 ml-2">{product.danhGia}/5</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-base">
            <div>
              <span className="font-semibold">Tác giả:</span> {product.tacGia}
            </div>
            <div>
              <span className="font-semibold">Nhà xuất bản:</span>{" "}
              {product.nhaXuatBan}
            </div>
            <div>
              <span className="font-semibold">Ngày xuất bản:</span>{" "}
              {product.ngayXuatBan}
            </div>
            <div>
              <span className="font-semibold">Ngôn ngữ:</span> {product.ngonNgu}
            </div>
            <div>
              <span className="font-semibold">Loại sách:</span>{" "}
              {product.loaiSach}
            </div>
            <div>
              <span className="font-semibold">Số trang:</span> {product.soTrang}
            </div>
            <div>
              <span className="font-semibold">Định dạng:</span>{" "}
              {product.dinhDang}
            </div>
            <div>
              <span className="font-semibold">Số lượng còn lại:</span>{" "}
              {product.soLuongConLai}
            </div>
            <div>
              <span className="font-semibold">ISBN13:</span> {product.ISBN13}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 mr-auto">
            <span className="text-2xl text-[#00f821] font-bold">
              {product.giaGiam.toLocaleString()} VNĐ
            </span>
            <span className="text-red-500 line-through text-lg">
              {product.gia.toLocaleString()} VNĐ
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
             <button className="flex items-center gap-2 bg-[#00809D] text-white px-6 py-2 rounded-full font-bold hover:bg-[#006b85] ml-6 transition-all">
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>     
           </div>
          </div>
        </div>
      </div>

      {/* Chi tiết sản phẩm */}
      <div className="max-w-6xl mx-auto mt-0 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-[#00809D] mb-4">
          Chi tiết sản phẩm
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">
          {product.chiTiet}
        </p>
      </div>

      {/* Bình luận */}
      <div className="max-w-6xl mx-auto mt-1 bg-amber-200  rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-[#00809D] mb-4">Bình luận</h3>
        <div className="space-y-4">
          {product.binhLuan.map(
            (
              c,
              idx // comment, c = {user: ..., rating: ..., comment: ...}
            ) => (
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
            )
          )}
        </div>
      </div>

      {/* Sách liên quan */}
      <div className="  max-w-6xl mx-auto mt-10 rounded-xl shadow-lg border p-8">
        <h3 className="text-2xl font-bold  mb-4">
          Sách liên quan
        </h3>
        <ul className="grid grid-cols-4 gap-6  ">
          {sanphammoi.map((product) => (
            <li key={product.maSP} className="w-full h-full rounded-md border p-4 shadow-lg hover:scale-105 transition-all bg-amber-100 ">
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
                <button className="flex justify-center items-center hover:scale-105 hover:cursor-pointer transition-all gap-x-2 mt-4 bg-[#00809D] text-white py-1 px-2 w-full rounded-full font-bold">
                  <span>
                    <FaShoppingCart />
                  </span>
                  <span>Thêm Giỏ Hàng</span>
                </button>
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