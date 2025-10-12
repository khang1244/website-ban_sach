import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import Sach from "./Sach.js";
import NguoiDung from "./NguoiDung.js";
const BinhLuan = sequelize.define(
  "BinhLuan",
  {
    binhLuanID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sachID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sach,
        key: "sachID",
      },
    },
    nguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Tham chiếu đến bảng Người Dùng nếu có
      references: {
        model: "nguoi_dung",
        key: "nguoiDungID",
      },
    },
    danhGia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    noiDung: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "binh_luan",
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

export default BinhLuan;

// Liên kết với bảng Sách
BinhLuan.belongsTo(Sach, { foreignKey: "sachID" });
Sach.hasMany(BinhLuan, { foreignKey: "sachID" });

// Liên kết với bảng Người Dùng
BinhLuan.belongsTo(NguoiDung, { foreignKey: "nguoiDungID" });
NguoiDung.hasMany(BinhLuan, { foreignKey: "nguoiDungID" });
