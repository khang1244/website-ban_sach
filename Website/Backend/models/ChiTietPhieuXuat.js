import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import PhieuXuat from "./PhieuXuat.js";
import Sach from "./Sach.js";

// Model Chi Tiết Phiếu Xuất - Lưu thông tin từng sản phẩm trong phiếu xuất

const ChiTietPhieuXuat = sequelize.define(
  "ChiTietPhieuXuat",
  {
    phieuXuatID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: PhieuXuat,
        key: "phieuXuatID",
      },
    },
    sachID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Sach,
        key: "sachID",
      },
    },
    soLuongXuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donGiaBan: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    thanhTien: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
  },
  {
    tableName: "chi_tiet_phieu_xuat",
    timestamps: true,
  }
);

// Quan hệ giữa PhieuXuat và ChiTietPhieuXuat (1-n)
PhieuXuat.hasMany(ChiTietPhieuXuat, {
  foreignKey: "phieuXuatID",
  as: "chiTietPhieuXuats",
});
ChiTietPhieuXuat.belongsTo(PhieuXuat, {
  foreignKey: "phieuXuatID",
});

// Quan hệ giữa Sach và ChiTietPhieuXuat (1-n)
ChiTietPhieuXuat.belongsTo(Sach, {
  foreignKey: "sachID",
});

export default ChiTietPhieuXuat;
