import DonHang, { DonHang_Sach } from "../models/DonHang.js";
import Sach from "../models/Sach.js";
import sequelize from "../config/mysql_config.js";
import KhuyenMai from "../models/KhuyenMai.js";

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

// Tạo đơn hàng mới
export const taoDonHangMoi = async (req, res) => {
  try {
    const {
      nguoiDungID,
      tenKhachHang,
      soDienThoaiKH,
      ngayDat,
      tongTien,
      trangThai,
      diaChiGiaoHang,
      phuongThucThanhToan,
      phuongThucGiaoHangID,
      ghiChu,
      items, // { sachID, soLuong, donGia }
      khuyenMaiID, // Mã khuyến mãi
      tienGiam, // Số tiền giảm giá
      tongTienBanDau, // Tổng tiền ban đầu trước khi giảm giá
    } = req.body;

    // Dùng transaction để đảm bảo atomic
    const t = await sequelize.transaction();
    try {
      // Xử lý mã khuyến mãi nếu có
      let appliedCoupon = null;
      if (khuyenMaiID) {
        appliedCoupon = await KhuyenMai.findOne({
          where: { khuyenMaiID },
          transaction: t,
          lock: t.LOCK ? t.LOCK.UPDATE : undefined,
        });

        if (!appliedCoupon) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: "Mã khuyến mãi không tồn tại" });
        }

        // Kiểm tra hạn sử dụng
        const hetHan = appliedCoupon.ngayHetHan
          ? new Date(appliedCoupon.ngayHetHan)
          : null;
        if (hetHan) {
          const endOfDay = new Date(hetHan);
          endOfDay.setHours(23, 59, 59, 999);
          if (new Date() > endOfDay) {
            await t.rollback();
            return res
              .status(400)
              .json({ message: "Mã khuyến mãi đã hết hạn" });
          }
        }

        if (!appliedCoupon.soLuong || appliedCoupon.soLuong <= 0) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: "Mã khuyến mãi đã hết số lượng" });
        }

        //  Cập nhật số lượng mã khuyến mãi
        console.log(
          `Áp dụng mã khuyến mãi ${khuyenMaiID}, soLuong trước: ${appliedCoupon.soLuong}`
        );
        appliedCoupon.soLuong = appliedCoupon.soLuong - 1;
        if (appliedCoupon.soLuong <= 0) appliedCoupon.trangThai = false;
        await appliedCoupon.save({ transaction: t });
        console.log(
          `Áp dụng mã khuyến mãi ${khuyenMaiID}, soLuong sau: ${appliedCoupon.soLuong}`
        );
      }

      // Tạo đơn hàng mới
      const donHangMoi = await DonHang.create(
        {
          nguoiDungID,
          tenKhachHang,
          soDienThoaiKH,
          ngayDat,
          tongTien,
          trangThai,
          diaChiGiaoHang,
          phuongThucThanhToan,
          phuongThucGiaoHangID,
          ghiChu,
          khuyenMaiID: khuyenMaiID || null,
          tienGiam: tienGiam || null,
          tongTienBanDau: tongTienBanDau || null,
        },
        { transaction: t }
      );

      // Thêm các sách vào đơn hàng với số lượng và đơn giá tương ứng
      for (const item of items) {
        // Lấy sách hiện tại
        const sach = await Sach.findOne({
          where: { sachID: item.sachID },
          transaction: t,
          lock: t.LOCK ? t.LOCK.UPDATE : undefined,
        });

        if (!sach) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: `Sách ${item.sachID} không tồn tại` });
        }

        const soLuongTruoc = sach.soLuongConLai || 0;
        const soLuongSau = soLuongTruoc - Number(item.soLuong);
        if (soLuongSau < 0) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: `Số lượng sách '${sach.tenSach}' không đủ` });
        }

        // Cập nhật tồn kho
        sach.soLuongConLai = soLuongSau;
        await sach.save({ transaction: t });

        // Thêm vào bảng trung gian DonHang_Sach
        await DonHang_Sach.create(
          {
            donHangID: donHangMoi.donHangID,
            sachID: item.sachID,
            soLuong: item.soLuong,
            donGia: item.donGia,
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(201).json({
        message: "Tạo đơn hàng thành công",
        donHangID: donHangMoi.donHangID,
      });
    } catch (err) {
      await t.rollback();
      console.error("Lỗi khi xử lý tạo đơn với transaction:", err);
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng mới:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const capNhatTrangThaiDonHang = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ tham số URL
    const { trangThai } = req.body; // Lấy trạng thái mới từ body yêu cầu

    // Tìm đơn hàng hiện tại
    const donHang = await DonHang.findOne({ where: { donHangID: id } });
    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const trangThaiCu = donHang.trangThai;

    // Nếu trạng thái không thay đổi thì trả về ok
    if (trangThaiCu === trangThai) {
      return res
        .status(200)
        .json({ message: "Trạng thái đơn hàng không thay đổi" });
    }

    // Dùng transaction để cập nhật trạng thái và hoàn/khấu trừ tồn kho một cách atomic
    const t = await sequelize.transaction();
    try {
      // Nếu cập nhật thành "Đã hủy" và trạng thái cũ chưa phải "Đã hủy" thì hoàn trả tồn kho
      if (trangThai === "Đã hủy" && trangThaiCu !== "Đã hủy") {
        // Lấy các mục trong đơn hàng từ bảng trung gian
        const chiTiets = await DonHang_Sach.findAll({
          where: { donHangID: id },
          transaction: t,
        });

        for (const chiTiet of chiTiets) {
          const sach = await Sach.findOne({
            where: { sachID: chiTiet.sachID },
            transaction: t,
            lock: t.LOCK ? t.LOCK.UPDATE : undefined,
          });

          if (!sach) {
            // nếu sách không tồn tại, rollback để giữ nhất quán
            await t.rollback();
            return res
              .status(400)
              .json({ message: `Sách ${chiTiet.sachID} không tồn tại` });
          }

          const soLuongTruoc = sach.soLuongConLai || 0;
          const soLuongHoan = Number(chiTiet.soLuong) || 0;
          const soLuongSau = soLuongTruoc + soLuongHoan;

          // Cập nhật tồn kho
          sach.soLuongConLai = soLuongSau;
          await sach.save({ transaction: t });
        }
        // Nếu đơn hàng có áp dụng mã khuyến mãi, hoàn lại số lượng mã trong transaction
        try {
          const donHangTrans = await DonHang.findOne({
            where: { donHangID: id },
            transaction: t,
            lock: t.LOCK ? t.LOCK.UPDATE : undefined,
          });

          if (donHangTrans && donHangTrans.khuyenMaiID) {
            const km = await KhuyenMai.findOne({
              where: { khuyenMaiID: donHangTrans.khuyenMaiID },
              transaction: t,
              lock: t.LOCK ? t.LOCK.UPDATE : undefined,
            });

            if (km) {
              km.soLuong = (km.soLuong || 0) + 1;
              if (km.soLuong > 0) km.trangThai = true;
              await km.save({ transaction: t });
            }
          }
        } catch (e) {
          await t.rollback();
          console.error("Lỗi khi hoàn lại mã khuyến mãi:", e);
          return res.status(500).json({ message: e.message });
        }
      }

      // Cập nhật trạng thái đơn hàng
      await DonHang.update(
        { trangThai },
        { where: { donHangID: id }, transaction: t }
      );

      await t.commit();

      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (err) {
      await t.rollback();
      console.error("Lỗi khi cập nhật trạng thái đơn trong transaction:", err);
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: error.message });
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
        },
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

// Xóa đơn hàng theo ID
export const xoaDonHangTheoID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng từ tham số URL
    const donHang = await DonHang.findOne({ where: { donHangID: id } });

    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    await donHang.destroy();
    res.status(200).json({ message: "Đơn hàng đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng theo ID:", error);
    res.status(500).json({ message: error.message });
  }
};
