import GiaoDichKho from "../models/GiaoDichKho.js";
import Sach from "../models/Sach.js";

// Nhân tất cả giao dịch kho
export const nhanTatCaGiaoDichKho = async (req, res) => {
  try {
    const giaoDichKhos = await GiaoDichKho.findAll();
    res.status(200).json(giaoDichKhos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy giao dịch kho", error: error.message });
  }
};

// Hàm để cập nhật số lượng, giá nhập, giá bán cho Sach model
const capNhatSach = async (sachID, soLuong, giaNhap, giaBan) => {
  try {
    const sach = await Sach.findByPk(sachID);
    if (!sach) {
      throw new Error("Sách không tồn tại.");
    }

    // Cập nhật thông tin sách
    sach.soLuongConLai = soLuong;
    sach.giaNhap = giaNhap;
    sach.giaBan = giaBan;

    await sach.save();
    return sach;
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    throw new Error("Đã xảy ra lỗi khi cập nhật sách.");
  }
};

// Tạo giao dịch kho mới
export const taoGiaoDichKho = async (req, res) => {
  try {
    const {
      loaiGiaoDich,
      ngayGiaoDich,
      tenSanPham,
      soLuong,
      nguoiThucHien,
      ghiChu,
      sachID,
      giaNhap,
      giaBan,
    } = req.body;

    // Giả sử bạn đã có tên sản phẩm và người thực hiện từ các bảng khác
    const newGiaoDichKho = await GiaoDichKho.create({
      loaiGiaoDich,
      ngayGiaoDich,
      tenSanPham,
      soLuong,
      nguoiThucHien,
      ghiChu,
    });

    // Cập nhật lại số lượng tồn kho, giá nhập, giá bán nếu cần thiết
    await capNhatSach(sachID, soLuong, giaNhap, giaBan);

    res.status(201).json(newGiaoDichKho);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo giao dịch kho", error: error.message });
  }
};

// Xóa giao dịch kho dựa trên ID
export const xoaGiaoDichKho = async (req, res) => {
  try {
    const { maGiaoDich } = req.params;
    const giaoDichKho = await GiaoDichKho.findByPk(maGiaoDich);
    if (!giaoDichKho) {
      return res.status(404).json({ message: "Giao dịch kho không tồn tại" });
    }
    await GiaoDichKho.destroy({ where: { maGiaoDich } });
    res.status(200).json({ message: "Giao dịch kho đã được xóa thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa giao dịch kho", error: error.message });
  }
};
