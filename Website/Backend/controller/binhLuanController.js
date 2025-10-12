import BinhLuan from "../models/BinhLuan.js";

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
    const binhLuans = await BinhLuan.findAll({ where: { sachID } });
    res.status(200).json(binhLuans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo bình luận mới
export const taoBinhLuan = async (req, res) => {
  const { sachID, nguoiDungID, noiDung, danhGia } = req.body;
  try {
    const binhLuan = await BinhLuan.create({
      sachID,
      nguoiDungID,
      noiDung,
      danhGia,
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
