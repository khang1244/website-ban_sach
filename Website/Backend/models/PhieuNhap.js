import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import NguoiDung from "./NguoiDung.js";

// Model Phiếu Nhập - Quản lý các phiếu nhập kho
const PhieuNhap = sequelize.define(
  "PhieuNhap",
  {
    phieuNhapID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: NguoiDung,
        key: "nguoiDungID",
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

// Thiết lập quan hệ với NguoiDung
PhieuNhap.belongsTo(NguoiDung, { foreignKey: "nguoiDungID", as: "nguoiDung" });

export default PhieuNhap;
