import DonHang, { DonHang_Sach } from "../models/DonHang.js";
import Sach from "../models/Sach.js";
import sequelize from "../config/mysql_config.js";
import GiaoDichKho from "../models/GiaoDichKho.js";

// Nhận tất cả đơn hàng
export const nhanTatCaDonHang = async (req, res) => {
  try {
    const donHangs = await DonHang.findAll({
      include: [
        {
          model: Sach,
          through: { attributes: ["soLuong", "donGia"] }, // Lấy thêm thông tin số lượng và đơn giá từ bảng trung gian
        },
      ],
    });
    res.status(200).json(donHangs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo đơn hàng mới
export const taoDonHangMoi = async (req, res) => {
  try {
    const {
      nguoiDungID,
      tenKhachHang,
      soDienThoaiKH,
      ngayDat,
      tongTien,
      trangThai,
      diaChiGiaoHang,
      phuongThucThanhToan,
      phuongThucGiaoHangID,
      ghiChu,
      items, // { sachID, soLuong, donGia }
    } = req.body;

    // Dùng transaction để đảm bảo atomic
    const t = await sequelize.transaction();
    try {
      // Tạo đơn hàng mới
      const donHangMoi = await DonHang.create(
        {
          nguoiDungID,
          tenKhachHang,
          soDienThoaiKH,
          ngayDat,
          tongTien,
          trangThai,
          diaChiGiaoHang,
          phuongThucThanhToan,
          phuongThucGiaoHangID,
          ghiChu,
        },
        { transaction: t }
      );

      // Thêm các sách vào đơn hàng với số lượng và đơn giá tương ứng
      for (const item of items) {
        // Lấy sách hiện tại
        const sach = await Sach.findOne({
          where: { sachID: item.sachID },
          transaction: t,
          lock: t.LOCK ? t.LOCK.UPDATE : undefined,
        });

        if (!sach) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: `Sách ${item.sachID} không tồn tại` });
        }

        const soLuongTruoc = sach.soLuongConLai || 0;
        const soLuongSau = soLuongTruoc - Number(item.soLuong);
        if (soLuongSau < 0) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: `Số lượng sách '${sach.tenSach}' không đủ` });
        }

        // Cập nhật tồn kho
        sach.soLuongConLai = soLuongSau;
        await sach.save({ transaction: t });

        // Thêm vào bảng trung gian DonHang_Sach
        await DonHang_Sach.create(
          {
            donHangID: donHangMoi.donHangID,
            sachID: item.sachID,
            soLuong: item.soLuong,
            donGia: item.donGia,
          },
          { transaction: t }
        );

        // Tạo giao dịch kho (xuất kho do bán)
        await GiaoDichKho.create(
          {
            loaiGiaoDich: "xuất",
            ngayGiaoDich: ngayDat || new Date(),
            tenSanPham: sach.tenSach,
            soLuong: item.soLuong,
            nguoiThucHien:
              tenKhachHang || (nguoiDungID ? String(nguoiDungID) : "khách"),
            ghiChu: `Đơn hàng #${donHangMoi.donHangID}`,
            sachID: item.sachID,
            soLuongTruoc,
            soLuongSau,
            giaBan: item.donGia,
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(201).json({
        message: "Tạo đơn hàng thành công",
        donHangID: donHangMoi.donHangID,
      });
    } catch (err) {
      await t.rollback();
      console.error("Lỗi khi xử lý tạo đơn với transaction:", err);
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng mới:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const capNhatTrangThaiDonHang = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ tham số URL
    const { trangThai } = req.body; // Lấy trạng thái mới từ body yêu cầu

    // Cập nhật trạng thái đơn hàng
    await DonHang.update({ trangThai }, { where: { donHangID: id } });

    res
      .status(200)
      .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: error.message });
  }
};
// Nhận đơn hàng theo tài khoản người dùng
export const nhanDonHangCuaNguoiDung = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;
    const donHangs = await DonHang.findAll({
      where: { nguoiDungID },
      include: [
        {
          model: Sach,
          through: { attributes: ["soLuong", "donGia"] }, // Lấy thêm thông tin số lượng và đơn giá từ bảng trung gian
        },
      ],
    });
    res.status(200).json(donHangs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nhận đơn hàng theo ID
export const nhanDonHangTheoID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ tham số URL

    const donHang = await DonHang.findOne({
      where: { donHangID: id },
      include: [
        {
          model: Sach,
          through: { attributes: ["soLuong", "donGia"] },
        },
      ],
    });

    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(donHang);
  } catch (error) {
    console.error("Lỗi khi nhận đơn hàng theo ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa đơn hàng theo ID
export const xoaDonHangTheoID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ tham số URL
    const donHang = await DonHang.findOne({ where: { donHangID: id } });

    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    await donHang.destroy();
    res.status(200).json({ message: "Đơn hàng đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng theo ID:", error);
    res.status(500).json({ message: error.message });
  }
};
