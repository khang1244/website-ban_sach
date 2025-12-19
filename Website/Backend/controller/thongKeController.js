import DonHang from "../models/DonHang.js";
import NguoiDung from "../models/NguoiDung.js";

export const thongKe = async (req, res) => {
  try {
    // Thống kê tổng doanh thu (chỉ tiền hàng, bỏ khuyến mãi/vận chuyển)
    const tongDoanhThuRaw = await DonHang.findAll({
      attributes: [
        [
          DonHang.sequelize.fn(
            "SUM",
            DonHang.sequelize.fn(
              "COALESCE",
              DonHang.sequelize.col("tongTienBanDau"),
              DonHang.sequelize.col("tongTien")
            )
          ),
          "tongDoanhThu",
        ],
      ],
      where: { trangThai: "Hoàn thành" },
      raw: true,
    });
    const tongDoanhThu = Number(tongDoanhThuRaw?.[0]?.tongDoanhThu) || 0;
    // Thống kê số lượng tài khoản người dùng đã đăng ký
    const soLuongNguoiDung = await NguoiDung.count();

    // Thống kê số lượng đơn hàng đã được tạo
    const soLuongDonHang = await DonHang.count();

    // Thống kê top 5 người dùng có đơn hàng nhiều nhất
    // Lấy top 5 người dùng có số lượng đơn hàng hoàn thành nhiều nhất
    const topNguoiDung = await DonHang.findAll({
      attributes: [
        "nguoiDungID",
        // Đếm số lượng đơn hàng hoàn thành cho từng người dùng
        [
          DonHang.sequelize.fn("COUNT", DonHang.sequelize.col("donHangID")),
          "soLuongDonHang",
        ],
      ],
      where: { trangThai: "Hoàn thành" }, // Chỉ lấy các đơn hàng đã hoàn thành
      group: ["nguoiDungID"], // Gom nhóm theo người dùng
      order: [[DonHang.sequelize.literal("soLuongDonHang"), "DESC"]], // Sắp xếp giảm dần theo số lượng đơn hàng
      limit: 5, // Giới hạn 5 người dùng đầu tiên
      include: [
        {
          model: NguoiDung,
          // Lấy thêm avatar, tên đăng nhập và email của người dùng
          attributes: ["avatar", "tenNguoiDung", "email"], // Lấy thêm thông tin tên đăng nhập và email của người dùng
        },
      ],
    });
    res.json({
      tongDoanhThu: tongDoanhThu || 0,
      soLuongNguoiDung,
      soLuongDonHang,
      topNguoiDung,
    });
  } catch (error) {
    console.error("Lỗi khi thống kê dữ liệu:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thống kê dữ liệu." });
  }
};

// Doanh thu theo tháng: chỉ tính tiền hàng (ưu tiên tongTienBanDau nếu có), bỏ qua mã khuyến mãi và phí vận chuyển
export const thongKeDoanhThuTheoThang = async (req, res) => {
  try {
    const doanhThu = await DonHang.findAll({
      attributes: [
        [DonHang.sequelize.fn("YEAR", DonHang.sequelize.col("ngayDat")), "nam"],
        [
          DonHang.sequelize.fn("MONTH", DonHang.sequelize.col("ngayDat")),
          "thang",
        ],
        [
          DonHang.sequelize.fn(
            "SUM",
            DonHang.sequelize.fn(
              "COALESCE",
              DonHang.sequelize.col("tongTienBanDau"),
              DonHang.sequelize.col("tongTien")
            )
          ),
          "doanhThu",
        ],
      ],
      where: { trangThai: "Hoàn thành" },
      group: [
        DonHang.sequelize.fn("YEAR", DonHang.sequelize.col("ngayDat")),
        DonHang.sequelize.fn("MONTH", DonHang.sequelize.col("ngayDat")),
      ],
      order: [
        [DonHang.sequelize.fn("YEAR", DonHang.sequelize.col("ngayDat")), "ASC"],
        [
          DonHang.sequelize.fn("MONTH", DonHang.sequelize.col("ngayDat")),
          "ASC",
        ],
      ],
      raw: true,
    });

    const data = doanhThu.map((item) => ({
      thang: `Tháng ${item.thang}/${item.nam}`,
      doanhThu: Number(item.doanhThu) || 0,
    }));

    return res.json({ success: true, data });
  } catch (error) {
    console.error("Lỗi khi thống kê doanh thu theo tháng:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thống kê doanh thu theo tháng.",
    });
  }
};
