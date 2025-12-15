import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import DonHang from "./DonHang.js";
import KhachHang from "./KhachHang.js";

// Model Phiếu Xuất - Quản lý các phiếu xuất kho
const PhieuXuat = sequelize.define(
  "PhieuXuat",
  {
    phieuXuatID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    donHangID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "don_hang",
        key: "donHangID",
      },
    },
    khachHangID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "khach_hang",
        key: "khachHangID",
      },
    },
    tenKhachHang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ngayXuat: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    loaiXuat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nguoiXuat: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Hệ thống tự động",
    },
  },
  {
    tableName: "phieu_xuat",
    timestamps: true, // createdAt, updatedAt
  }
);

// Thiết lập quan hệ với DonHang và NguoiDung
PhieuXuat.belongsTo(DonHang, { foreignKey: "donHangID" });
DonHang.hasMany(PhieuXuat, { foreignKey: "donHangID" });

PhieuXuat.belongsTo(KhachHang, { foreignKey: "khachHangID" });
KhachHang.hasMany(PhieuXuat, { foreignKey: "khachHangID" });

export default PhieuXuat;
