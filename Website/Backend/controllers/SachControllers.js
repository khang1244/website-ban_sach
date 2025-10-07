import Sach from "../models/Sach.js";

// Lấy tất cả các quyền sách
export const nhanTatCaCacQuyenSach = async (req, res) => {
  try {
    const danhSachSach = await Sach.findAll(); // SELECT * FROM Sach
    res.json(danhSachSach);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách sách." });
  }
};
