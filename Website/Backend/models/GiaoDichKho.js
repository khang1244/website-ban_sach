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
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
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
    tableName: "giao_dich_kho",
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

export default GiaoDichKho;
