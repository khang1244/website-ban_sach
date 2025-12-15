import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import KhachHang from "./KhachHang.js";

// Model Phiếu Nhập - Quản lý các phiếu nhập kho
const PhieuNhap = sequelize.define(
  "PhieuNhap",
  {
    phieuNhapID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    khachHangID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "khach_hang",
        key: "khachHangID",
      },
    },
    ngayNhap: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ghiChu: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "phieu_nhap",
    timestamps: true, // createdAt, updatedAt
  }
);

// Thiết lập quan hệ với KhachHang
PhieuNhap.belongsTo(KhachHang, { foreignKey: "khachHangID", as: "khachHang" });

export default PhieuNhap;
