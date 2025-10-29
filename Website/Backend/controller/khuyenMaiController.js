import KhuyenMai from "../models/KhuyenMai.js";

// Nhận tất cả khuyến mãi
export const nhanTatCaMaKhuyenMai = async (req, res) => {
  try {
    const khuyenMais = await KhuyenMai.findAll();
    res.status(200).json(khuyenMais);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy khuyến mãi", error: error.message });
  }
};

// Tạo khuyến mãi mới
export const taoMaKhuyenMai = async (req, res) => {
  try {
    const { khuyenMaiID, giaTriGiam, moTa, ngayHetHan, soLuong, giaCoBan } =
      req.body;
    const newKhuyenMai = await KhuyenMai.create({
      khuyenMaiID,
      giaTriGiam,
      moTa,
      ngayHetHan,
      soLuong,
      giaCoBan,
      trangThai: true, // Mặc định khuyến mãi còn hiệu lực
    });
    res.status(201).json(newKhuyenMai);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo khuyến mãi", error: error.message });
  }
};

// Cập nhật khuyến mãi
export const capNhatMaKhuyenMai = async (req, res) => {
  try {
    const { khuyenMaiID } = req.params;
    const { giaTriGiam, moTa, ngayHetHan, soLuong, giaCoBan, trangThai } =
      req.body;

    const khuyenMai = await KhuyenMai.findByPk(khuyenMaiID);
    if (!khuyenMai) {
      return res.status(404).json({ message: "Khuyến mãi không tồn tại" });
    }

    await KhuyenMai.update(
      {
        khuyenMaiID,
        giaTriGiam,
        moTa,
        ngayHetHan,
        soLuong,
        giaCoBan,
        trangThai,
      },
      {
        where: { khuyenMaiID },
      }
    );

    res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật khuyến mãi", error: error.message });
  }
};

// Xóa khuyến mãi
export const xoaMaKhuyenMai = async (req, res) => {
  try {
    const { khuyenMaiID } = req.params;
    const khuyenMai = await KhuyenMai.findByPk(khuyenMaiID);
    if (!khuyenMai) {
      return res.status(404).json({ message: "Khuyến mãi không tồn tại" });
    }

    await KhuyenMai.destroy({ where: { khuyenMaiID } });

    res.status(200).json({ message: "Xóa khuyến mãi thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa khuyến mãi", error: error.message });
  }
};
// Nhận khuyến mãi theo ID
export const nhanMaKhuyenMaiTheoID = async (req, res) => {
  try {
    const { khuyenMaiID } = req.params;
    const khuyenMai = await KhuyenMai.findByPk(khuyenMaiID);
    if (!khuyenMai) {
      return res
        .status(404)
        .json({ message: "Khuyến mãi không tồn tại", success: false });
    }
    res.status(200).json({
      message: "Lấy khuyến mãi thành công",
      success: true,
      khuyenMai: khuyenMai,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy khuyến mãi",
      error: error.message,
    });
  }
};
