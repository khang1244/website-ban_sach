import DanhMucSach from "../models/DanhMucSach.js";
import Sach from "../models/Sach.js";

// Lấy tất cả các danh mục sách
export const nhanTatCaDanhMucSach = async (req, res) => {
  try {
    const danhMucSachs = await DanhMucSach.findAll();
    res.json(danhMucSachs);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh mục sách." });
  }
};

// Tạo một danh mục sách mới
export const taoDanhMucSachMoi = async (req, res) => {
  try {
    const { tenDanhMuc } = req.body;
    const danhMucSachMoi = await DanhMucSach.create({ tenDanhMuc });
    res.status(201).json(danhMucSachMoi);
  } catch (error) {
    console.error("Lỗi khi tạo danh mục sách mới:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi tạo danh mục sách mới." });
  }
};

// Cập nhật một danh mục sách dựa trên ID
export const capNhatDanhMucSach = async (req, res) => {
  try {
    const { danhMucSachID } = req.params;
    const { tenDanhMuc } = req.body;
    const danhMucSach = await DanhMucSach.findByPk(danhMucSachID); // danhMucSach = {dsadfsdfd} => true, danhMucSach = null || "" => false
    if (!danhMucSach) {
      return res.status(404).json({ error: "Danh mục sách không tồn tại." });
    }
    danhMucSach.tenDanhMuc = tenDanhMuc;
    await danhMucSach.save();
    res.json(danhMucSach);
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục sách:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi cập nhật danh mục sách." });
  }
};

// Xóa một danh mục sách dựa trên ID
export const xoaDanhMucSach = async (req, res) => {
  try {
    const { danhMucSachID } = req.params;
    const danhMucSach = await DanhMucSach.findByPk(danhMucSachID);
    if (!danhMucSach) {
      return res.status(404).json({ error: "Danh mục sách không tồn tại." });
    }
    await danhMucSach.destroy();
    res.json({ message: "Danh mục sách đã được xóa." });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xóa danh mục sách." });
  }
};
