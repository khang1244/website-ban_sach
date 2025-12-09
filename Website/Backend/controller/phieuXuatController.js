import PhieuXuat from "../models/PhieuXuat.js";
import ChiTietPhieuXuat from "../models/ChiTietPhieuXuat.js";
import ChiTietPhieuNhap from "../models/ChiTietPhieuNhap.js";
import Sach from "../models/Sach.js";
import sequelize from "../config/mysql_config.js";

// Lấy tất cả phiếu xuất
export const layTatCaPhieuXuat = async (req, res) => {
  try {
    const danhSachPhieuXuat = await PhieuXuat.findAll({
      include: [
        {
          model: ChiTietPhieuXuat,
          as: "chiTietPhieuXuats",
          include: [
            {
              model: Sach,
              attributes: ["sachID", "tenSach"],
            },
          ],
        },
      ],
      order: [["ngayXuat", "DESC"]],
    });
    res.status(200).json(danhSachPhieuXuat);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phiếu xuất:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy phiếu xuất theo ID
export const layPhieuXuatTheoID = async (req, res) => {
  try {
    const { id } = req.params;
    const phieuXuat = await PhieuXuat.findOne({
      where: { phieuXuatID: id },
      include: [
        {
          model: ChiTietPhieuXuat,
          as: "chiTietPhieuXuats",
          include: [
            {
              model: Sach,
              attributes: ["sachID", "tenSach", "tacGia"],
            },
          ],
        },
      ],
    });

    if (!phieuXuat) {
      return res.status(404).json({ message: "Không tìm thấy phiếu xuất" });
    }

    res.status(200).json(phieuXuat);
  } catch (error) {
    console.error("Lỗi khi lấy phiếu xuất:", error);
    res.status(500).json({ message: error.message });
  }
};

// Tạo phiếu xuất mới
export const taoPhieuXuat = async (req, res) => {
  try {
    const { ngayXuat, loaiXuat, ghiChu, chiTietPhieuXuats } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!chiTietPhieuXuats || chiTietPhieuXuats.length === 0) {
      return res
        .status(400)
        .json({ message: "Phải có ít nhất 1 sản phẩm trong phiếu xuất" });
    }

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const t = await sequelize.transaction();
    try {
      // Tạo phiếu xuất
      const phieuXuatMoi = await PhieuXuat.create(
        {
          ngayXuat: ngayXuat || new Date(),
          loaiXuat: loaiXuat || "bán hàng",
          ghiChu: ghiChu || null,
        },
        { transaction: t }
      );

      // Tạo chi tiết phiếu xuất và kiểm tra tồn kho
      for (const item of chiTietPhieuXuats) {
        const { sachID, soLuongXuat, donGiaBan } = item;

        // Kiểm tra tồn kho trước khi xuất
        // Tính tồn kho, loại trừ phiếu xuất đã hủy đơn
        const tongNhap = await ChiTietPhieuNhap.findAll({
          attributes: [
            [sequelize.fn("SUM", sequelize.col("soLuongNhap")), "total"],
          ],
          where: { sachID },
          raw: true,
          transaction: t,
        });

        const tongXuat = await ChiTietPhieuXuat.findAll({
          attributes: [
            [sequelize.fn("SUM", sequelize.col("soLuongXuat")), "total"],
          ],
          where: { sachID },
          raw: true,
          transaction: t,
        });

        const soLuongNhapTotal = tongNhap[0]?.total || 0;
        const soLuongXuatTotal = tongXuat[0]?.total || 0;
        const tonKhoHienTai = soLuongNhapTotal - soLuongXuatTotal;

        // Kiểm tra đủ hàng không
        if (tonKhoHienTai < soLuongXuat) {
          await t.rollback();
          const sach = await Sach.findByPk(sachID);
          return res.status(400).json({
            message: `Không đủ hàng trong kho. Sách "${
              sach?.tenSach || sachID
            }" chỉ còn ${tonKhoHienTai} cuốn`,
          });
        }

        // Tính thành tiền
        const thanhTien = soLuongXuat * donGiaBan;

        // Tạo chi tiết phiếu xuất
        await ChiTietPhieuXuat.create(
          {
            phieuXuatID: phieuXuatMoi.phieuXuatID,
            sachID,
            soLuongXuat,
            donGiaBan,
            thanhTien,
          },
          { transaction: t }
        );
      }

      await t.commit();

      res.status(201).json({
        message: "Tạo phiếu xuất thành công",
        phieuXuatID: phieuXuatMoi.phieuXuatID,
      });
    } catch (err) {
      await t.rollback();
      console.error("Lỗi transaction khi tạo phiếu xuất:", err);
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error("Lỗi khi tạo phiếu xuất:", error);
    res.status(500).json({ message: error.message });
  }
};
