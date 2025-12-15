import DonHang from "../models/DonHang.js";
import KhachHang from "../models/KhachHang.js";

export const thongKe = async (req, res) => {
  try {
    // Thống kê tổng doanh thu từ các đơn hàng đã hoàn thành (trạng thái 'Hoàn thành')
    const tongDoanhThu = await DonHang.sum("tongTien", {
      where: { trangThai: "Hoàn thành" },
    });
    // Thống kê số lượng tài khoản người dùng đã đăng ký
    const soLuongKhachHang = await KhachHang.count();

    // Thống kê số lượng đơn hàng đã được tạo
    const soLuongDonHang = await DonHang.count();

    // Thống kê top 5 người dùng có đơn hàng nhiều nhất
    // Lấy top 5 người dùng có số lượng đơn hàng hoàn thành nhiều nhất
    const topKhachHang = await DonHang.findAll({
      attributes: [
        "khachHangID",
        // Đếm số lượng đơn hàng hoàn thành cho từng người dùng
        [
          DonHang.sequelize.fn("COUNT", DonHang.sequelize.col("donHangID")),
          "soLuongDonHang",
        ],
      ],
      where: { trangThai: "Hoàn thành" }, // Chỉ lấy các đơn hàng đã hoàn thành
      group: ["khachHangID"], // Gom nhóm theo người dùng
      order: [[DonHang.sequelize.literal("soLuongDonHang"), "DESC"]], // Sắp xếp giảm dần theo số lượng đơn hàng
      limit: 5, // Giới hạn 5 người dùng đầu tiên
      include: [
        {
          model: KhachHang,
          // Lấy thêm avatar, tên đăng nhập và email của người dùng
          attributes: ["avatar", "tenKhachHang", "email"], // Lấy thêm thông tin tên đăng nhập và email của người dùng
        },
      ],
    });
    res.json({
      tongDoanhThu: tongDoanhThu || 0,
      soLuongKhachHang,
      soLuongDonHang,
      topKhachHang,
    });
  } catch (error) {
    console.error("Lỗi khi thống kê dữ liệu:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thống kê dữ liệu." });
  }
};
