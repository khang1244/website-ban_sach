import PhuongThucGiaoHang from "../models/PhuongThucGiaoHang.js";
import { Op } from "sequelize";

// Lấy tất cả phương thức giao hàng
export const layTatCaPhuongThucGiaoHang = async (req, res) => {
  try {
    const phuongThucGiaoHangs = await PhuongThucGiaoHang.findAll();
    res.json({
      success: true,
      data: phuongThucGiaoHangs,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phương thức giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách phương thức giao hàng",
    });
  }
};

// Tạo phương thức giao hàng mới
export const taoPhuongThucGiaoHang = async (req, res) => {
  try {
    const { tenPhuongThuc, phiGiaoHang, thoiGianGiaoHang, trangThai, macDinh } =
      req.body;

    // Kiểm tra tên phương thức đã tồn tại chưa
    const existingMethod = await PhuongThucGiaoHang.findOne({
      where: { tenPhuongThuc },
    });

    if (existingMethod) {
      return res.status(400).json({
        success: false,
        message: "Tên phương thức giao hàng đã tồn tại",
      });
    }

    // Nếu đặt làm mặc định, bỏ mặc định của các phương thức khác
    if (macDinh) {
      await PhuongThucGiaoHang.update(
        { macDinh: false },
        { where: { macDinh: true } }
      );
    }

    const phuongThucGiaoHangMoi = await PhuongThucGiaoHang.create({
      tenPhuongThuc,
      phiGiaoHang: parseFloat(phiGiaoHang),
      thoiGianGiaoHang,
      trangThai: trangThai || "active",
      macDinh: macDinh || false,
    });

    res.status(201).json({
      success: true,
      message: "Đã tạo phương thức giao hàng mới",
      data: phuongThucGiaoHangMoi,
    });
  } catch (error) {
    console.error("Lỗi khi tạo phương thức giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo phương thức giao hàng",
    });
  }
};

// Cập nhật phương thức giao hàng
export const capNhatPhuongThucGiaoHang = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenPhuongThuc, phiGiaoHang, thoiGianGiaoHang, trangThai, macDinh } =
      req.body;

    const phuongThucGiaoHang = await PhuongThucGiaoHang.findByPk(id);

    if (!phuongThucGiaoHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức giao hàng",
      });
    }

    // Kiểm tra tên phương thức đã tồn tại chưa (ngoại trừ chính nó)
    if (tenPhuongThuc) {
      const existingMethod = await PhuongThucGiaoHang.findOne({
        where: {
          tenPhuongThuc,
          phuongThucGiaoHangID: { [Op.ne]: id }, // Không so sánh với chính nó
        },
      });

      if (existingMethod) {
        return res.status(400).json({
          success: false,
          message: "Tên phương thức giao hàng đã tồn tại",
        });
      }
    }

    // Nếu đặt làm mặc định, bỏ mặc định của các phương thức khác
    if (macDinh) {
      await PhuongThucGiaoHang.update(
        { macDinh: false },
        { where: { macDinh: true, phuongThucGiaoHangID: { [Op.ne]: id } } }
      );
    }

    await phuongThucGiaoHang.update({
      tenPhuongThuc: tenPhuongThuc || phuongThucGiaoHang.tenPhuongThuc,
      phiGiaoHang:
        phiGiaoHang !== undefined
          ? parseFloat(phiGiaoHang)
          : phuongThucGiaoHang.phiGiaoHang,
      thoiGianGiaoHang:
        thoiGianGiaoHang !== undefined
          ? thoiGianGiaoHang
          : phuongThucGiaoHang.thoiGianGiaoHang,
      trangThai: trangThai || phuongThucGiaoHang.trangThai,
      macDinh: macDinh !== undefined ? macDinh : phuongThucGiaoHang.macDinh,
    });

    res.json({
      success: true,
      message: "Đã cập nhật phương thức giao hàng",
      data: phuongThucGiaoHang,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật phương thức giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật phương thức giao hàng",
    });
  }
};

// Xóa phương thức giao hàng (soft delete - chuyển trạng thái thành inactive)
export const xoaPhuongThucGiaoHang = async (req, res) => {
  try {
    const { id } = req.params;

    const phuongThucGiaoHang = await PhuongThucGiaoHang.findByPk(id);

    if (!phuongThucGiaoHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức giao hàng",
      });
    }
    await phuongThucGiaoHang.update({ trangThai: "inactive" });

    res.json({
      success: true,
      message: "Đã vô hiệu hóa phương thức giao hàng",
    });
  } catch (error) {
    console.error("Lỗi khi xóa phương thức giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa phương thức giao hàng",
    });
  }
};

// Xóa vĩnh viễn phương thức giao hàng (hard delete)
export const xoaVinhVienPhuongThucGiaoHang = async (req, res) => {
  try {
    const { id } = req.params;

    const phuongThucGiaoHang = await PhuongThucGiaoHang.findByPk(id);

    if (!phuongThucGiaoHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức giao hàng",
      });
    }

    await phuongThucGiaoHang.destroy();

    res.json({
      success: true,
      message: "Đã xóa vĩnh viễn phương thức giao hàng",
    });
  } catch (error) {
    console.error("Lỗi khi xóa vĩnh viễn phương thức giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa vĩnh viễn phương thức giao hàng",
    });
  }
};

// Kích hoạt lại phương thức giao hàng
export const kichHoatPhuongThucGiaoHang = async (req, res) => {
  try {
    const { id } = req.params;

    const phuongThucGiaoHang = await PhuongThucGiaoHang.findByPk(id);

    if (!phuongThucGiaoHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức giao hàng",
      });
    }

    await phuongThucGiaoHang.update({ trangThai: "active" });

    res.json({
      success: true,
      message: "Đã kích hoạt lại phương thức giao hàng",
      data: phuongThucGiaoHang,
    });
  } catch (error) {
    console.error("Lỗi khi kích hoạt phương thức giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi kích hoạt phương thức giao hàng",
    });
  }
};
