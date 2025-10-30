import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

// Định nghĩa model PhuongThucGiaoHang (Delivery Method)
const PhuongThucGiaoHang = sequelize.define(
  "PhuongThucGiaoHang",
  {
    phuongThucGiaoHangID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenPhuongThuc: {
      type: DataTypes.STRING,
      allowNull: false, // Tên phương thức giao hàng (VD: Giao hàng tiêu chuẩn, Giao hàng nhanh, ...)
    },
    phiGiaoHang: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, // Phí giao hàng
    },
    thoiGianGiaoHang: {
      type: DataTypes.STRING,
      allowNull: true, // Thời gian giao hàng dự kiến (VD: "2-3 ngày", "24 giờ", ...)
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active", // active, inactive
    },
    macDinh: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Phương thức giao hàng mặc định
    },
  },
  {
    tableName: "phuong-thuc-giao-hang",
    timestamps: true, // createdAt, updatedAt
  }
);

export default PhuongThucGiaoHang;
