import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/mysql_config.js";
import SachRoutes from "./routes/SachRoutes.js";
import DanhMucSachRoutes from "./routes/DanhMucSachRoutes.js";
import DonHangRoutes from "./routes/DonHangRoutes.js";
import NguoiDungRoutes from "./routes/NguoiDungRoutes.js";
import BinhLuanRoutes from "./routes/BinhLuanRoutes.js";
import KhuyenMaiRoutes from "./routes/KhuyenMaiRoutes.js";
import GiaoDichKhoRoutes from "./routes/GiaoDichKhoRoutes.js";

//Đồng bộ và cập nhật cấu trúc bảng khi có thay đổi
// await sequelize.sync({ alter: true });
// console.log("Đã cập nhật cấu trúc bảng!");

// Đọc biến môi trường từ file .env
dotenv.config();

//Khởi tạo Express app
const app = express();

//Sử dụng các Middleware cân thiết
app.use(cors());
app.use(express.json());

//kiểm tra kết nối với database Mysql thông qua Sequelize
sequelize
  .authenticate()
  .then(() => console.log("Kết nối DB thành công"))
  .catch((err) => console.log("Kết nối DB thất bại", err));

//Định nghĩa các route API
app.get("/", (req, res) => {
  res.send("Chào mừng đến với API của Website Bán Sách!");
});
// Sử dụng routes sach
app.use("/api/sach", SachRoutes); // Sử dụng routes sach

app.use("/api/danhMucSach", DanhMucSachRoutes); // Sử dụng routes danhMucSach

app.use("/api/donHang", DonHangRoutes); // Sử dụng routes donHang

app.use("/api/nguoiDung", NguoiDungRoutes); // Sử dụng routes nguoiDung1

app.use("/api/binhLuan", BinhLuanRoutes); // Sử dụng routes binhLuan

app.use("/api/khuyenMai", KhuyenMaiRoutes); // Sử dụng routes khuyenMai

app.use("/api/giaoDichKho", GiaoDichKhoRoutes); // Sử dụng routes giaoDichKho

// lắng nge kết nối trên cổng 3001 hoặc cổng được chỉ định trong biến môi trường
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

// //Đồng bộ hóa các mô hình với cơ sở dữ liệu
sequelize
  .sync()
  .then(() => {
    console.log("Tất cả các mô hình đã được đồng bộ hóa với cơ sở dữ liệu.");
  })
  .catch((err) => {
    console.error("Lỗi đồng bộ hóa mô hình với cơ sở dữ liệu:", err);
  });
