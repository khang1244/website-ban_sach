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
        });

        if (!sach) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: `Sách ${item.sachID} không tồn tại` });
        }

        // Kiểm tra tồn kho
        const tongNhap = await sequelize.query(
          `
          SELECT SUM(soLuongNhap) as tongSoLuongNhap
          FROM chi_tiet_phieu_nhap
          WHERE sachID = :sachID
        `,
          {
            replacements: { sachID: item.sachID },
            type: sequelize.QueryTypes.SELECT,
            transaction: t,
          }
        );

        const tongXuat = await sequelize.query(
          `
          SELECT SUM(soLuongXuat) as tongSoLuongXuat
          FROM chi_tiet_phieu_xuat
          WHERE sachID = :sachID
        `,
          {
            replacements: { sachID: item.sachID },
            type: sequelize.QueryTypes.SELECT,
            transaction: t,
          }
        );

        const soLuongNhap = tongNhap[0]?.tongSoLuongNhap || 0;
        const soLuongXuat = tongXuat[0]?.tongSoLuongXuat || 0;
        const tonKhoHienTai = soLuongNhap - soLuongXuat;

        if (tonKhoHienTai < item.soLuong) {
          await t.rollback();
          return res.status(400).json({
            message: `Sách '${sach.tenSach}' không đủ. Tồn kho: ${tonKhoHienTai}, yêu cầu: ${item.soLuong}`,
          });
        }

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

    const trangThaiCu = donHang.trangThai;

    // Nếu đơn hàng đã hủy hoặc đã trả hàng thì không cho phép cập nhật trạng thái nữa
    if (trangThaiCu === "Đã hủy" || trangThaiCu === "Đã trả hàng") {
      return res.status(400).json({
        message:
          "Không thể cập nhật trạng thái của đơn hàng đã hủy hoặc đã trả hàng",
      });
    }

    // Nếu trạng thái không thay đổi thì trả về ok
    if (trangThaiCu === trangThai) {
      return res
        .status(200)
        .json({ message: "Trạng thái đơn hàng không thay đổi" });
    }

    // Dùng transaction để cập nhật trạng thái và hoàn/khấu trừ tồn kho một cách atomic
    const t = await sequelize.transaction();
    try {
      // Khi đơn hàng được hoàn tất/xác nhận => Tạo phiếu xuất để trừ kho
      // Chỉ trừ kho khi đơn được hoàn thành
      if (trangThai === "Hoàn thành" && trangThaiCu !== "Hoàn thành") {
        const chiTiets = await DonHang_Sach.findAll({
          where: { donHangID: id },
          transaction: t,
        });

        // Tạo phiếu xuất bán hàng nếu chưa có
        const phieuXuatBan = await PhieuXuat.findOne({
          where: { donHangID: donHang.donHangID, loaiXuat: "bán hàng" },
          transaction: t,
        });

        if (!phieuXuatBan) {
          const phieuXuatMoi = await PhieuXuat.create(
            {
              donHangID: donHang.donHangID,
              nguoiDungID: donHang.nguoiDungID,
              tenKhachHang: donHang.tenKhachHang,
              ngayXuat: new Date(),
              loaiXuat: "bán hàng",
              nguoiXuat: "Hệ thống tự động",
              ghiChu: `Đơn hàng #${donHang.donHangID} - ${donHang.tenKhachHang}`,
            },
            { transaction: t }
          );

          for (const chiTiet of chiTiets) {
            await ChiTietPhieuXuat.create(
              {
                phieuXuatID: phieuXuatMoi.phieuXuatID,
                sachID: chiTiet.sachID,
                soLuongXuat: chiTiet.soLuong,
                donGiaBan: chiTiet.donGia,
                thanhTien: chiTiet.soLuong * chiTiet.donGia,
              },
              { transaction: t }
            );
          }
        }
      }

      // Khi hủy đơn hàng => chỉ hoàn lại mã khuyến mãi, không tạo phiếu xuất
      if (trangThai === "Đã hủy" && trangThaiCu !== "Đã hủy") {
        // Hoàn lại mã khuyến mãi nếu có
        if (donHang.khuyenMaiID) {
          const km = await KhuyenMai.findOne({
            where: { khuyenMaiID: donHang.khuyenMaiID },
            transaction: t,
          });

          if (km) {
            km.soLuong = (km.soLuong || 0) + 1;
            if (km.soLuong > 0) km.trangThai = true;
            await km.save({ transaction: t });
          }
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

// Trả hàng - Khách hàng trả sản phẩm đã nhận
export const traHang = async (req, res) => {
  try {
    const { donHangID, lyDoTraHang } = req.body;

    // Kiểm tra đơn hàng tồn tại
    const donHang = await DonHang.findOne({
      where: { donHangID },
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

    // Kiểm tra trạng thái đơn hàng (phải là "Hoàn thành" mới được trả)
    if (donHang.trangThai !== "Hoàn thành") {
      return res.status(400).json({
        message: `Không thể trả hàng. Trạng thái đơn hàng phải là "Hoàn thành", hiện tại là "${donHang.trangThai}"`,
      });
    }

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const t = await sequelize.transaction();
    try {
      // 1. Cập nhật trạng thái đơn hàng thành "Đã trả hàng"
      donHang.trangThai = "Đã trả hàng";
      donHang.ghiChu = lyDoTraHang || donHang.ghiChu;
      await donHang.save({ transaction: t });

      // 2. Tạo phiếu xuất loại "Khách trả hàng"
      const phieuXuatMoi = await PhieuXuat.create(
        {
          donHangID: donHangID,
          nguoiDungID: donHang.nguoiDungID,
          tenKhachHang: donHang.tenKhachHang,
          ngayXuat: new Date(),
          loaiXuat: "Khách trả hàng",
          ghiChu: `Lí do trả hàng: ${lyDoTraHang || "Không có lí do"}`,
          nguoiXuat: "Hệ thống tự động",
        },
        { transaction: t }
      );

      // 3. Tạo chi tiết phiếu xuất và tăng số lượng tồn kho
      for (const sach of donHang.Saches) {
        const soLuong = sach.DonHang_Sach.soLuong;

        // Tạo chi tiết phiếu xuất
        // Lưu soLuongXuat là SỐ ÂM (-) để khi tính tồn kho: Nhập - Xuất sẽ cộng lại
        // Ví dụ: 10 nhập - (-10 xuất) = 10 + 10 = 20
        await ChiTietPhieuXuat.create(
          {
            phieuXuatID: phieuXuatMoi.phieuXuatID,
            sachID: sach.sachID,
            soLuongXuat: -soLuong, // SỐ ÂM - để cộng lại tồn kho
            donGiaBan: sach.DonHang_Sach.donGia,
            thanhTien: soLuong * sach.DonHang_Sach.donGia, // Thành tiền giữ dương để dễ đọc (tiền hoàn lại)
          },
          { transaction: t }
        );
      }

      await t.commit();

      res.status(200).json({
        message: "Trả hàng thành công. Phiếu xuất đã được tạo",
        donHangID,
        phieuXuatID: phieuXuatMoi.phieuXuatID,
      });
    } catch (err) {
      await t.rollback();
      console.error("Lỗi transaction khi trả hàng:", err);
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error("Lỗi khi trả hàng:", error);
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
