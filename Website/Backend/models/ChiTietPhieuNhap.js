import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import PhieuNhap from "./PhieuNhap.js";
import Sach from "./Sach.js";

// Model Chi Tiết Phiếu Nhập - Lưu thông tin từng sản phẩm trong phiếu nhập
const ChiTietPhieuNhap = sequelize.define(
  "ChiTietPhieuNhap",
  {
    chiTietPhieuNhapID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phieuNhapID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PhieuNhap,
        key: "phieuNhapID",
      },
    },
    sachID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sach,
        key: "sachID",
      },
    },
    soLuongNhap: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donGiaNhap: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    thanhTien: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
  },
  {
    tableName: "chi_tiet_phieu_nhap",
    timestamps: true,
  }
);

// Quan hệ giữa PhieuNhap và ChiTietPhieuNhap (1-n)
PhieuNhap.hasMany(ChiTietPhieuNhap, {
  foreignKey: "phieuNhapID",
  as: "chiTietPhieuNhaps",
});
ChiTietPhieuNhap.belongsTo(PhieuNhap, {
  foreignKey: "phieuNhapID",
});

// Quan hệ giữa Sach và ChiTietPhieuNhap (1-n)
ChiTietPhieuNhap.belongsTo(Sach, {
  foreignKey: "sachID",
});

export default ChiTietPhieuNhap;
