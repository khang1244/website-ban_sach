import PhieuXuat from "../models/PhieuXuat.js";
import ChiTietPhieuXuat from "../models/ChiTietPhieuXuat.js";
import ChiTietPhieuNhap from "../models/ChiTietPhieuNhap.js";
import Sach from "../models/Sach.js";
import sequelize from "../config/mysql_config.js";

// Lấy tất cả phiếu xuất
export const layTatCaPhieuXuat = async (req, res) => {
  try {
    // Lấy tất cả phiếu xuất, kèm chi tiết phiếu xuất và thông tin sách
    const danhSach = await PhieuXuat.findAll({
      include: [
        {
          model: ChiTietPhieuXuat, // Lấy model chi tiết phiếu xuất
          as: "chiTietPhieuXuats", // Tên alias khi khai báo association
          include: [
            { model: Sach, attributes: ["sachID", "tenSach"] }, // Lấy tên sách cho từng chi tiết
          ],
        },
      ],
    });
    res.status(200).json(danhSach); // Trả về danh sách phiếu xuất
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu xuất" });
  }
};

// Lấy phiếu xuất theo ID
export const layPhieuXuatTheoID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ URL
    // Tìm phiếu xuất theo id, kèm chi tiết và thông tin sách
    const phieuXuat = await PhieuXuat.findOne({
      where: { phieuXuatID: id },
      include: [
        {
          model: ChiTietPhieuXuat,
          as: "chiTietPhieuXuats",
          include: [
            { model: Sach, attributes: ["sachID", "tenSach", "tacGia"] },
          ],
        },
      ],
    });
    if (!phieuXuat)
      // Nếu không tìm thấy
      return res.status(404).json({ message: "Không tìm thấy phiếu xuất" });
    res.status(200).json(phieuXuat); // Trả về phiếu xuất
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy phiếu xuất" });
  }
};

// Tạo phiếu xuất mới
export const taoPhieuXuat = async (req, res) => {
  const { ngayXuat, loaiXuat, ghiChu, chiTietPhieuXuats } = req.body;

  if (!Array.isArray(chiTietPhieuXuats) || chiTietPhieuXuats.length === 0) {
    return res.status(400).json({
      message: "Phải có ít nhất 1 sản phẩm trong phiếu xuất",
    });
  }
  // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
  const t = await sequelize.transaction();

  try {
    // 1. KIỂM TRA TỒN KHO TRƯỚC
    for (const item of chiTietPhieuXuats) {
      // Lấy thông tin sách và số lượng xuất từ từng mục
      const { sachID, soLuongXuat } = item;
      // Tính tổng số lượng nhập của sách này
      const tongNhap = await ChiTietPhieuNhap.sum("soLuongNhap", {
        where: { sachID },
        transaction: t,
      });
      // Tính tổng số lượng xuất của sách này
      const tongXuat = await ChiTietPhieuXuat.sum("soLuongXuat", {
        where: { sachID },
        transaction: t,
      });
      //
      const tonKho = (tongNhap || 0) - (tongXuat || 0);
      // Kiểm tra nếu tồn kho không đủ
      if (tonKho < soLuongXuat) {
        const sach = await Sach.findByPk(sachID);
        await t.rollback();
        return res.status(400).json({
          message: `Sách "${sach?.tenSach}" chỉ còn ${tonKho} cuốn`,
        });
      }
    }

    // 2. TẠO PHIẾU XUẤT
    const phieuXuat = await PhieuXuat.create(
      {
        ngayXuat: ngayXuat || new Date(),
        loaiXuat: loaiXuat || "bán hàng",
        ghiChu: ghiChu || null,
      },
      { transaction: t }
    );

    // 3. TẠO CHI TIẾT PHIẾU XUẤT
    for (const item of chiTietPhieuXuats) {
      const { sachID, soLuongXuat, donGiaBan } = item;
      // Tạo chi tiết phiếu xuất
      await ChiTietPhieuXuat.create(
        {
          phieuXuatID: phieuXuat.phieuXuatID,
          sachID,
          soLuongXuat,
          donGiaBan,
          thanhTien: soLuongXuat * donGiaBan,
        },
        { transaction: t }
      );
    }
    // lưu tất cả thay đổi
    await t.commit();
    // Trả về kết quả thành công
    return res.status(201).json({
      message: "Tạo phiếu xuất thành công",
      phieuXuatID: phieuXuat.phieuXuatID,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Lỗi khi tạo phiếu xuất",
    });
  }
};
