import PhieuNhap from "../models/PhieuNhap.js";
import ChiTietPhieuNhap from "../models/ChiTietPhieuNhap.js";
import Sach from "../models/Sach.js";
import NguoiDung from "../models/NguoiDung.js";
import sequelize from "../config/mysql_config.js";

// Lấy tất cả phiếu nhập
export const layTatCaPhieuNhap = async (req, res) => {
  try {
    const danhSachPhieuNhap = await PhieuNhap.findAll({
      include: [
        {
          model: NguoiDung,
          as: "nguoiDung",
          attributes: ["nguoiDungID", "tenNguoiDung", "email"],
        },
        {
          model: ChiTietPhieuNhap,
          as: "chiTietPhieuNhaps",
          include: [
            {
              model: Sach,
              attributes: ["sachID", "tenSach"],
            },
          ],
        },
      ],
      order: [["ngayNhap", "DESC"]],
    });
    res.status(200).json(danhSachPhieuNhap);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phiếu nhập:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy phiếu nhập theo ID
export const layPhieuNhapTheoID = async (req, res) => {
  try {
    const { id } = req.params;
    const phieuNhap = await PhieuNhap.findOne({
      where: { phieuNhapID: id },
      include: [
        {
          model: ChiTietPhieuNhap,
          as: "chiTietPhieuNhaps",
          include: [
            {
              model: Sach,
              attributes: ["sachID", "tenSach", "tacGia"],
            },
          ],
        },
      ],
    });

    if (!phieuNhap) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    res.status(200).json(phieuNhap);
  } catch (error) {
    console.error("Lỗi khi lấy phiếu nhập:", error);
    res.status(500).json({ message: error.message });
  }
};

// Tạo phiếu nhập mới
export const taoPhieuNhap = async (req, res) => {
  try {
    const { ngayNhap, ghiChu, chiTietPhieuNhaps, nguoiDungID } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!chiTietPhieuNhaps || chiTietPhieuNhaps.length === 0) {
      return res
        .status(400)
        .json({ message: "Phải có ít nhất 1 sản phẩm trong phiếu nhập" });
    }

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const t = await sequelize.transaction();
    try {
      // Tạo phiếu nhập
      const phieuNhapMoi = await PhieuNhap.create(
        {
          nguoiDungID: nguoiDungID || null,
          ngayNhap: ngayNhap || new Date(),
          ghiChu: ghiChu || null,
        },
        { transaction: t }
      );

      // Tạo chi tiết phiếu nhập và cập nhật tồn kho
      for (const item of chiTietPhieuNhaps) {
        const { sachID, soLuongNhap, donGiaNhap } = item;

        // Tính thành tiền
        const thanhTien = soLuongNhap * donGiaNhap;

        // Tạo chi tiết phiếu nhập
        await ChiTietPhieuNhap.create(
          {
            phieuNhapID: phieuNhapMoi.phieuNhapID,
            sachID,
            soLuongNhap,
            donGiaNhap,
            thanhTien,
          },
          { transaction: t }
        );
      }

      await t.commit();

      res.status(201).json({
        message: "Tạo phiếu nhập thành công",
        phieuNhapID: phieuNhapMoi.phieuNhapID,
      });
    } catch (err) {
      await t.rollback();
      console.error("Lỗi transaction khi tạo phiếu nhập:", err);
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error("Lỗi khi tạo phiếu nhập:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tồn kho hiện tại của tất cả sách
export const layTonKho = async (req, res) => {
  try {
    // Lấy tổng nhập từ chi tiết phiếu nhập
    const tongNhap = await ChiTietPhieuNhap.findAll({
      attributes: [
        "sachID",
        [sequelize.fn("SUM", sequelize.col("soLuongNhap")), "tongSoLuongNhap"],
      ],
      group: ["sachID"],
      raw: true,
    });

    // Lấy tổng xuất từ chi tiết phiếu xuất
    const ChiTietPhieuXuat = (await import("../models/ChiTietPhieuXuat.js"))
      .default;
    const tongXuat = await ChiTietPhieuXuat.findAll({
      attributes: [
        "sachID",
        [sequelize.fn("SUM", sequelize.col("soLuongXuat")), "tongSoLuongXuat"],
      ],
      group: ["sachID"],
      raw: true,
    });

    // Lấy danh sách tất cả sách
    const danhSachSach = await Sach.findAll({
      attributes: ["sachID", "tenSach", "tacGia", "giaBan", "giaGiam"],
    });

    // Tính tồn kho cho từng sách
    const tonKho = danhSachSach.map((sach) => {
      const nhap = tongNhap.find((n) => n.sachID === sach.sachID);
      const xuat = tongXuat.find((x) => x.sachID === sach.sachID);

      const soLuongNhap = nhap ? parseInt(nhap.tongSoLuongNhap) : 0;
      const soLuongXuat = xuat ? parseInt(xuat.tongSoLuongXuat) : 0;
      const tonKhoHienTai = soLuongNhap - soLuongXuat;

      return {
        sachID: sach.sachID,
        tenSach: sach.tenSach,
        tacGia: sach.tacGia,
        giaGiam: sach.giaGiam || sach.giaBan,
        soLuongNhap,
        soLuongXuat,
        tonKho: tonKhoHienTai,
      };
    });

    res.status(200).json(tonKho);
  } catch (error) {
    console.error("Lỗi khi lấy tồn kho:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tồn kho của 1 sách cụ thể
export const layTonKhoTheoSach = async (req, res) => {
  try {
    const { sachID } = req.params;

    // Tính tổng nhập
    const tongNhap = await sequelize.query(
      `
      SELECT SUM(soLuongNhap) as tongSoLuongNhap
      FROM chi_tiet_phieu_nhap
      WHERE sachID = :sachID
    `,
      {
        replacements: { sachID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Tính tổng xuất
    const tongXuat = await sequelize.query(
      `
      SELECT SUM(soLuongXuat) as tongSoLuongXuat
      FROM chi_tiet_phieu_xuat
      WHERE sachID = :sachID
    `,
      {
        replacements: { sachID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const soLuongNhap = tongNhap[0]?.tongSoLuongNhap || 0;
    const soLuongXuat = tongXuat[0]?.tongSoLuongXuat || 0;
    const tonKhoHienTai = soLuongNhap - soLuongXuat;

    res.status(200).json({
      sachID,
      soLuongNhap: parseInt(soLuongNhap),
      soLuongXuat: parseInt(soLuongXuat),
      tonKho: parseInt(tonKhoHienTai),
    });
  } catch (error) {
    console.error("Lỗi khi lấy tồn kho theo sách:", error);
    res.status(500).json({ message: error.message });
  }
};
