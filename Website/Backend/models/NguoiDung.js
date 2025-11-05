import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

// Định nghĩa model NguoiDung
const NguoiDung = sequelize.define(
  "NguoiDung",
  {
    nguoiDungID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenNguoiDung: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email phải là duy nhất
    },
    matKhau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soDienThoai: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vaiTro: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user", // Mặc định là user, có thể là 'admin'
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Google ID phải là duy nhất
    },
    trangThaiTaiKhoan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Mặc định tài khoản là hoạt động
    },
    diaChi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true, tableName: "nguoi_dung" }
);

export default NguoiDung;
