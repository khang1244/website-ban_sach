import Sach from "../models/Sach.js";
import HinhAnh from "../models/HinhAnh.js";
import ChiTietPhieuNhap from "../models/ChiTietPhieuNhap.js";

// Chuẩn hoá input trạng thái bán về Boolean (viết rõ cho dễ đọc)
const chuanHoaTrangThaiBan = (value) => {
  if (value === undefined || value === null) return undefined;
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "dangBan"
  );
};

// lấy sách có phiếu nhập
const layMapSachCoPhieuNhap = async () => {
  const danhSach = await ChiTietPhieuNhap.findAll({
    attributes: [
      "sachID",
      [
        ChiTietPhieuNhap.sequelize.fn(
          "COUNT",
          ChiTietPhieuNhap.sequelize.col("phieuNhapID")
        ),
        "soPhieuNhap",
      ],
    ],
    group: ["sachID"],
    raw: true,
  });

  const map = new Map();
  danhSach.forEach(({ sachID, soPhieuNhap }) => {
    const coPhieuNhap = Number(soPhieuNhap || 0) > 0;
    map.set(sachID, coPhieuNhap);
  });
  return map;
};

export const nhanTatCaCacQuyenSach = async (req, res) => {
  try {
    // 1. Lấy toàn bộ sách
    const danhSachSach = await Sach.findAll();

    // 2. Lấy map trạng thái có phiếu nhập (key: sachID, value: boolean)
    const mapCoPhieuNhap = await layMapSachCoPhieuNhap();

    // 3. Gắn thêm dữ liệu cho từng sách (viết tuần tự cho dễ hiểu)
    for (const sach of danhSachSach) {
      // Lấy hình ảnh của sách
      const hinhAnh = await HinhAnh.findAll({
        where: { sachID: sach.sachID },
        order: [["hinhAnhID", "ASC"]],
      });

      sach.dataValues.images = hinhAnh.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      }));

      // Chuẩn hóa trạng thái bán
      sach.dataValues.trangThaiBan =
        chuanHoaTrangThaiBan(sach.trangThaiBan) ?? true;

      // Trạng thái có phiếu nhập
      sach.dataValues.coPhieuNhap = mapCoPhieuNhap.get(sach.sachID) || false;
    }

    // 4. Trả kết quả
    res.json(danhSachSach);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    res.status(500).json({
      error: "Đã xảy ra lỗi khi lấy danh sách sách.",
    });
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
      giaBan,
      giaGiam,
      images,
      trangThaiBan,
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
      giaBan,
      giaGiam,
      trangThaiBan: chuanHoaTrangThaiBan(trangThaiBan) ?? true, // mặc định là true
    });

    // Thêm images nếu có
    if (Array.isArray(images) && images.length > 0) {
      await HinhAnh.bulkCreate(
        images.map((img) => ({
          sachID: sachMoi.sachID,
          url: img.url,
          public_id: img.public_id || img.publicId || null,
        }))
      );
    }
    // Trả về sách mới cùng images (nếu có)
    const result = {
      ...sachMoi.toJSON(),
      moTa: sachMoi.moTa,
      images: Array.isArray(images) ? images : [],
      trangThaiBan: chuanHoaTrangThaiBan(trangThaiBan) ?? true,
      coPhieuNhap: false,
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
      giaBan,
      giaGiam,
      images,
      trangThaiBan,
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
    sach.giaBan = giaBan;
    sach.giaGiam = giaGiam;
    const trangThaiBanMoi = chuanHoaTrangThaiBan(trangThaiBan);
    if (trangThaiBanMoi !== undefined) {
      sach.trangThaiBan = trangThaiBanMoi;
    }
    // Cập nhật sách
    await sach.save();

    // Nếu có images truyền lên, đồng bộ lại bảng HinhAnh
    if (Array.isArray(images)) {
      const existing = await HinhAnh.findAll({
        where: { sachID: sach.sachID },
      });
      const existingUrls = new Set(existing.map((e) => e.url));
      const submittedUrls = new Set(images.map((i) => i.url));
      // Xóa ảnh không còn trong images mới
      for (const e of existing) {
        if (!submittedUrls.has(e.url))
          await HinhAnh.destroy({ where: { hinhAnhID: e.hinhAnhID } });
      }
      // Thêm ảnh mới
      for (const img of images) {
        if (!existingUrls.has(img.url)) {
          await HinhAnh.create({
            sachID: sach.sachID,
            url: img.url,
            public_id: img.public_id || img.publicId || null,
          });
        }
      }
    }
    // Trả về sách với images mới nhất
    const imagesForReturn = await getImages(sach.sachID);
    const coPhieuNhap =
      (await ChiTietPhieuNhap.count({ where: { sachID: sach.sachID } })) > 0;
    const result = {
      ...sach.toJSON(),
      moTa: sach.moTa,
      images: imagesForReturn,
      coPhieuNhap,
    };
    res.json(result);
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật sách." });
  }
};

