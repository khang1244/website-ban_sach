import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

const KhuyenMai = sequelize.define(
  "KhuyenMai",
  {
    khuyenMaiID: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    giaTriGiam: {
      type: DataTypes.INTEGER, // Phần trăm giảm giá
      allowNull: false,
    },
    moTa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ngayHetHan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    giaCoBan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trangThai: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Mặc định khuyến mãi còn hiệu lực
    },
  },
  {
    tableName: "khuyen_mai",
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

export default KhuyenMai;
