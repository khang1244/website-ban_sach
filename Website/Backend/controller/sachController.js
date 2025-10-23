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
// Hàm để thêm một quyển sách vào cửa hàng
export const taoSachMoi = async (req, res) => {
  try {
    const {
      tenSach,
      tacGia,
      nhaXuatBan,
      ngayXuatBan,
      ngonNgu,
      danhMucSachID,
      soTrang,
      dinhDang,
      soLuongConLai,
      giaNhap,
      giaBan,
      giaGiam,
      images,
    } = req.body;

    const sachMoi = await Sach.create({
      tenSach,
      tacGia,
      nhaXuatBan,
      ngayXuatBan,
      ngonNgu,
      danhMucSachID,
      soTrang,
      dinhDang,
      soLuongConLai,
      giaNhap,
      giaBan,
      giaGiam,
      images: JSON.stringify(images), // Lưu mảng dưới dạng chuỗi JSON
    });
    res.status(201).json(sachMoi);
  } catch (error) {
    console.error("Lỗi khi tạo sách mới:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi tạo sách mới." });
  }
};

// Hàm để cập nhật thông tin một quyển sách dựa trên ID của quyển sách  - DESTRUCTURING
export const capNhatSach = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tenSach,
      tacGia,
      nhaXuatBan,
      ngayXuatBan,
      ngonNgu,
      danhMucSachID,
      soTrang,
      dinhDang,
      soLuongConLai,
      giaNhap,
      giaBan,
      giaGiam,
      images,
    } = req.body;

    const sach = await Sach.findByPk(id);
    if (!sach) {
      return res.status(404).json({ error: "Sách không tồn tại." });
    }

    // Cập nhật thông tin sách
    sach.tenSach = tenSach;
    sach.tacGia = tacGia;
    sach.nhaXuatBan = nhaXuatBan;
    sach.ngayXuatBan = ngayXuatBan;
    sach.ngonNgu = ngonNgu;
    sach.danhMucSachID = danhMucSachID;
    sach.soTrang = soTrang;
    sach.dinhDang = dinhDang;
    sach.soLuongConLai = soLuongConLai;
    sach.giaNhap = giaNhap;
    sach.giaBan = giaBan;
    sach.giaGiam = giaGiam;
    sach.images = JSON.stringify(images); // Lưu mảng dưới dạng chuỗi JSON

    await sach.save();
    res.json(sach);
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật sách." });
  }
};

// Các hàm khác như xóa sách, tìm kiếm sách có thể được thêm vào đây
export const xoaSach = async (req, res) => {
  try {
    const { id } = req.params;
    const sach = await Sach.findByPk(id);
    if (!sach) {
      return res.status(404).json({ error: "Sách không tồn tại." });
    }
    await sach.destroy();
    res.json({ message: "Sách đã được xóa thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xóa sách." });
  }
};
// Hàm để lấy thông tin chi tiết của một quyển sách dựa trên ID của quyển sách
export const layChiTietSach = async (req, res) => {
  try {
    const { sachID } = req.params;
    const sach = await Sach.findByPk(sachID);
    if (!sach) {
      return res.status(404).json({ error: "Sách không tồn tại." });
    }
    res.json(sach);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy chi tiết sách." });
  }
};
