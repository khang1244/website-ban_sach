import BinhLuan from "../models/BinhLuan.js";
import KhachHang from "../models/KhachHang.js";

// Nhận tất cả các bình luận
export const nhanTatCaBinhLuan = async (req, res) => {
  try {
    const binhLuans = await BinhLuan.findAll();
    res.status(200).json(binhLuans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nhận danh sách các bình luận dựa trên sachID (sách ID)
export const nhanBinhLuanTheoSachID = async (req, res) => {
  const { sachID } = req.params;
  try {
    const binhLuans = await BinhLuan.findAll({
      // Chỉ lấy những bình luận đã được duyệt để hiển thị ở phần chi tiết sản phẩm
      where: { sachID, duyet: true },
      include: [
        {
          model: KhachHang,
          attributes: ["email"], // chỉ lấy email
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    // Chuyển đổi dữ liệu để bao gồm email từ bảng KhachHang
    const data = binhLuans.map((bl) => ({
      ...bl.toJSON(),
      email: bl.KhachHang?.email || null,
    }));

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo bình luận mới
export const taoBinhLuan = async (req, res) => {
  const { sachID, khachHangID, noiDung, danhGia } = req.body;
  try {
    const binhLuan = await BinhLuan.create({
      sachID,
      khachHangID,
      noiDung,
      danhGia,
      // Mặc định khi người dùng tạo bình luận chưa được duyệt
      duyet: false,
    });
    res.status(201).json(binhLuan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bình luận dựa trên binhLuanID (bình luận ID)
export const xoaBinhLuan = async (req, res) => {
  const { binhLuanID } = req.params;
  try {
    const deleted = await BinhLuan.destroy({ where: { binhLuanID } });
    if (deleted) {
      res.status(200).json({ message: "Bình luận đã được xóa" });
    } else {
      res.status(404).json({ message: "Không tìm thấy bình luận" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái duyệt của bình luận (duyệt/huỷ duyệt)
export const capNhatTrangThaiDuyet = async (req, res) => {
  const { binhLuanID } = req.params;
  const { duyet } = req.body;
  try {
    const [updatedCount] = await BinhLuan.update(
      { duyet },
      { where: { binhLuanID } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    const updated = await BinhLuan.findOne({ where: { binhLuanID } });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
