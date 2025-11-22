import Sach from "../models/Sach.js";
import HinhAnh from "../models/HinhAnh.js";

// Ngưỡng cảnh báo tồn kho (hardcoded, không dùng .env theo yêu cầu)
const LOW_STOCK_THRESHOLD = 5;

const computeStockStatus = (soLuongConLai) => {
  const qty = Number(soLuongConLai || 0);
  if (qty <= 0) return "out";
  if (qty <= LOW_STOCK_THRESHOLD) return "low";
  return "available";
};

// Lấy tất cả các quyền sách
export const nhanTatCaCacQuyenSach = async (req, res) => {
  try {
    const danhSachSach = await Sach.findAll(); // SELECT * FROM Sach
    // Đính kèm ảnh từ HinhAnh cho mỗi sách
    for (const s of danhSachSach) {
      const imgs = await HinhAnh.findAll({ where: { sachID: s.sachID } });
      // set on dataValues so it appears in JSON serialization
      s.dataValues.images = JSON.stringify(
        imgs.map((i) => ({ url: i.url, public_id: i.public_id }))
      );
      // Thêm trạng thái tồn kho để frontend hiển thị cảnh báo
      s.dataValues.stockStatus = computeStockStatus(s.soLuongConLai);
    }
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
      moTa,
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
      moTa,
      danhMucSachID,
      soTrang,
      dinhDang,
      soLuongConLai,
      giaNhap,
      giaBan,
      giaGiam,
      // images column is deprecated; images will be stored in hinh_anh table
    });

    // Nếu có images được gửi lên (mảng {url, public_id}), lưu vào bảng HinhAnh
    if (Array.isArray(images) && images.length > 0) {
      const records = images.map((img) => ({
        sachID: sachMoi.sachID,
        url: img.url,
        public_id: img.public_id || img.publicId || null,
      }));
      await HinhAnh.bulkCreate(records);
    }
    // Đính kèm trường images trả về để giữ tương thích frontend (chuỗi JSON)
    const imagesForReturn = Array.isArray(images) ? images : [];
    const result = {
      ...sachMoi.toJSON(),
      moTa: sachMoi.moTa,
      images: JSON.stringify(imagesForReturn),
    };
    res.status(201).json(result);
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
      moTa,
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
    sach.moTa = moTa;
    sach.danhMucSachID = danhMucSachID;
    sach.soTrang = soTrang;
    sach.dinhDang = dinhDang;
    sach.soLuongConLai = soLuongConLai;
    sach.giaNhap = giaNhap;
    sach.giaBan = giaBan;
    sach.giaGiam = giaGiam;
    // Cập nhật sách
    await sach.save();

    // Nếu có images truyền lên, cập nhật bảng HinhAnh một cách thông minh
    if (Array.isArray(images)) {
      // Lấy ảnh hiện có trong DB
      const existing = await HinhAnh.findAll({
        where: { sachID: sach.sachID },
      });

      const existingByPublic = new Map();
      const existingByUrl = new Map();
      for (const e of existing) {
        if (e.public_id) existingByPublic.set(e.public_id, e);
        if (e.url) existingByUrl.set(e.url, e);
      }

      // Chuẩn hoá submitted images
      const submitted = images.map((img) => ({
        url: img.url,
        public_id: img.public_id || img.publicId || null,
      }));

      const submittedPublicIds = new Set(
        submitted.map((i) => i.public_id).filter(Boolean)
      );
      const submittedUrls = new Set(
        submitted.map((i) => i.url).filter(Boolean)
      );

      // 1) Xóa những ảnh trong DB không có trong submitted
      const toDelete = existing.filter(
        (e) =>
          !(submittedPublicIds.has(e.public_id) || submittedUrls.has(e.url))
      );
      for (const d of toDelete) {
        await HinhAnh.destroy({ where: { hinhAnhID: d.hinhAnhID } });
      }

      // 2) Thêm những ảnh mới (không tồn tại trong DB theo public_id hoặc url)
      const toAdd = submitted.filter(
        (s) => !existingByPublic.has(s.public_id) && !existingByUrl.has(s.url)
      );
      if (toAdd.length > 0) {
        const records = toAdd.map((img) => ({
          sachID: sach.sachID,
          url: img.url,
          public_id: img.public_id || null,
        }));
        await HinhAnh.bulkCreate(records);
      }
    }

    // Trả về sách với trường images để frontend vẫn hoạt động
    const imagesForReturn = Array.isArray(images)
      ? images
      : await HinhAnh.findAll({ where: { sachID: sach.sachID } });
    const result = {
      ...sach.toJSON(),
      moTa: sach.moTa,
      images: JSON.stringify(
        Array.isArray(imagesForReturn)
          ? imagesForReturn.map((i) =>
              i.url ? { url: i.url, public_id: i.public_id } : i
            )
          : []
      ),
    };
    res.json(result);
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
    // Trước khi xóa sách, xóa các bản ghi HinhAnh liên quan để tránh lỗi ràng buộc FK
    try {
      await HinhAnh.destroy({ where: { sachID: sach.sachID } });
    } catch (e) {
      console.error("Lỗi khi xóa hinh_anh trước khi xóa sach:", e);
      return res
        .status(500)
        .json({ success: false, message: "Không thể xóa ảnh liên quan." });
    }

    await sach.destroy();
    res.json({ success: true, message: "Sách đã được xóa thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa sách:", error);
    res
      .status(500)
      .json({ success: false, message: "Đã xảy ra lỗi khi xóa sách." });
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
    // Lấy ảnh liên quan từ bảng HinhAnh
    const images = await HinhAnh.findAll({ where: { sachID: sach.sachID } });
    const imagesForReturn = images.map((i) => ({
      url: i.url,
      public_id: i.public_id,
    }));

    const result = {
      ...sach.toJSON(),
      images: JSON.stringify(imagesForReturn),
      stockStatus: computeStockStatus(sach.soLuongConLai),
    };
    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy chi tiết sách." });
  }
};
