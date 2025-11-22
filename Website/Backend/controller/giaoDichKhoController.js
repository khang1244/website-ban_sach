import GiaoDichKho from "../models/GiaoDichKho.js";
import Sach from "../models/Sach.js";

// Nhân tất cả giao dịch kho
export const nhanTatCaGiaoDichKho = async (req, res) => {
  try {
    // Hỗ trợ lọc theo sachID và phân trang
    const { sachID, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 20);

    const where = {};
    if (sachID) where.sachID = Number(sachID);

    const offset = (pageNum - 1) * pageSize;

    const { count, rows } = await GiaoDichKho.findAndCountAll({
      where,
      order: [["ngayGiaoDich", "DESC"]],
      limit: pageSize,
      offset,
    });

    res.status(200).json({
      total: count,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.max(1, Math.ceil(count / pageSize)),
      data: rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy giao dịch kho", error: error.message });
  }
};

// Hàm để cập nhật số lượng tồn kho (tăng hoặc giảm) và cập nhật giá nếu cần
// delta: số lượng thay đổi (dương = nhập, âm = xuất)
const capNhatSach = async (sachID, delta, giaNhap, giaBan) => {
  try {
    const sach = await Sach.findByPk(sachID);
    if (!sach) {
      throw new Error("Sách không tồn tại.");
    }

    const newSoLuong = (sach.soLuongConLai || 0) + Number(delta);
    if (newSoLuong < 0) {
      throw new Error("Số lượng tồn kho không đủ.");
    }

    sach.soLuongConLai = newSoLuong;
    // Nếu có giá nhập/giá bán truyền lên thì cập nhật
    if (typeof giaNhap !== "undefined") sach.giaNhap = giaNhap;
    if (typeof giaBan !== "undefined") sach.giaBan = giaBan;

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
    // Kiểm tra dữ liệu bắt buộc
    if (!sachID) {
      return res.status(400).json({ message: "Thiếu sachID." });
    }

    // Tính delta dựa trên loại giao dịch (nhập tăng, xuất giảm)
    const loai = (loaiGiaoDich || "").toString().toLowerCase();
    let delta = 0;
    if (
      loai.includes("nhap") ||
      loai.includes("nhập") ||
      loai.includes("import")
    ) {
      delta = Number(soLuong);
    } else if (
      loai.includes("xuat") ||
      loai.includes("xuất") ||
      loai.includes("export")
    ) {
      delta = -Number(soLuong);
    } else {
      // Nếu không xác định, mặc định lấy delta = soLuong (tăng)
      delta = Number(soLuong);
    }

    // Lấy thông tin sách trước khi cập nhật để ghi lại soLuongTruoc
    const sach = await Sach.findByPk(sachID);
    if (!sach) {
      return res.status(400).json({ message: "Sách không tồn tại." });
    }
    const soLuongTruoc = sach.soLuongConLai || 0;

    // Cập nhật tồn kho (nếu lỗi sẽ ném exception)
    const updatedSach = await capNhatSach(sachID, delta, giaNhap, giaBan);

    // Quy tắc hiển thị người thực hiện: nếu là giao dịch 'nhập' chỉ hiện admin,
    // còn 'xuất' thì hiển thị tên người dùng (nếu có)
    const loaiNorm = (loaiGiaoDich || "").toString().toLowerCase();
    let nguoiHienThi = nguoiThucHien;
    if (
      loaiNorm.includes("nhap") ||
      loaiNorm.includes("nhập") ||
      loaiNorm.includes("import")
    ) {
      nguoiHienThi = "Quản trị viên";
    } else if (
      loaiNorm.includes("xuat") ||
      loaiNorm.includes("xuất") ||
      loaiNorm.includes("export")
    ) {
      nguoiHienThi = nguoiThucHien || "Khách";
    } else {
      nguoiHienThi = nguoiThucHien || "Quản trị viên";
    }

    const newGiaoDichKho = await GiaoDichKho.create({
      loaiGiaoDich,
      ngayGiaoDich,
      tenSanPham,
      soLuong,
      nguoiThucHien: nguoiHienThi,
      ghiChu,
      sachID: Number(sachID),
      soLuongTruoc,
      soLuongSau: updatedSach.soLuongConLai,
      giaNhap: typeof giaNhap !== "undefined" ? giaNhap : null,
      giaBan: typeof giaBan !== "undefined" ? giaBan : null,
    });

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
