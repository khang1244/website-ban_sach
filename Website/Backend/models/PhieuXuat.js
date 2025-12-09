import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import DonHang from "./DonHang.js";
import NguoiDung from "./NguoiDung.js";

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
    nguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "nguoi_dung",
        key: "nguoiDungID",
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

PhieuXuat.belongsTo(NguoiDung, { foreignKey: "nguoiDungID" });
NguoiDung.hasMany(PhieuXuat, { foreignKey: "nguoiDungID" });

export default PhieuXuat;
