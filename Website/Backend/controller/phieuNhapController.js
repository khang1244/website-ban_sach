import PhieuNhap from "../models/PhieuNhap.js";
import ChiTietPhieuNhap from "../models/ChiTietPhieuNhap.js";
import ChiTietPhieuXuat from "../models/ChiTietPhieuXuat.js";
import Sach from "../models/Sach.js";
import NguoiDung from "../models/NguoiDung.js";
import sequelize from "../config/mysql_config.js";

// Lấy tất cả phiếu nhập
export const layTatCaPhieuNhap = async (req, res) => {
  try {
    // Lấy tất cả phiếu nhập, kèm thông tin người dùng và chi tiết phiếu nhập
    const danhSach = await PhieuNhap.findAll({
      include: [
        {
          model: NguoiDung, // Lấy thông tin người nhập
          as: "nguoiDung",
          attributes: ["nguoiDungID", "tenNguoiDung", "email"],
        },
        {
          model: ChiTietPhieuNhap, // Lấy chi tiết phiếu nhập
          as: "chiTietPhieuNhaps",
          include: [
            { model: Sach, attributes: ["sachID", "tenSach"] }, // Lấy tên sách cho từng chi tiết
          ],
        },
      ],
    });
    res.status(200).json(danhSach); // Trả về danh sách phiếu nhập
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu nhập" });
  }
};

// Lấy phiếu nhập theo ID
export const layPhieuNhapTheoID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ URL
    // Tìm phiếu nhập theo id, kèm chi tiết và thông tin sách
    const phieuNhap = await PhieuNhap.findOne({
      where: { phieuNhapID: id },
      include: [
        {
          model: ChiTietPhieuNhap,
          as: "chiTietPhieuNhaps",
          include: [
            { model: Sach, attributes: ["sachID", "tenSach", "tacGia"] },
          ],
        },
      ],
    });
    // Kiểm tra nếu không tìm thấy phiếu nhập
    if (!phieuNhap)
      // Nếu không tìm thấy
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    res.status(200).json(phieuNhap); // Trả về phiếu nhập
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy phiếu nhập" });
  }
};

// Tạo phiếu nhập mới
export const taoPhieuNhap = async (req, res) => {
  const { ngayNhap, ghiChu, chiTietPhieuNhaps, nguoiDungID } = req.body;

  // 1. Phải có ít nhất 1 sách
  if (!Array.isArray(chiTietPhieuNhaps) || chiTietPhieuNhaps.length === 0) {
    return res.status(400).json({
      message: "Phiếu nhập phải có ít nhất 1 sách",
    });
  }
  // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
  const t = await sequelize.transaction();

  try {
    // 2. Tạo phiếu nhập (hóa đơn)
    const phieuNhap = await PhieuNhap.create(
      {
        nguoiDungID: nguoiDungID || null,
        ngayNhap: ngayNhap || new Date(),
        ghiChu: ghiChu || null,
      },
      { transaction: t }
    );

    // 3. Tạo chi tiết phiếu nhập
    for (const item of chiTietPhieuNhaps) {
      const { sachID, soLuongNhap, donGiaNhap } = item;
      // Tạo từng chi tiết phiếu nhập
      await ChiTietPhieuNhap.create(
        {
          phieuNhapID: phieuNhap.phieuNhapID,
          sachID,
          soLuongNhap,
          donGiaNhap,
          thanhTien: soLuongNhap * donGiaNhap,
        },
        { transaction: t }
      );
    }

    // 4. Lưu tất cả
    await t.commit();
    // Trả về kết quả thành công
    return res.status(201).json({
      message: "Tạo phiếu nhập thành công",
      phieuNhapID: phieuNhap.phieuNhapID,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Lỗi khi tạo phiếu nhập",
    });
  }
};

// Lấy tồn kho hiện tại của tất cả sách
export const layTonKho = async (req, res) => {
  try {
    // 1. Lấy danh sách sách
    const danhSachSach = await Sach.findAll({
      attributes: [
        "sachID",
        "tenSach",
        "tacGia",
        "giaBan",
        "giaGiam",
        "trangThaiBan",
      ],
    });

    const ketQua = [];

    // 2. Tính tồn kho từng sách
    for (const sach of danhSachSach) {
      // Tổng nhập
      const tongNhap = await ChiTietPhieuNhap.sum("soLuongNhap", {
        where: { sachID: sach.sachID },
      });

      // Tổng xuất
      const tongXuat = await ChiTietPhieuXuat.sum("soLuongXuat", {
        where: { sachID: sach.sachID },
      });

      const soLuongNhap = tongNhap || 0;
      const soLuongXuat = tongXuat || 0;

      ketQua.push({
        sachID: sach.sachID,
        tenSach: sach.tenSach,
        tacGia: sach.tacGia,
        giaGiam: sach.giaGiam || sach.giaBan,
        trangThaiBan: Boolean(sach.trangThaiBan),
        soLuongNhap,
        soLuongXuat,
        tonKho: soLuongNhap - soLuongXuat,
      });
    }

    return res.status(200).json(ketQua);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy tồn kho",
    });
  }
};

// Lấy tồn kho của 1 sách cụ thể
export const layTonKhoTheoSach = async (req, res) => {
  try {
    const { sachID } = req.params;

    // Tổng số lượng nhập
    const tongNhap = await ChiTietPhieuNhap.sum("soLuongNhap", {
      where: { sachID },
    });

    // Tổng số lượng xuất
    const tongXuat = await ChiTietPhieuXuat.sum("soLuongXuat", {
      where: { sachID },
    });

    const soLuongNhap = tongNhap || 0;
    const soLuongXuat = tongXuat || 0;

    return res.status(200).json({
      sachID,
      soLuongNhap,
      soLuongXuat,
      tonKho: soLuongNhap - soLuongXuat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy tồn kho theo sách",
    });
  }
};