export const capNhatTrangThaiBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThaiBan } = req.body;
    const trangThaiBanMoi = chuanHoaTrangThaiBan(trangThaiBan);

    if (trangThaiBanMoi === undefined) {
      return res.status(400).json({
        success: false,
        message: "Thiếu hoặc sai định dạng trường trangThaiBan.",
      });
    }

    const sach = await Sach.findByPk(id);
    if (!sach) {
      return res
        .status(404)
        .json({ success: false, message: "Sách không tồn tại." });
    }

    sach.trangThaiBan = trangThaiBanMoi;
    await sach.save();

    const coPhieuNhap =
      (await ChiTietPhieuNhap.count({ where: { sachID: sach.sachID } })) > 0;
    const images = await HinhAnh.findAll({
      where: { sachID: sach.sachID },
      order: [["hinhAnhID", "ASC"]],
    });

    return res.json({
      success: true,
      trangThaiBan: sach.trangThaiBan,
      coPhieuNhap,
      sach: {
        ...sach.toJSON(),
        images: images.map((i) => ({ url: i.url, public_id: i.public_id })),
        coPhieuNhap,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái bán:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái bán.",
    });
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
    const coPhieuNhap =
      (await ChiTietPhieuNhap.count({ where: { sachID: sach.sachID } })) > 0;
    if (coPhieuNhap) {
      return res.status(400).json({
        success: false,
        message: "Sách đã có phiếu nhập, không thể xóa khỏi hệ thống.",
      });
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
// Lấy thông tin chi tiết của một quyển sách theo ID
export const layChiTietSach = async (req, res) => {
  try {
    const { sachID } = req.params;

    // 1. Lấy sách theo ID
    const sach = await Sach.findByPk(sachID);
    if (!sach) {
      return res.status(404).json({ error: "Sách không tồn tại." });
    }

    // 2. Lấy hình ảnh của sách
    const hinhAnh = await HinhAnh.findAll({
      where: { sachID },
      order: [["hinhAnhID", "ASC"]],
    });
    // Chuyển đổi dữ liệu hình ảnh
    const images = hinhAnh.map((img) => ({
      url: img.url,
      public_id: img.public_id,
    }));

    // 3. Kiểm tra sách có phiếu nhập hay không
    const coPhieuNhap =
      (await ChiTietPhieuNhap.count({ where: { sachID } })) > 0;

    // 4. Gộp dữ liệu trả về
    const result = {
      ...sach.toJSON(),
      images,
      coPhieuNhap,
    };

    res.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sách:", error);
    res.status(500).json({
      error: "Đã xảy ra lỗi khi lấy chi tiết sách.",
    });
  }
};

// Hàm để tăng lượt xem của một quyển sách
export const tangLuotXem = async (req, res) => {
  try {
    const { sachID } = req.params;
    const sach = await Sach.findByPk(sachID);
    if (!sach) return res.status(404).json({ error: "Sách không tồn tại." });

    await sach.increment("luotXem", { by: 1 });
    await sach.reload();

    return res.json({ success: true, luotXem: sach.luotXem });
  } catch (error) {
    console.error("Lỗi khi tăng lượt xem:", error);
    return res
      .status(500)
      .json({ success: false, error: "Không thể tăng lượt xem." });
  }
};
