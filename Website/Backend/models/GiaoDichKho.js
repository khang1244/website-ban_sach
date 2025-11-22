import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

const GiaoDichKho = sequelize.define(
  "GiaoDichKho",
  {
    maGiaoDich: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    loaiGiaoDich: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ngayGiaoDich: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    tenSanPham: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Tham chiếu tới Sach (nếu có)
    sachID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "sach",
        key: "sachID",
      },
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    // Tồn kho trước khi giao dịch
    soLuongTruoc: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Tồn kho sau khi giao dịch
    soLuongSau: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    giaBan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nguoiThucHien: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ghiChu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "ton_kho",
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

export default GiaoDichKho;
