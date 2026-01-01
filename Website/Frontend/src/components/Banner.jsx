import { useState, useEffect } from "react";
import { bannerBooks } from "../lib/data";
import { CiSearch } from "react-icons/ci";
// import avatar from "../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user-context";

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ mục slide hiện tại
  const [giaTriTimkiem, setGiaTriTimKiem] = useState(""); // Giá trị tìm kiếm

  // Khai báo useNavigate để chuyển hướng
  const navigate = useNavigate();

  // Tự động chạy carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000); // đổi slide mỗi 3s
    return () => clearInterval(interval);
  }, [currentIndex]);

  // //  chuyển về sidle phía trước
  // const goToPrev = () => {
  //   // Previous
  //   const isFirst = currentIndex === 0;
  //   const newIndex = isFirst ? bannerBooks.length - 1 : currentIndex - 1;
  //   setCurrentIndex(newIndex);
  // };
  // chuyển về slide phía sau
  const goToNext = () => {
    const isLast = currentIndex === bannerBooks.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  // Xử lý tìm kiếm khi nhấn Enter
  const xuLyTimKiemKhiEnter = (e) => {
    if (e.key === "Enter") {
      xuLyTimKiem();
    }
  };
  // Xử lý tìm kiếm khi nhấn vào biểu tượng tìm kiếm
  const xuLyTimKiem = () => {
    if (giaTriTimkiem.trim() !== "") {
      navigate(`/ketquatimkiemsach?q=${encodeURIComponent(giaTriTimkiem)}`);
    }
  };

  return (
    <div className="w-full px-5">
      {/* tìm kiếm + tagline/benefits */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-10 py-5.5 text-white">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white/95">
            Sách hay, giao nhanh, đổi trả 7 ngày
          </span>
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold shadow-sm shadow-emerald-500/30">
            Freeship
          </span>
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold shadow-sm shadow-pink-500/30">
            Ưu đãi tuần này
          </span>
          <a
            href="tel:1900xxxx"
            className="px-4 py-1.5 rounded-full bg-white/10 border border-white/25 text-white/95 hover:bg-white/15 transition"
          >
            Hotline: 0762835400
          </a>
        </div>
        <div className="w-full md:w-1/2 relative">
          {/* Thanh tìm kiếm */}
          <input
            type="text"
            placeholder="Nhập tìm kiếm"
            className="w-full rounded-full bg-white outline-none p-2 text-black px-4 "
            value={giaTriTimkiem}
            onChange={(e) => setGiaTriTimKiem(e.target.value)}
            onKeyDown={xuLyTimKiemKhiEnter}
          />
          <div
            onClick={xuLyTimKiem}
            className="absolute top-2.5 right-4 text-black text-xl font-extrabold"
          >
            <CiSearch className="cursor-pointer" />
          </div>
        </div>
      </div>
      {/* Dòng chạy thông báo */}
      <div className="mb-4 w-full overflow-hidden rounded-s-lg bg-white/10 border border-white/15 backdrop-blur-md">
        <div
          className="whitespace-nowrap text-white font-semibold text-sm py-2 px-4 "
          style={{
            display: "inline-block",
            animation: "marquee 18s linear infinite ",
          }}
        >
          Ưu đãi tuần này từ 11/12/2025 - 30/12/2025: Giảm 15% đơn &gt; 300k với
          mã giảm già là SALE15 . Mọi người nhanh chóng săn sale kẻo hết nhé số
          lượng có hạn!
        </div>
      </div>
      <div className=" relative w-full overflow-hidden rounded-4xl">
        {/* Keyframes cho marquee */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>

        {/* Slides chạy */}
        <div
          className="flex transition-transform ease-in-out duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {bannerBooks.map((book) => (
            <div
              key={book.id}
              className="w-full h-[450px] flex flex-shrink-0 flex-col items-center"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <p className="mt-2 text-white font-semibold">{book.title}</p>
            </div>
          ))}
        </div>

        {/* Nút điều khiển trái phải
        <button
          onClick={goToPrev}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white text-black w-[30px] h-[30px] rounded-full"
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white text-black w-[30px] h-[30px] rounded-full"
        >
          ›
        </button> */}

        {/* Dots điều khiển */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-gray-400" : "bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
