import { GioHang, ChiTietGioHang } from "../models/GioHang.js";
import Sach from "../models/Sach.js";
import HinhAnh from "../models/HinhAnh.js";

// Lấy thông tin giỏ hàng của người dùng theo nguoiDungID
export const layGioHangTheoNguoiDung = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;

    // Tìm giỏ hàng của người dùng kèm theo chi tiết sản phẩm
    const gioHang = await GioHang.findOne({
      where: { nguoiDungID },
      include: [
        {
          model: ChiTietGioHang,
          include: [
            {
              model: Sach,
              attributes: ["sachID", "tenSach"], // Lấy thông tin sách cần thiết (images moved to HinhAnh)
            },
          ],
        },
      ],
    });

    if (!gioHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng của người dùng này",
      });
    }

    // Đính kèm ảnh sản phẩm cho từng ChiTietGioHang -> Sach
    for (const ct of gioHang.ChiTietGioHangs) {
      const sach = ct.Sach;
      if (sach) {
        const imgs = await HinhAnh.findAll({ where: { sachID: sach.sachID } });
        // định dạng tương thích: sach.images là chuỗi JSON của mảng {url, public_id}
        sach.dataValues.images = JSON.stringify(
          imgs.map((i) => ({ url: i.url, public_id: i.public_id }))
        );
      }
    }

    // Tính tổng tiền giỏ hàng
    const tongTien = gioHang.ChiTietGioHangs.reduce((total, item) => {
      return total + item.tongGia;
    }, 0);

    res.json({
      success: true,
      gioHang: {
        ...gioHang.toJSON(),
        tongTien,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy giỏ hàng",
    });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const themSanPhamVaoGioHang = async (req, res) => {
  try {
    const { nguoiDungID, sachID, soLuong = 1, giaLucThem } = req.body;

    // Kiểm tra sách có tồn tại không
    const sach = await Sach.findByPk(sachID);
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sách",
      });
    }

    // Kiểm tra số lượng sách trong kho
    if (sach.soLuongConLai < soLuong) {
      return res.status(400).json({
        success: false,
        message: "Số lượng sách trong kho không đủ",
      });
    }

    // Tìm hoặc tạo giỏ hàng cho người dùng
    let gioHang = await GioHang.findOne({ where: { nguoiDungID } });
    if (!gioHang) {
      gioHang = await GioHang.create({
        nguoiDungID,
      });
    }

    // Kiểm tra sản phẩm đã có trong chi tiết giỏ hàng chưa
    const chiTietGioHangCu = await ChiTietGioHang.findOne({
      where: {
        gioHangID: gioHang.gioHangID,
        sachID,
      },
    });

    if (chiTietGioHangCu) {
      // Nếu đã có, cập nhật số lượng
      const soLuongMoi = chiTietGioHangCu.soLuong + soLuong;
      const tongGiaMoi = soLuongMoi * chiTietGioHangCu.giaLucThem;

      await chiTietGioHangCu.update({
        soLuong: soLuongMoi,
        tongGia: tongGiaMoi,
      });

      res.json({
        success: true,
        message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng",
        chiTietGioHang: chiTietGioHangCu,
      });
    } else {
      // Nếu chưa có, thêm mới
      const tongGia = soLuong * giaLucThem;
      const chiTietGioHangMoi = await ChiTietGioHang.create({
        gioHangID: gioHang.gioHangID,
        sachID,
        soLuong,
        giaLucThem: giaLucThem,
        tongGia,
      });

      res.status(201).json({
        success: true,
        message: "Đã thêm sản phẩm vào giỏ hàng",
        chiTietGioHang: chiTietGioHangMoi,
      });
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sản phẩm vào giỏ hàng",
    });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const capNhatSoLuongSanPham = async (req, res) => {
  try {
    const { chiTietGioHangID } = req.params;
    const { soLuong } = req.body;

    if (soLuong <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0",
      });
    }

    // Tìm chi tiết giỏ hàng
    const chiTietGioHang = await ChiTietGioHang.findByPk(chiTietGioHangID, {
      include: [{ model: Sach }],
    });

    if (!chiTietGioHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    // Kiểm tra số lượng sách trong kho
    if (chiTietGioHang.Sach.soLuongConLai < soLuong) {
      return res.status(400).json({
        success: false,
        message: "Số lượng sách trong kho không đủ",
      });
    }

    // Cập nhật số lượng và tổng giá
    const tongGiaMoi = soLuong * chiTietGioHang.giaLucThem;
    await chiTietGioHang.update({
      soLuong,
      tongGia: tongGiaMoi,
    });

    res.json({
      success: true,
      message: "Đã cập nhật số lượng sản phẩm",
      chiTietGioHang,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật số lượng sản phẩm",
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const xoaSanPhamKhoiGioHang = async (req, res) => {
  try {
    const { chiTietGioHangID } = req.params;

    // Tìm chi tiết giỏ hàng
    const chiTietGioHang = await ChiTietGioHang.findByPk(chiTietGioHangID);

    if (!chiTietGioHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    await chiTietGioHang.destroy();

    res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng",
    });
  }
};

// Xóa toàn bộ giỏ hàng
export const xoaToanBoGioHang = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;

    // Tìm giỏ hàng của người dùng
    const gioHang = await GioHang.findOne({ where: { nguoiDungID } });

    if (!gioHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    // Xóa giỏ hàng
    await gioHang.destroy();

    res.json({
      success: true,
      message: "Đã xóa toàn bộ sản phẩm trong giỏ hàng",
    });
  } catch (error) {
    console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa toàn bộ giỏ hàng",
    });
  }
};

// Đếm số lượng sản phẩm trong giỏ hàng
export const demSoLuongSanPhamTrongGioHang = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;

    // Tìm giỏ hàng và đếm số lượng sản phẩm
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

    // Tính tổng số lượng sản phẩm
    const tongSoLuong = gioHang.ChiTietGioHangs.reduce((total, item) => {
      return total + item.soLuong;
    }, 0);

    res.json({
      success: true,
      soLuongSanPham: tongSoLuong,
    });
  } catch (error) {
    console.error("Lỗi khi đếm số lượng sản phẩm trong giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đếm số lượng sản phẩm",
    });
  }
};
