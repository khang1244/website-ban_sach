import DonHang, { DonHang_Sach } from "../models/DonHang.js";
import Sach from "../models/Sach.js";
import HinhAnh from "../models/HinhAnh.js";
import PhuongThucGiaoHang from "../models/PhuongThucGiaoHang.js";
import sequelize from "../config/mysql_config.js";
import KhuyenMai from "../models/KhuyenMai.js";
import PhieuXuat from "../models/PhieuXuat.js";
import ChiTietPhieuXuat from "../models/ChiTietPhieuXuat.js";

// Nhận tất cả đơn hàng
export const nhanTatCaDonHang = async (req, res) => {
  try {
    const donHangs = await DonHang.findAll({
      include: [
        {
          model: Sach,
          through: { attributes: ["soLuong", "donGia"] }, // Lấy thêm thông tin số lượng và đơn giá từ bảng trung gian
        },
      ],
    });
    res.status(200).json(donHangs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const taoDonHangMoi = async (req, res) => {
  const {
    nguoiDungID,
    tenNguoiDung,
    soDienThoaiKH,
    ngayDat,
    tongTien,
    trangThai,
    diaChiGiaoHang,
    phuongThucThanhToan,
    phuongThucGiaoHangID,
    ghiChu,
    items,
    khuyenMaiID,
    tienGiam,
    tongTienBanDau,
  } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      // 1. Xử lý khuyến mãi
      if (khuyenMaiID) {
        const coupon = await KhuyenMai.findByPk(khuyenMaiID, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!coupon) throw new Error("Mã khuyến mãi không tồn tại");

        if (coupon.ngayHetHan) {
          const end = new Date(coupon.ngayHetHan);
          end.setHours(23, 59, 59, 999);
          if (new Date() > end) throw new Error("Mã khuyến mãi đã hết hạn");
        }

        if (coupon.soLuong <= 0)
          throw new Error("Mã khuyến mãi đã hết số lượng");

        coupon.soLuong -= 1;
        if (coupon.soLuong === 0) coupon.trangThai = false;
        await coupon.save({ transaction: t });
      }

      // 2. Tạo đơn hàng
      const donHang = await DonHang.create(
        {
          nguoiDungID,
          tenNguoiDung,
          soDienThoaiKH,
          ngayDat,
          tongTien,
          trangThai,
          diaChiGiaoHang,
          phuongThucThanhToan,
          phuongThucGiaoHangID,
          ghiChu,
          khuyenMaiID: khuyenMaiID || null,
          tienGiam,
          tongTienBanDau,
        },
        { transaction: t }
      );

      // 3. Xử lý từng sách
      for (const { sachID, soLuong, donGia } of items) {
        const sach = await Sach.findByPk(sachID, { transaction: t });
        if (!sach) throw new Error(`Sách ${sachID} không tồn tại`);

        const [nhap] = await sequelize.query(
          `SELECT COALESCE(SUM(soLuongNhap),0) AS tong FROM chi_tiet_phieu_nhap WHERE sachID=:sachID`,
          { replacements: { sachID }, transaction: t }
        );

        const [xuat] = await sequelize.query(
          `SELECT COALESCE(SUM(soLuongXuat),0) AS tong FROM chi_tiet_phieu_xuat WHERE sachID=:sachID`,
          { replacements: { sachID }, transaction: t }
        );

        const tonKho = nhap[0].tong - xuat[0].tong;
        if (tonKho < soLuong)
          throw new Error(`Sách '${sach.tenSach}' không đủ. Tồn kho ${tonKho}`);

        await DonHang_Sach.create(
          {
            donHangID: donHang.donHangID,
            sachID,
            soLuong,
            donGia,
          },
          { transaction: t }
        );
      }

      return donHang;
    });

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      donHangID: result.donHangID,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const capNhatTrangThaiDonHang = async (req, res) => {
  const { id } = req.params;
  const { trangThai } = req.body;

  try {
    const donHang = await DonHang.findByPk(id, {
      include: [{ model: Sach }],
    });

    if (!donHang)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const trangThaiCu = donHang.trangThai;

    if (["Đã hủy", "Đã trả hàng"].includes(trangThaiCu)) {
      return res.status(400).json({
        message: "Không thể cập nhật đơn hàng đã hủy hoặc đã trả hàng",
      });
    }

    if (trangThaiCu === trangThai) {
      return res
        .status(200)
        .json({ message: "Trạng thái đơn hàng không thay đổi" });
    }

    await sequelize.transaction(async (t) => {
      // 1. Hoàn thành đơn → tạo phiếu xuất (trừ kho)
      if (trangThai === "Hoàn thành" && trangThaiCu !== "Hoàn thành") {
        const daCoPhieuXuat = await PhieuXuat.findOne({
          where: { donHangID: id, loaiXuat: "bán hàng" },
          transaction: t,
        });

        if (!daCoPhieuXuat) {
          const phieuXuat = await PhieuXuat.create(
            {
              donHangID: donHang.donHangID,
              nguoiDungID: donHang.nguoiDungID,
              tenNguoiDung: donHang.tenNguoiDung,
              ngayXuat: new Date(),
              loaiXuat: "bán hàng",
              nguoiXuat: "Hệ thống",
              ghiChu: `Đơn hàng #${donHang.donHangID}`,
            },
            { transaction: t }
          );

          const chiTiets = await DonHang_Sach.findAll({
            where: { donHangID: id },
            transaction: t,
          });

          for (const ct of chiTiets) {
            await ChiTietPhieuXuat.create(
              {
                phieuXuatID: phieuXuat.phieuXuatID,
                sachID: ct.sachID,
                soLuongXuat: ct.soLuong,
                donGiaBan: ct.donGia,
                thanhTien: ct.soLuong * ct.donGia,
              },
              { transaction: t }
            );
          }
        }
      }

      // 2. Hủy đơn → hoàn mã khuyến mãi
      if (trangThai === "Đã hủy" && trangThaiCu !== "Đã hủy") {
        if (donHang.khuyenMaiID) {
          const km = await KhuyenMai.findByPk(donHang.khuyenMaiID, {
            transaction: t,
          });

          if (km) {
            km.soLuong += 1;
            km.trangThai = true;
            await km.save({ transaction: t });
          }
        }
      }

      // 3. Cập nhật trạng thái đơn
      await donHang.update({ trangThai }, { transaction: t });
    });

    return res
      .status(200)
      .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Nhận đơn hàng theo tài khoản người dùng
export const nhanDonHangCuaNguoiDung = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;
    const donHangs = await DonHang.findAll({
      where: { nguoiDungID },
      include: [
        {
          model: Sach,
          through: { attributes: ["soLuong", "donGia"] }, // Lấy thêm thông tin số lượng và đơn giá từ bảng trung gian
        },
      ],
    });
    res.status(200).json(donHangs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nhận đơn hàng theo ID
export const nhanDonHangTheoID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ tham số URL

    const donHang = await DonHang.findOne({
      where: { donHangID: id },
      include: [
        {
          model: Sach,
          through: { attributes: ["soLuong", "donGia"] },
          include: [
            {
              model: HinhAnh,
              as: "hinhAnhs",
              attributes: ["hinhAnhID", "url"],
            },
          ],
        },
        {
          model: PhuongThucGiaoHang,
          attributes: ["phuongThucGiaoHangID", "tenPhuongThuc", "phiGiaoHang"],
        },
      ],
      order: [
        [
          { model: Sach },
          { model: HinhAnh, as: "hinhAnhs" },
          "hinhAnhID",
          "ASC",
        ],
      ],
    });

    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(donHang);
  } catch (error) {
    console.error("Lỗi khi nhận đơn hàng theo ID:", error);
    res.status(500).json({ message: error.message });
  }
};

export const traHang = async (req, res) => {
  const { donHangID, lyDoTraHang } = req.body;

  try {
    const donHang = await DonHang.findByPk(donHangID, {
      include: [{ model: Sach }],
    });

    if (!donHang)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    if (donHang.trangThai !== "Hoàn thành") {
      return res.status(400).json({
        message: `Chỉ được trả hàng khi đơn ở trạng thái "Hoàn thành"`,
      });
    }

    let phieuXuatMoi;

    await sequelize.transaction(async (t) => {
      // 1. Cập nhật trạng thái đơn hàng
      await donHang.update(
        {
          trangThai: "Đã trả hàng",
          ghiChu: lyDoTraHang || donHang.ghiChu,
        },
        { transaction: t }
      );

      // 2. Tạo phiếu xuất khách trả hàng
      phieuXuatMoi = await PhieuXuat.create(
        {
          donHangID,
          nguoiDungID: donHang.nguoiDungID,
          tenNguoiDung: donHang.tenNguoiDung,
          ngayXuat: new Date(),
          loaiXuat: "Khách trả hàng",
          nguoiXuat: "Hệ thống",
          ghiChu: `Lý do trả hàng: ${lyDoTraHang || "Không có"}`,
        },
        { transaction: t }
      );

      // 3. Ghi chi tiết phiếu xuất (số lượng âm để cộng tồn kho)
      for (const sach of donHang.Saches) {
        const { soLuong, donGia } = sach.DonHang_Sach;

        await ChiTietPhieuXuat.create(
          {
            phieuXuatID: phieuXuatMoi.phieuXuatID,
            sachID: sach.sachID,
            soLuongXuat: -soLuong,
            donGiaBan: donGia,
            thanhTien: soLuong * donGia,
          },
          { transaction: t }
        );
      }
    });

    return res.status(200).json({
      message: "Trả hàng thành công",
      donHangID,
      phieuXuatID: phieuXuatMoi.phieuXuatID,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
