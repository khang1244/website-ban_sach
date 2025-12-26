import { GioHang, ChiTietGioHang } from "../models/GioHang.js";
import Sach from "../models/Sach.js";
import HinhAnh from "../models/HinhAnh.js";

// Lấy thông tin giỏ hàng của người dùng theo nguoiDungID
export const layGioHangTheoNguoiDung = async (req, res) => {
  try {
    const { nguoiDungID } = req.params; // Lấy nguoiDungID từ tham số URL

    // Tìm giỏ hàng của người dùng kèm theo chi tiết sản phẩm và thông tin sách
    const gioHang = await GioHang.findOne({
      where: { nguoiDungID },
      include: [
        {
          model: ChiTietGioHang,
          include: [
            {
              model: Sach,
              attributes: ["sachID", "tenSach"], // Chỉ lấy các thuộc tính cần thiết
            },
          ],
        },
      ],
    });
    // Nếu không tìm thấy giỏ hàng, trả về thông báo
    if (!gioHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng của người dùng này",
      });
    }

    // Gắn danh sách hình ảnh cho từng sách trong giỏ
    for (const ct of gioHang.ChiTietGioHangs) {
      const imgs = await HinhAnh.findAll({ where: { sachID: ct.Sach.sachID } });
      ct.Sach.dataValues.images = imgs.map((i) => ({
        url: i.url,
        public_id: i.public_id,
      }));
    }

    // Tính tổng tiền giỏ hàng
    const tongTien = gioHang.ChiTietGioHangs.reduce(
      (sum, i) => sum + i.tongGia,
      0
    );

    res.json({
      success: true,
      gioHang: {
        ...gioHang.toJSON(),
        tongTien,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const themSanPhamVaoGioHang = async (req, res) => {
  try {
    const { nguoiDungID, sachID, soLuong = 1, giaLucThem } = req.body;

    // Nếu chưa có giỏ hàng thì tạo mới
    let gioHang = await GioHang.findOne({ where: { nguoiDungID } });
    if (!gioHang) gioHang = await GioHang.create({ nguoiDungID });

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existed = await ChiTietGioHang.findOne({
      where: { gioHangID: gioHang.gioHangID, sachID },
    });

    if (existed) {
      // Nếu đã có thì cộng dồn số lượng
      const soLuongMoi = existed.soLuong + soLuong;
      await existed.update({
        soLuong: soLuongMoi,
        tongGia: soLuongMoi * existed.giaLucThem,
      });
      return res.json({ success: true, message: "Đã cập nhật số lượng" });
    }

    // Nếu chưa có thì thêm mới sản phẩm vào giỏ
    await ChiTietGioHang.create({
      gioHangID: gioHang.gioHangID,
      sachID,
      soLuong,
      giaLucThem,
      tongGia: soLuong * giaLucThem,
    });

    res.status(201).json({ success: true, message: "Đã thêm sản phẩm" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const capNhatSoLuongSanPham = async (req, res) => {
  try {
    const { gioHangID, sachID } = req.params;
    const { soLuong } = req.body;

    // Tìm chi tiết giỏ hàng cần cập nhật
    const ct = await ChiTietGioHang.findOne({
      where: { gioHangID, sachID },
      include: [{ model: Sach }],
    });

    if (!ct) {
      // Không tìm thấy sản phẩm trong giỏ
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy" });
    }

    // Cập nhật số lượng và tổng giá
    await ct.update({
      soLuong,
      tongGia: soLuong * ct.giaLucThem,
    });

    res.json({ success: true, message: "Đã cập nhật", ct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const xoaSanPhamKhoiGioHang = async (req, res) => {
  try {
    const { gioHangID, sachID } = req.params;

    // Tìm chi tiết giỏ hàng cần xóa
    const ct = await ChiTietGioHang.findOne({
      where: { gioHangID, sachID },
    });

    if (!ct) {
      // Không tìm thấy sản phẩm trong giỏ
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy" });
    }

    await ct.destroy();
    res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

//Xóa toàn bộ sản phẩm trong giỏ hàng của người dùng khi đặt hàng thành công

export const xoaToanBoGioHang = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;

    // Tìm giỏ hàng của người dùng
    const gioHang = await GioHang.findOne({ where: { nguoiDungID } });

    if (!gioHang) {
      // Nếu chưa có giỏ thì coi như đã xóa xong
      return res.json({ success: true });
    }

    // Xóa toàn bộ chi tiết giỏ hàng
    await ChiTietGioHang.destroy({
      where: { gioHangID: gioHang.gioHangID },
    });

    res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Đếm số lượng sản phẩm trong giỏ hàng
export const demSoLuongSanPhamTrongGioHang = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;

    // Tìm giỏ hàng và lấy các chi tiết để đếm số lượng
    const gioHang = await GioHang.findOne({
      where: { nguoiDungID },
      include: [
        {
          model: ChiTietGioHang,
          attributes: ["soLuong"],
        },
      ],
    });

    if (!gioHang) {
      return res.json({
        success: true,
        soLuongSanPham: 0,
      });
    }

    const tongSoLuong = gioHang.ChiTietGioHangs.reduce(
      (total, item) => total + item.soLuong,
      0
    );

    res.json({
      success: true,
      soLuongSanPham: tongSoLuong,
    });
  } catch (error) {
    console.error("Lỗi khi đếm số lượng sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đếm số lượng sản phẩm",
    });
  }
};
